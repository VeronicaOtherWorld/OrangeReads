import clientPromise from "@/lib/mongo";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { postId, userId, msg, visibleTo } = body;

  if (!postId || !userId || !msg || !visibleTo?.length) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  const comment = {
    id: "comment_" + nanoid(8),
    postId,
    userId,
    msg,
    time: new Date(),
    visibleTo,
  };

  await db.collection("swapComment").insertOne(comment);

  return NextResponse.json({ message: "comment added" }, { status: 201 });
}
