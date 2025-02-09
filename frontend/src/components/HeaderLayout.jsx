import * as React from "react";
import {Button} from "@/components/ui/button"
import {Triangle} from "lucide-react";
import Link from "next/link";
import {authAtom} from "@/atoms/userState";
import {useAtomValue} from "jotai";
import {Icons} from '@/components/icons'
import {Label} from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function HeaderLayout({children}) {
  const auth = useAtomValue(authAtom); // Jotai를 사용하여 인증 상태 읽기 및 설정
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
      <>
        <header
            className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-6 border-b px-4 z-20">
          <Link href="/">
            <Button variant="outline" aria-label="Home">
              <div className="flex items-center gap-2 -mx-1">
                KIN
              <Triangle className="size-5 fill-foreground"/>
              </div>
            </Button>
          </Link>
          <>
            {!auth ? (
                <Link href="/login">
                  <Label className={cn(
                      "font-semibold text-[15px] cursor-pointer",
                      isActive("/login") ? "text-foreground underline" : "text-foreground/70 hover:text-foreground"
                  )}
                         aria-label="Login">
                    Login
                  </Label>
                </Link>
            ) : (
                <Link href="/notes">
                  <Label className={cn(
                      "font-semibold text-[15px] cursor-pointer",
                      isActive("/notes") ? "text-foreground underline" : "text-foreground/70 hover:text-foreground"
                  )}
                         aria-label="Notes">
                    Notes
                  </Label>
                </Link>
            )}
            {auth === 'admin' && (
                <a href="/admin">
                  <Label className={cn(
                      "font-semibold text-[15px] cursor-pointer",
                      isActive("/admin") ? "text-foreground underline" : "text-foreground/70 hover:text-foreground"
                  )}>
                    Admin Dashboard
                  </Label>
                </a>
            )}
            <Link href="/docs">
              <Label className={cn(
                  "font-semibold text-[15px] cursor-pointer",
                  isActive("/docs") ? "text-foreground underline" : "text-foreground/70 hover:text-foreground"
              )}
                     aria-label="Docs">
                Docs
              </Label>
            </Link>
          </>
          <div className="flex-grow"/>
          <a rel="noopener noreferrer" target="_blank"
             href='https://github.com/LeeHyunWoo2/KIN-Web'>
              <Icons.gitHub className="mr-2 h-5 w-5"/>
          </a>
        </header>
        {children}
      </>
  )
}