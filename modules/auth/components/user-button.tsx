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
            "relative rounded-full border border-zinc-700/60 bg-zinc-900/70 p-0.5 transition hover:border-zinc-500/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/60",
          )}
          aria-label="Open user menu"
        >
          <Avatar size="lg" className="ring-1 ring-zinc-700/40">
            <AvatarImage
              src={user?.image ?? undefined}
              alt={user?.name ?? "User avatar"}
            />
            <AvatarFallback className="bg-zinc-800 text-zinc-100">
              <User className="size-4" />
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="mr-4 w-56 rounded-xl border border-zinc-700/50 bg-zinc-900/95 p-1.5 text-zinc-200 backdrop-blur-md"
      >
        <DropdownMenuItem className="pointer-events-none rounded-lg text-zinc-300 focus:bg-transparent focus:text-zinc-300">
          <span className="truncate text-sm">
            {user?.email ?? "Signed in user"}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-zinc-700/60" />
        <LogoutButton>
          <DropdownMenuItem className="rounded-lg focus:bg-gray-300 ">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
