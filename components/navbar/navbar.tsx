import { redirect } from "next/navigation";
import getCurrentUser from "@/actions/getCurrentUser";
import { db } from "@/lib/db";
import { MainNav } from "./main-nav";
import { Button } from "../ui/button";
import { StoreIcon } from "lucide-react";
import { UserButton } from "./user-button";

export default async function Navbar() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/sign-in");
  }

  const store = await db.store.findFirst({
    where: {
      userId: currentUser.id,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-label="Select a store"
          className={"justify-between gap-2"}
        >
          <StoreIcon className="h-4 w-4" />
          {store?.name}
        </Button>
        <MainNav className="mx-6" />

        <div className="ml-auto flex items-center space-x-4">
            <UserButton currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
}
