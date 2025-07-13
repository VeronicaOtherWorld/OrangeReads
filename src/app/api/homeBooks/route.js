import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";
import { getAuthorNationality } from "@/utils/getAuthorNationality";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const books = await db
      .collection("books")
      .find({ nationality: { $exists: true, $ne: "" } })
      .limit(15)
      .toArray();
    return NextResponse.json({ books });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}
