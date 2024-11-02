/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'date-fns'
import { formatter } from '@/lib/utils'

import { ProductClient } from './components/client'
import { ProductColumn } from './components/columns'
import { db } from '@/lib/db'

const ProductsPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>
}) => {
  const storeId = (await params).storeId
  const products = await db.product.findMany({
    where: {
      storeId: storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedProducts: ProductColumn[] = products.map((product: any) => ({
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    price: formatter.format(product.price),
    createdAt: format(product.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  )
}

export default ProductsPage
