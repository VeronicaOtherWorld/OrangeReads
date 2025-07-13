import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "no eamil or password" },
        { status: 400 }
      );
    }
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("user");

    // check if already exist
    const existedUser = await users.findOne({ email });
    if (existedUser) {
      return NextResponse.json({ error: "user exists" }, { status: 409 });
    }

    const hasdedPwd = await bcrypt.hash(password, 10);
    const userId = "user_" + nanoid(6);
    // insert
    await users.insertOne({
      userId,
      email,
      password: hasdedPwd,
      orders: [],
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
