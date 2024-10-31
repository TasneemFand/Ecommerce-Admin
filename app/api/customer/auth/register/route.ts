import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await db.customer.findUnique({ where: { email } });
    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ error: "Email already in use!" }),
        {
          status: 409,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:3001",
          },
        }
      );
    }

    const user = await db.customer.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return new NextResponse(JSON.stringify(user), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3001",
      },
    });
  } catch (error) {
    console.log("[CustomerRegister_POST]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3001",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
