import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import getCurrentUser from '@/actions/getCurrentUser';
import { db } from '@/lib/db';

export default async function SetupLayout({
  children,
}: {
  children: ReactNode
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect('/sign-in')
  }

  const store = await db.store.findFirst({
    where: {
      userId: currentUser.id,
    },
  })


  if (store) {
    redirect(`/${store.id}`)
  }

  return <>{children}</>
}
