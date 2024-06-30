import { SignIn, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Briefcase, HomeIcon, MessagesSquare, SearchIcon, UsersIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <div className="flex items-center p-2 max-w-6xl mx-auto">
      <Image
        className="rounded-lg"
        src="https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg"
        alt="logo"
        width={40}
        height={40}
      />

      <div className="flex-1">
        <form className="flex items-center space-x-1 bg-gray-100 p-2 rounded-md flex-1 mx-2 max-w-96">
          <SearchIcon className="h-4 text-gray-600" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none border-none flex-1"
          />
        </form>
      </div>

      <div className="flex items-center space-x-4">
        <Link href="/" className="icon"> 
          <HomeIcon className="h-5" />
          <p>Home</p>
        </Link>
        <Link href="/" className="icon hidden md:flex"> 
          <UsersIcon className="h-5" />
          <p>Home</p>
        </Link>
        <Link href="/" className="icon hidden md:flex"> 
          <Briefcase className="h-5" />
          <p>Home</p>
        </Link>
        <Link href="/" className="icon"> 
          <MessagesSquare className="h-5" />
          <p>Home</p>
        </Link>

        {/* User button if authorized */}
        <SignedIn>
          <UserButton />
        </SignedIn>

        {/* Sign In if not */}
        <SignedOut>
          <Button asChild variant="secondary">
            <SignInButton />
          </Button>
        </SignedOut>
      </div>
    </div>
  );
};

export default Header;
