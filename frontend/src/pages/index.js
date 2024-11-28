import HeaderLayout from "@/components/HeaderLayout"
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {LogIn} from "lucide-react";
import {useAtomValue} from "jotai";
import {authAtom} from "@/atoms/authAtom";
import {useRouter} from "next/router";
import {Icons} from "@/components/icons";
import * as React from "react";


export default function Home() {
  const router = useRouter();
  const auth = useAtomValue(authAtom);

  const handleStarter = () => {
    if (auth) {
      router.push("/notes");
    } else {
      router.push("/login");
    }
  }

  return (
      <div className="flex flex-col max-w-3xl mx-auto mt-24 mb-5">
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
        >
          <main
              className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-4xl">
            <Card>
              <CardHeader className="font-bold text-3xl items-center">
                메인 화면은 개발중입니다.
              </CardHeader>
              <CardContent className="mt-5 mb-5 text-xl font-semibold">
                이 웹 사이트는 취업용 포트폴리오를 목적으로 제작되었습니다.
              </CardContent>
              <CardFooter className="flex flex-col space">
                <Button
                    className="h-20 rounded-2xl px-16 text-2xl font-bold shadow-md [&_svg]:size-2/3 [&_svg]:-ml-7"
                    variant="outline" onClick={handleStarter}>
                  <LogIn size={200}/>시작하기
                </Button>
                <a rel="noopener noreferrer" target="_blank"
                   href = 'https://github.com/LeeHyunWoo2/KIN-Web'>
                <Button  type="button" className="mt-10">
                  <Icons.gitHub className="mr-2 h-4 w-4"/>
                  개발자 GitHub
                </Button>
                </a>
              </CardFooter>
            </Card>
          </main>
        </div>
      </div>
  );
}

Home.getLayout = function getLayout(page) {
  return <HeaderLayout>{page}</HeaderLayout>;
}