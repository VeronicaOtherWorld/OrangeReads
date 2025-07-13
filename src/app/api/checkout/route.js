import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { nanoid } from "nanoid";

export async function POST(req) {
  // in case the country name is not match
  const countryNameMap = {
    "United States": "United States of America",
    UK: "United Kingdom",
    Russia: "Russian Federation",
    "South Korea": "Republic of Korea",
  };

  try {
    // const { userId, cartItems } = await req.json();
    // fix userId for test TODO
    const userId = "user001";
    const { cartItems } = await req.json();
    if (!userId || !cartItems || cartItems.length <= 0) {
      return NextResponse.json({ erorr: "missing info" }, { status: 400 });
    }

    const client = await clientPromise;
    // default database
    const db = client.db();

    const orderId = "order_" + nanoid(8);
    const createdAt = new Date();

    const orderItems = cartItems.map((item) => ({
      orderId,
      bookId: item.id,
      quantity: item.quantity,
      title: item.title,
      author: item.author,
      nationality: item.nationality,
      cover: item.cover,
      price: item.price,
    }));

    const result = await db.collection("orderItem").insertMany(orderItems);
    // the items id array from mongo db
    const itemObjectIds = Object.values(result.insertedIds);

    // insert to order collection
    await db.collection("order").insertOne({
      orderId,
      userId,
      items: itemObjectIds,
      createdAt,
    });
    // update the user collection, add the orderid into it
    // reference to the reading map
    await db
      .collection("user")
      .updateOne({ userId: userId }, { $push: { orders: orderId } });

    const exists = await db.collection("user").findOne({ userId });
    console.log("USER FOUND?", exists);

    // 3. update mapdata collection

    const mapdata = await db.collection("mapdata").findOne({ userId });
    if (!mapdata) {
      const countryBooks = cartItems.reduce((acc, item) => {
        const nat = countryNameMap[item.nationality] || item.nationality;
        if (!acc[nat]) acc[nat] = [];
        // response  book title
        acc[nat].push(item.id);
        return acc;
      }, {});
      const formatted = Object.entries(countryBooks).map(
        ([country, bookIds]) => ({
          country,
          bookIds,
        })
      );

      await db
        .collection("mapdata")
        .insertOne({ userId, countryBooks: formatted, updatedAt: new Date() });
    } else {
      const updates = {};
      cartItems.forEach((item) => {
        const nat = countryNameMap[item.nationality] || item.nationality;
        if (!updates[nat]) updates[nat] = [];
        // response book title
        updates[nat].push(item.id);
      });

      const countryBooks = mapdata.countryBooks || [];
      const mergedMap = {};

      // add old data
      countryBooks.forEach((item) => {
        mergedMap[item.country] = item.bookIds || [];
      });

      // add new data

      for (const country in updates) {
        if (!mergedMap[country]) mergedMap[country] = [];
        mergedMap[country].push(...updates[country]);
      }

      const merged = Object.entries(mergedMap).map(([country, bookIds]) => ({
        country,
        bookIds,
      }));

      await db
        .collection("mapdata")
        .updateOne(
          { userId },
          { $set: { countryBooks: merged, updatedAt: new Date() } }
        );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
