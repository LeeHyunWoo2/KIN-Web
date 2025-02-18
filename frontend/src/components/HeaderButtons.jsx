import * as React from "react";
import {GalleryVerticalEnd} from "lucide-react";
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
          <div className="flex items-center gap-2.5 ml-3 mr-2 group">
            <div
                className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-800 text-primary-foreground group-hover:bg-zinc-600">
              <GalleryVerticalEnd className="size-4"/>
            </div>
            <span
                className="text-lg font-bold text-zinc-800 group-hover:text-zinc-600">KIN</span>
          </div>
        </Link>
        {isReady && (
            <>
              {auth ? (
                  <a href="/notes">
                    <Label className={cn(
                        "font-semibold text-[15px] cursor-pointer",
                        isActive("/notes") ? "text-foreground underline"
                            : "text-foreground/70 hover:text-foreground"
                    )}
                           aria-label="Notes">
                      Notes
                    </Label>
                  </a>
              ) : (
                  // 라우팅을 사용하면 클라우드 플레어 관리 챌린지가 스킵되기 때문에 a 태그 사용
                  <a href="/login">
                    <Label className={cn(
                        "font-semibold text-[16px] cursor-pointer",
                        isActive("/login") ? "text-foreground underline"
                            : "text-foreground/70 hover:text-foreground"
                    )}
                           aria-label="Login">
                      Login
                    </Label>
                  </a>
              )}
              {auth === 'admin' && (
                  <a href="/admin">
                    <Label className={cn(
                        "font-semibold text-[16px] cursor-pointer",
                        isActive("/admin") ? "text-foreground underline"
                            : "text-foreground/70 hover:text-foreground"
                    )}>
                      Admin Dashboard
                    </Label>
                  </a>
              )}
              <Link href="/docs">
                <Label className={cn(
                    "font-semibold text-[16px] cursor-pointer",
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