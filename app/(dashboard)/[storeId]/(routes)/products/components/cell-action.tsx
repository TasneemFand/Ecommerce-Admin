'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

import axios from 'axios'
import { Edit, MoreHorizontal, Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { AlertModal } from '@/components/modals/alert-modal'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { ProductColumn } from './columns'

interface CellActionProps {
  data: ProductColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onDelete = async () => {
    try {
      setIsLoading(true)

      await axios.delete(`/api/${params?.storeId}/products/${data.id}`)
      router.refresh()
      router.push(`/${params?.storeId}/products`)
      toast.success('Product deleted.')
    } catch (error) {
      toast.error('Something went wrong.')
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
        }}
        onConfirm={onDelete}
        isLoading={isLoading}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() =>
              router.push(`/${params?.storeId}/products/${data.id}`)
            }
          >
            <Edit className="w-4 h-4 mr-2" /> Update
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            <Trash className="w-4 h-4 mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
