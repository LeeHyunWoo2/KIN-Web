import * as React from "react";
import {Button} from "@/components/ui/button"
import {Triangle} from "lucide-react";
import Link from "next/link";
import {authAtom} from "@/atoms/userState";
import {useAtomValue} from "jotai";

export default function HeaderLayout({children}) {
  const auth = useAtomValue(authAtom); // Jotai를 사용하여 인증 상태 읽기 및 설정

  return (
      <>
        <header
            className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-20">
          <Link href="/">
            <Button variant="outline" size="icon" aria-label="Home">
              <Triangle className="size-5 fill-foreground"/>
            </Button>
          </Link>
          <>
            {!auth ? (
                <Link href="/login">
                  <Button variant="outline" aria-label="Home">
                    로그인
                  </Button>
                </Link>
            ) : (
                <Link href="/notes">
                  <Button variant="outline">
                    노트
                  </Button>
                </Link>
            )}
            {auth === 'admin' && (
                <Link href="/admin">
                  <Button variant="outline">
                    관리자 대시보드
                  </Button>
                </Link>
                )}
          </>
        </header>
        {children}
      </>
  )
}