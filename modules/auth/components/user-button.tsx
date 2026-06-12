"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { LogOut, User } from "lucide-react";
import LogoutButton from "./logout-button";
import { Session } from "next-auth";

interface UserButtonProps {
  user?: Session["user"];
}

const UserButton = ({ user }: UserButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "group relative rounded-full border border-white/10 bg-white/3 p-0.75 backdrop-blur-md transition-all duration-200 hover:border-white/20 hover:bg-white/6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
          )}
          aria-label="Open user menu"
        >
          <div className="absolute inset-0 rounded-full bg-linear-to-b from-white/10 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

          <Avatar className="h-10 w-10 ring-1 ring-white/10">
            <AvatarImage
              src={user?.image ?? undefined}
              alt={user?.name ?? "User avatar"}
            />

            <AvatarFallback className="bg-zinc-900 text-zinc-100">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-60 rounded-2xl border border-white/10 bg-black/95 p-2 text-white shadow-2xl backdrop-blur-xl overflow-hidden"
      >
        <div className="px-3 py-2">
          <p className="truncate text-sm font-medium text-white">
            {user?.name ?? "User"}
          </p>

          <p className="truncate text-xs text-gray-400">
            {user?.email ?? "Signed in user"}
          </p>
        </div>

        <DropdownMenuSeparator className="my-1 bg-white/10" />

        <LogoutButton>
          <DropdownMenuItem className="group cursor-pointer rounded-xl px-3 py-2.5 text-sm text-gray-300 transition-colors focus:bg-white/10 focus:text-white">
            <LogOut className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
