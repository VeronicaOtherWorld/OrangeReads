import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";
import { verifyJWT } from "@/utils/verifyJWT";

export async function GET(req) {
  let token;
  try {
    token = req.cookies.get("token")?.value;
  } catch (err) {
    console.error("Failed to get token from cookie", err);
    return NextResponse.json(
      { error: "Failed to read cookie" },
      { status: 400 }
    );
  }

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = verifyJWT(token);
  } catch (err) {
    console.error("JWT verification failed", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  const userId = decoded.userId;
  if (!userId) {
    return NextResponse.json({ error: "No user ID" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  const mapdata = await db.collection("mapdata").findOne({ userId });
  if (!mapdata) {
    return NextResponse.json({ countryBooks: [] }, { status: 200 });
  }

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
}
