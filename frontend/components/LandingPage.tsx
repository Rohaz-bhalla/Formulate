"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignUpButton, SignInButton } from "@clerk/nextjs";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-500 mt-12 sm:mt-24">
      <div className="inline-flex items-center rounded-full border px-2.5 py-2 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-6">
        Formulate AI Layout Engine v1.0
      </div>
      
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 bg-linear-to-b from-foreground to-muted-foreground bg-clip-text text-transparent leading-[1.1]">
        Build websites at the speed of thought.
      </h1>
      
      <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
        Describe your brand, aesthetic, and offerings. Formulate instantly compiles responsive, production-ready landing pages customized for your business.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
        <SignUpButton mode="modal">
          <Button size="lg" className="h-12 px-8 w-full sm:w-auto text-base font-semibold gap-2 shadow-lg">
            Start Building for Free <ArrowRight className="h-4 w-4" />
          </Button>
        </SignUpButton>
        
        <SignInButton mode="modal">
          <Button variant="outline" size="lg" className="h-12 px-8 w-full sm:w-auto text-base font-semibold">
            Sign In to Workspace
          </Button>
        </SignInButton>
      </div>
    </div>
  );
}