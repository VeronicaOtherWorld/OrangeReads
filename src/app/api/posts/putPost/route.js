import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { verifyJWT } from "@/utils/verifyJWT";
export async function POST(req) {
  let decoded;
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "not auth" }, { status: 401 });
    }
    decoded = verifyJWT(token);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "invalid token" }, { status: 403 });
  }
  const userId = decoded.userId;
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
      posterId: userId,
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
