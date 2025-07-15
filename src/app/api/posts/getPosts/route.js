import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const posts = await db
      .collection("swapPost")
      .find({ createdAt: -1 })
      .toAray();

    // get rid of the _id attribute
    const cleaned = posts.map(({ _id, ...rest }) => rest);

    return NextResponse.json(cleaned);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
