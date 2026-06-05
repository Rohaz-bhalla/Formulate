"use client";

import { ModeToggle } from "./ModeToggle";
import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "./ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <Link href="/">
          <h1 className="text-xl font-extrabold tracking-tight bg-linear-to-r from-gray-700 to-gray-400 bg-clip-text text-transparent dark:from-gray-200 dark:to-gray-500">
            Formulate.
          </h1>
        </Link>

        <div className="flex items-center gap-2">
          
          {isLoaded && isSignedIn && (
            <Link href="/explore">
              <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs font-medium mr-2">
                <Compass className="h-3.5 w-3.5" /> Explore Showcase
              </Button>
            </Link>
          )}

          <ModeToggle />

          {isLoaded && (
            <>
              {!isSignedIn ? (
                <SignInButton mode="modal">
                  <Button size="sm" className="h-9 ml-2">Sign In</Button>
                </SignInButton>
              ) : (
                <div className="ml-2 flex items-center">
                  <UserButton />
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </header>
  );
}