import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// env
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "missing email or pwd" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection("user").findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const matchedPwd = await bcrypt.compare(password, user.password);
    if (!matchedPwd) {
      return NextResponse.json({ error: "invalid password" }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.userId, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    const res = NextResponse.json(
      { message: "login successfully" },
      { status: 200 }
    );

    res.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
