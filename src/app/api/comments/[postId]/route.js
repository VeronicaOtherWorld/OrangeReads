import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const postId = params.postId;
  const client = await clientPromise;
  const db = client.db();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "missing user id" }, { status: 400 });
  }

  const comments = await db
    .collection("swapComment")
    .find({ postId })
    .sort({ time: 1 })
    .toArray();

  return NextResponse.json(comments);
}
