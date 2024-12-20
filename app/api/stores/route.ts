import getCurrentUser from "@/actions/getCurrentUser";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { name } = body;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Missing name", { status: 400 });
    }

    const store = await db.store.create({
      data: {
        name,
        userId: currentUser.id,
      },
    });
    const cookiesData = await cookies(); // Ensure that cookies() is awaited if needed in your environment
    cookiesData.set({
      name: "currentStore",
      value: store, // Replace with actual token
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day expiration
    });
    return new NextResponse(JSON.stringify(store), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("[STORES_POST]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
