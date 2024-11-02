import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ storeId: string }>;
  }
) {
  const storeId = (await params).storeId;
  const { productIds } = await req.json();

  if (!productIds) {
    return new NextResponse("Missing 'productIds' in request body", {
      status: 400,
    });
  }


  await db.order.create({
    data: {
      storeId: storeId,
      isPaid: true,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId,
            },
          },
        })),
      },
    },
  });

  await db.product.updateMany({
    where: {
      id: { in: productIds },
    },
    data: {
      isArchived: true,
    },
  });

  return NextResponse.json({ message: "successfully ordered!" });
}
