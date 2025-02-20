import * as React from "react";
import {authAtom} from "@/atoms/userState";
import {useAtomValue} from "jotai";
import {Icons} from '@/components/icons'
import HeaderButtons from "@/components/HeaderButtons";
import {logoutUser} from "@/services/user/authAPIService";
import {Label} from "@/components/ui/label";


export default function HeaderLayout({children}) {
  const auth = useAtomValue(authAtom); // Jotai를 사용하여 인증 상태 읽기 및 설정

  return (
      <>
        <header
            className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-6 border-b px-4 z-20">
              <HeaderButtons auth={auth}/>
          <div className="flex-grow"/>
          {auth && (
            <Label className="font-semibold text-[15px] cursor-pointer text-foreground/70 hover:text-foreground mr-2"
                   aria-label="Logout"
                   onClick={()=> logoutUser()}
            >
              Logout
            </Label>
          )}
          <a rel="noopener noreferrer" target="_blank"
             href='https://github.com/LeeHyunWoo2/KIN-Web' aria-label="GitHub">
            <Icons.gitHub className="mr-2 h-5 w-5"/>
          </a>
        </header>
        {children}
      </>
  )
}