import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
    };
  }
) {
  const { productIds } = await req.json();

  if (!productIds) {
    return new NextResponse("Missing 'productIds' in request body", {
      status: 400,
    });
  }

  const products = await db.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const order = await db.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
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

  return NextResponse.json({ message: "successfully ordered!" });
}
