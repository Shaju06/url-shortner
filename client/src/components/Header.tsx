"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link2, Link2Icon, LinkIcon, LogOut, User } from "lucide-react";

const Header = () => {
  const user = true;
  const [position, setPosition] = useState("bottom");

  return (
    <header className="p-5 border-b-2">
      <nav className="flex justify-between px-10 items-start">
        <div>
          <Image
            src="/vercel.svg"
            width={100}
            height={100}
            alt="Url shortner logo"
          />
        </div>
        <div className="mr-10">
          {!user ? (
            <Button variant={"outline"}>Login</Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel className="flex">
                  <User className="mr-2 w-4 h-4" /> My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <LinkIcon className="mr-2 w-4 h-4" /> Links
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
