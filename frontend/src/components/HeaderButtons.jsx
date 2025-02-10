import * as React from "react";
import {Button} from "@/components/ui/button"
import {Triangle} from "lucide-react";
import Link from "next/link";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";

export default function HeaderButtons({auth}) {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;
  const [isReady, setIsReady] = useState(false);

  // 로그인 된 유저 기준에서 Login 버튼이 아주 순간적으로 보여서 딜레이 추가
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
      <>
        <Link href="/">
          <Button variant="outline" aria-label="Home">
            <div className="flex items-center gap-2 -mx-1">
              KIN
              <Triangle className="size-5 fill-foreground"/>
            </div>
          </Button>
        </Link>
        {isReady && (
            <>
              {auth ? (
                  <Link href="/notes">
                    <Label className={cn(
                        "font-semibold text-[15px] cursor-pointer",
                        isActive("/notes") ? "text-foreground underline"
                            : "text-foreground/70 hover:text-foreground"
                    )}
                           aria-label="Notes">
                      Notes
                    </Label>
                  </Link>
              ) : (
                  <Link href="/login">
                    <Label className={cn(
                        "font-semibold text-[15px] cursor-pointer",
                        isActive("/login") ? "text-foreground underline"
                            : "text-foreground/70 hover:text-foreground"
                    )}
                           aria-label="Login">
                      Login
                    </Label>
                  </Link>
              )}
              {auth === 'admin' && (
                  <a href="/admin">
                    <Label className={cn(
                        "font-semibold text-[15px] cursor-pointer",
                        isActive("/admin") ? "text-foreground underline"
                            : "text-foreground/70 hover:text-foreground"
                    )}>
                      Admin Dashboard
                    </Label>
                  </a>
              )}
              <Link href="/docs">
                <Label className={cn(
                    "font-semibold text-[15px] cursor-pointer",
                    isActive("/docs") ? "text-foreground underline"
                        : "text-foreground/70 hover:text-foreground"
                )}
                       aria-label="Docs">
                  Docs
                </Label>
              </Link>
            </>
        )}
      </>
  )
}