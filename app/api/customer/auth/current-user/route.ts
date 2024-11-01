// admin-app/app/api/customer/getCustomer/route.js
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    const token = req.nextUrl.searchParams.get("authToken");
    const cookiesData = await cookies(); // Ensure that cookies() is awaited if needed in your environment
    cookiesData.set({
      name: "authToken",
      value: token, // Replace with actual token
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day expiration
    });
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    // Find the customer
    const customer = await db.customer.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, store: true },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer, { status: 200 });
  } catch (error) {
    console.error("Error in getCustomer:", error);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 403 }
    );
  }
}
