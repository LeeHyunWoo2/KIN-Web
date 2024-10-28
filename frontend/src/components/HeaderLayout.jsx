import * as React from "react";
import {Button} from "@/components/ui/button"
import {Triangle} from "lucide-react";
import Link from "next/link";

export default function HeaderLayout({children}) {
  return (
      <>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-20">
          <Link href="/">
          <Button variant="outline" size="icon" aria-label="Home">
            <Triangle className="size-5 fill-foreground"/>
          </Button>
          </Link>
          <Link href="/login">
          <Button variant="outline" aria-label="Home">
            Login
          </Button>
          </Link>
          <Link href="/notes">
            <Button variant="outline">
              Workspace
            </Button>
          </Link>
        </header>
        {children}
      </>
  )
}