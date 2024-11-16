"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LinkIcon, LogOut, User } from "lucide-react";
import { supabase } from "@/utils/superbase/client";

import { useRouter } from "next/navigation";
import { useSession } from "./SessionProvider";

const Header = () => {
  const { session, setUserSession } = useSession();

  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      setUserSession({ user: null });
      router.push("/auth");
    }
  };

  const handleLogin = () => {
    router.push("/auth");
    router.refresh();
  };

  return (
    <header className="py-5  md:px-10 px-4 border-b-2">
      <nav className="flex justify-between items-start">
        <div
          className="border-2 p-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          {/* <Image
            src="/vercel.svg"
            width={100}
            height={100}
            alt="Url shortner logo"
            
          /> */}
          Url Shortner
        </div>
        <div className="md:mr-10">
          {!session.user ? (
            <Button className="bg-primary" onClick={handleLogin}>
              Login
            </Button>
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
                  <DropdownMenuItem
                    onClick={() => {
                      router.push("/dashboard");
                    }}
                  >
                    <LinkIcon className="mr-2 w-4 h-4" /> Links
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
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
