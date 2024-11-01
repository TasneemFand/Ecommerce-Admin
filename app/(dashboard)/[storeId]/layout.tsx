import { ReactNode, Suspense } from "react";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar/navbar";
import getCurrentUser from "@/actions/getCurrentUser";
import { db } from "@/lib/db";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { storeId: string };
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/sign-in");
  }

  const store = await db.store.findFirst({
    where: {
      id: params.storeId,
      userId: currentUser.id,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div>
      <Navbar />
      <Suspense fallback={<div>loading</div>}>{children}</Suspense>
    </div>
  );
}
