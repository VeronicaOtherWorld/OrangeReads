import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function POST(req) {
  try {
    const { title, description, img } = await req.json();
    if (!title || !description) {
      return NextResponse.json(
        { error: "title and description are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const post = {
      id: "post_" + nanoid(8),
      posterId: "user001",
      postContent: description,
      responserId: "",
      createdAt: new Date(),
      img: img || "",
    };
    await db.collection("swapPost").insertOne(post);
    return NextResponse.json(
      { message: "posted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
