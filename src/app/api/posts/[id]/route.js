import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const id = params?.id;
  const client = await clientPromise;
  const db = client.db();
  const post = await db.collection("swapPost").findOne({ id });

  if (!post) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}
