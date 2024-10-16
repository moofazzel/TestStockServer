import dbConnect from "@/lib/db";
import { StockServerUser } from "@/models/user-model";

import { saltAndHashPassword } from "@/utils/saltAndHashPassword";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({
        message: "Full Name, Email and password are required",
        status: 400,
      });
    }

    await dbConnect();

    const existingUser = await StockServerUser.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists", status: 400 });
    }

    const hashedPassword = await saltAndHashPassword(password);
    const newUser = new StockServerUser({
      username: username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json({ message: "User created", status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ message: "Error creating user", status: 500 });
  }
}
