import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "no user id" }, { status: 400 });
  }
  try {
    const client = await clientPromise;
    const db = client.db();

    const mapdata = await db.collection("mapdata").findOne({ userId });
    console.log("mapdata.countryBooks", mapdata?.countryBooks);

    if (!mapdata)
      return NextResponse.json({ countryBooks: [] }, { status: 200 });

    // return res with book count and title
    const res = await Promise.all(
      mapdata.countryBooks.map(async (item) => {
        const books = await db
          .collection("orderItem")
          .find({ bookId: { $in: item.bookIds } })
          .project({ title: 1, _id: 0 })
          .toArray();

        const titles = books.map((b) => b.title);
        return { country: item.country, titles, count: titles.length };
      })
    );
    return NextResponse.json({ countryBooks: res }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
