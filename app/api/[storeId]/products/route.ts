import getCurrentUser from '@/actions/getCurrentUser';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server'


export async function POST(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json()
    const {
      name,
      price,
      images,
      isFeatured,
      isArchived,
    } = body

    if (!currentUser) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Missing name', { status: 400 })
    }

    if (!price) {
      return new NextResponse('Missing price', { status: 400 })
    }

    if (!images || !images.length) {
      return new NextResponse('Missing images', { status: 400 })
    }

    if (!params.storeId) {
      return new NextResponse('Missing storeId', { status: 400 })
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId: currentUser.id,
      },
    })

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const product = await db.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    })

    return new NextResponse(JSON.stringify(product), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.log('[PRODUCTS_POST]', error)

    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { searchParams } = new URL(req.url)
    const isFeatured = searchParams.get('isFeatured')

    if (!params.storeId) {
      return new NextResponse('Missing storeId', { status: 400 })
    }

    const products = await db.product.findMany({
      where: {
        storeId: params.storeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return new NextResponse(JSON.stringify(products), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.log('[PRODUCTS_GET]', error)

    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
