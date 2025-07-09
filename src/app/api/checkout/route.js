import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { nanoid } from "nanoid";

export async function POST(req) {
  try {
    const { userId, cartItems } = await req.json();
    if (!userId || !cartItems || cartItems.length <= 0) {
      return NextResponse.json({ erorr: "missing info" }, { status: 400 });
    }

    const client = await clientPromise;
    // default database
    const db = client.db();

    const orderId = "order_" + nanoid(8);
    const createdAt = new Date();

    const orderItems = cartItems.map((item) => ({
      id: "item_" + nanoid(8),
      orderId,
      bookId: item.id,
      quantity: item.quantity,
      title: item.title,
      author: item.author,
      nationality: item.nationality,
      cover: item.cover,
      price: item.price,
    }));

    // insert to orderitem
    await db.collection("orderItem").insertMany(orderItems);
    //insert to orders
    const itemIds = orderItems.map((item) => item.id);
    await db.collection("order").insertOne({
      orderId,
      userId,
      items: itemIds,
      createdAt,
    });
    // update the user collection, add the orderid into it
    // reference to the reading map
    await db
      .collection("user")
      .updateOne({ id: userId }, { $push: { orders: orderId } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
