"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated 404 Illustration */}
        <div className="mb-8 relative">
          <div className="text-[200px] font-bold text-primary/10 select-none leading-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Animated college building */}
              <svg
                className="w-32 h-32 text-primary animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Oops! This College is Hiding!</h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto text-pretty">
          We searched through all our campuses, but this page seems to have graduated already. Let's get you back on
          track!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" asChild>
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Go Back Home
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/colleges">
              <Search className="mr-2 h-5 w-5" />
              Browse Colleges
            </Link>
          </Button>
        </div>

        {/* Fun College-themed quote */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg border border-border/50 max-w-md mx-auto">
          <p className="text-sm text-muted-foreground italic">
            "Education is the passport to the future, but this page took a different flight path."
          </p>
          <p className="text-xs text-muted-foreground mt-2">— Not Malcolm X (but he said something similar)</p>
        </div>

        {/* Back Navigation */}
        <Button variant="ghost" onClick={() => window.history.back()} className="mt-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back to Previous Page
        </Button>
      </div>
    </div>
  )
}
