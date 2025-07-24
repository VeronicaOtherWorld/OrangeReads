import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

// get post detail
export async function GET(req, { params }) {
  const id = params.id;
  const client = await clientPromise;
  const db = client.db();
  const post = await db.collection("swapPost").findOne({ id });

  if (!post) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}

// put edit update post
export async function PUT(request, { params }) {
  const id = params.id;
  const body = await request.json();
  const { title, postContent, img } = body;

  const client = await clientPromise;
  const db = client.db();

  const result = await db
    .collection("swapPost")
    .updateOne(
      { id },
      { $set: { title, postContent, img, updatedAt: new Date() } }
    );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "updated successfully" });
}

// delete
export async function DELETE(_, { params }) {
  const id = params.id;
  const client = await clientPromise;
  const db = client.db();
  const res = await db.collection("swapPost").deleteOne({ id });
  if (res.deletedCount === 0) {
    return NextResponse.json({ error: "failed delete" }, { status: 400 });
  }
  return NextResponse.json({ message: "delete successfully" });
}
