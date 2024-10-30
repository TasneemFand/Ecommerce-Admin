'use client'

import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

import { columns, ProductColumn } from './columns'
import { DataTable } from '@/components/ui/data-table'

interface ProductClientProps {
  data: ProductColumn[]
}

export const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${data.length})`}
          description="Update your store's products."
        />

        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className="mr-2 w-4 h-4" />
          Add Product
        </Button>
      </div>

      <Separator />

      <DataTable columns={columns} data={data} searchKey="name" />
    </>
  )
}
