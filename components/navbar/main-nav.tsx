'use client'

import { HTMLAttributes } from 'react'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

export function MainNav({ className, ...props }: HTMLAttributes<HTMLElement>) {
  const pathName = usePathname()
  const params = useParams()

  const routes = [
    {
      href: `/${params?.storeId}/products`,
      label: 'Products',
      active: pathName === `/${params?.storeId}/products`,
    },
    {
      href: `/${params?.storeId}/orders`,
      label: 'Orders',
      active: pathName === `/${params?.storeId}/orders`,
    },
  ]

  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active
              ? 'text-black'
              : 'text-muted-foreground',
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
