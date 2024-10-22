"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {  ChevronDown, UserCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";


const Navbar = () => {
  const { data: session } = useSession();

  const router = useRouter();
  return (
    <div className="navbar-style flex justify-between items-center px-16 py-3 bg-fuchsia-600 text-white">
      <div className="logo text-lg">User Dashboard</div>
      {session?.user ? (
        <div className="flex gap-3 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex gap-2">
                <UserCircle />
                <span>{session?.user?.username}</span>
                <ChevronDown />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  signOut();
                  router.replace("/sign-in");
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Button onClick={() => router.replace("/sign-in")}>Login</Button>
      )}
    </div>
  );
};

export default Navbar;
