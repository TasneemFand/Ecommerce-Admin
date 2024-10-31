import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const existingUser = await db.customer.findUnique({ where: { email } });

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return NextResponse.json(
        { error: "Email does not exist!" },
        { status: 404 }
      );
    }

    try {
      // Verify the password
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      // Create a JWT token for the user
      const token = await jwt.sign(
        { id: existingUser.id, email: existingUser.email },
        process.env.NEXTAUTH_SECRET!,
        { expiresIn: "1d" } // Set an expiration time as needed
      );
      // Set HttpOnly cookie with the token
      const response = NextResponse.json(
        { token, user: existingUser },
        { status: 200 }
      );
      return response;
    } catch (error) {
      // Handle unexpected sign-in errors
      return NextResponse.json(
        { error: "Something went wrong during sign-in!" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.log("[CustomerlogIn_POST]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
