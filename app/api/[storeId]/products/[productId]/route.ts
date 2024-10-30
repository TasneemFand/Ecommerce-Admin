import getCurrentUser from "@/actions/getCurrentUser";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Missing productId", { status: 400 });
    }

    const product = await db.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
      },
    });

    return new NextResponse(JSON.stringify(product), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("[PRODUCT_GET]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const {
      name,
      price,
      images,
      isFeatured,
      isArchived,
    } = body;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Missing name", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Missing price", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Missing images", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Missing productId", { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId: currentUser.id,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        images: {
          deleteMany: {},
        },
      },
    });

    const product = await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return new NextResponse(JSON.stringify(product), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("Missing productId", { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId: currentUser.id,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const product = await db.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return new NextResponse(JSON.stringify(product), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
