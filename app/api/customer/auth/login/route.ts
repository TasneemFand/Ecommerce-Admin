import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

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
      // Check password (adjust if passwords are hashed)
      const passwordMatch = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!passwordMatch) {
        return NextResponse.json(
          { error: "Invalid credentials!" },
          { status: 401 }
        );
      }

      // If sign-in is successful, return success message
      return NextResponse.json(
        { success: "Successfully logged in!" },
        { status: 200 }
      );
    } catch (error) {
      // Handle unexpected sign-in errors
      console.error("Sign-in Error:", error);
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
