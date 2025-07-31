import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { verifyJWT } from "@/utils/verifyJWT";
import { cookies } from "next/headers";
export async function POST(req) {
  let decoded;
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "not auth" }, { status: 401 });
    }
    decoded = verifyJWT(token);
    if (!decoded?.userId) {
      return NextResponse.json(
        { error: "invalid token payload" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "invalid token" }, { status: 403 });
  }
  const userId = decoded.userId;
  try {
    const { title, postContent, img } = await req.json();
    console.log("server received:", { title, postContent, img });
    if (!title || !postContent) {
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
      title,
      postContent,
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
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
