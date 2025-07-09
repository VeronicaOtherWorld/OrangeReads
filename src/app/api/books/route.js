import { NextResponse } from "next/server";
import { fetchAndSaveBook } from "@/utils/fetchandSaveData";
import clientPromise from "@/lib/mongo";

export async function GET() {
  console.log("/api/books be called");
  try {
    // fetch books data from api
    // await fetchAndSaveBook();

    // fetch data from database
    const client = await clientPromise;
    const db = client.db("orangereads");
    const books = await db.collection("books").find().toArray();
    return NextResponse.json({
      success: true,
      message: "get books successufuly",
      books,
    });
  } catch (err) {
    console.error("failed", err);
    return NextResponse.json(
      { success: false, err: err.message || "wrong" },
      { status: 500 }
    );
  }
}
