"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "@prisma/client";

interface UserButtonProps {
  currentUser: User
}


export const UserButton: React.FC<UserButtonProps> = ({ currentUser }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  if (!currentUser) return null;

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="relative inline-block text-left">
      <button onClick={toggleMenu} className="flex items-center space-x-2">
        {/* <img
          src={session?.user?.image || "/default-avatar.png"}
          alt="User Avatar"
          className="w-8 h-8 rounded-full"
        /> */}
        <Avatar>
          <AvatarImage src={"/default-avatar.png"} />
          <AvatarFallback>{currentUser?.name?.at(0)}</AvatarFallback>
        </Avatar>
        <span>{currentUser?.name}</span>
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button
              onClick={() => signOut()}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
