import {Button} from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {Icons} from "@/components/icons";
import {Badge} from "@/components/ui/badge"
import FeatureTabs from "@/components/introduce/FeatureTabs";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import * as React from "react";
import {ArrowRightIcon} from "@radix-ui/react-icons";
import {SquareCheckBig, FileText ,Info} from "lucide-react";
import {useState} from "react";
import {useRouter} from "next/router";

export default function IntroContent({auth}) {
  const router = useRouter();
  const [isGuided, setIsGuided] = useState(false)

  const handleStarter = () => {
    if (auth) {
      window.location.href = "/notes";
    } else {
      window.location.href = "/login"
    }
  }

  const handleGuideCheck = () => {
    setIsGuided(!isGuided);
  };

  return (
      <div className="flex flex-col mt-5">
        <section className="container mx-auto px-4 py-20 text-center">
          <Badge variant="secondary" className="mb-4">
            Keep Idea Note
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">
            잊기 전에 메모하세요
          </h1>
          <p className="text-lg text-muted-foreground mb-12 max-w-[600px] mx-auto">
            어디서나 손쉽게 기록할 수 있습니다.<br/>
            강력한 필터링으로 필요한 노트를 빠르게 찾아내세요.
          </p>
          <div className="flex justify-center flex-col gap-4">
          <div className="flex gap-4 justify-center">
            <div className="flex flex-col-2 gap-4">
              <Button effect="expandIcon"
                      icon={ArrowRightIcon} iconPlacement="right"
                      className="flex transition-all duration-300 hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 hover:bg-blue-500 bg-blue-500"
                      onClick={handleStarter}
                      size="slg"
              >
                <SquareCheckBig strokeWidth={2.25} className="mr-3"/>
                바로 시작하기</Button>
              <Button effect="expandIcon"
                      icon={ArrowRightIcon} iconPlacement="right"
                      className="flex transition-all duration-300 hover:ring-2 hover:ring-green-500 hover:ring-offset-2 hover:bg-green-500 bg-green-500"
                      onClick={() => router.push('/docs', undefined, {shallow: true})}
                      size="slg"
              >
                <FileText strokeWidth={2.25} className="mr-3"/>
                문서 보러가기</Button>
            </div>
          </div>
            <div className="flex justify-center mt-4">
              <a rel="noopener noreferrer" target="_blank"
                 href='https://github.com/LeeHyunWoo2/KIN-Web'>
                <Button
                    variant="outline"
                    className="flex transition-all duration-300 hover:ring-2 hover:ring-primary/90 hover:ring-offset-2"
                    size="slg"
                >
                  <Icons.gitHub className="mr-2"/>
                  개발자 GitHub
                </Button>
              </a>
            </div>
          </div>
          {/*          <div className="flex justify-center mt-10">
              <button
                  className={`relative h-14 rounded-md px-4 text-lg font-semibold bg-teal-500 hover:bg-teal-600 
                 text-primary-foreground shadow inline-flex items-center justify-center gap-2 
                 whitespace-nowrap transition-colors before:absolute before:inset-0
                  before:z-[-1] before:rounded-md ${
                      isGuided ? "" : "before:animate-rainbowPing"
                  }`}
                  onClick={handleGuideCheck}
              >
                <Info size={24} strokeWidth={2.25} />뭐부터 봐야 하나요?
              </button>
          </div>*/}
        </section>

        {/*주요 기능 사진, gif*/}
        <FeatureTabs/>

        <section className="bg-slate-50 py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 max-w-[600px] mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">주요 기능</CardTitle>
                  <p className="text-sm text-muted-foreground">앱의 특징을 간단히 소개합니다.</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <div>
                    <span className="text-lg font-semibold">메모 작성 및 관리 : </span>
                    <span>카테고리, 태그, 검색 기능 제공</span>
                    </div>
                    <div>
                      <span className="text-lg font-semibold">다양한 편집 모드 : </span>
                      <span>일반 텍스트, 마크다운, 리치텍스트 에디터</span>
                    </div>
                    <div>
                      <span className="text-lg font-semibold">자동 저장 및 백업 : </span>
                      <span>실시간 저장과 동기화 지원</span>
                    </div>
                    <div>
                      <span className="text-lg font-semibold">보안 강화 : </span>
                      <span>프라이빗 앱에 걸맞는 다양한 보안 조치를 적용</span>
                    </div>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-semibold text-center mb-12">Q&A</h2>
          <Accordion type="single" collapsible
                     className="max-w-[800px] mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger>제가 작성한 노트는 안전한가요?</AccordionTrigger>
              <AccordionContent>
                네, 보안을 최우선으로 고려하여 외부로부터 안전하며, 개발자가 내용을 열람하는것이 불가능하도록 설계했습니다.<br/>
                또한 매일 주기적으로 서버의 데이터를 백업하여 안전하게 관리중입니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>제 개인정보는 안전한가요?</AccordionTrigger>
              <AccordionContent>
                이 앱은 개인정보를 필요로 하지 않습니다. 회원가입에서도 민감하지 않은 식별정보만 취급하고 있습니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>다른 사람과 노트를 공유할 수 있나요?</AccordionTrigger>
              <AccordionContent>
                현재는 개인 사용을 위한 프라이빗 노트 앱 이지만, 향후 공유와 협업 기능 추가를 고려하고 있습니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>앞으로 업데이트를 할 의향이 있나요?</AccordionTrigger>
              <AccordionContent>
                네! 이 앱은 앞으로도 계속 관리될 예정입니다.<br/>긴급메모 모드, 코드 스니펫 모드, UI개선, Electron 버전과 모바일 앱 버전 제작 등 여러가지 계획이 있습니다.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>


        <footer className="border-t py-8  ">
        <div
            className="container mx-auto px-4 text-end font-medium text-[14px] text-muted-foreground">
        © {new Date().getFullYear()} {' '}
          <a href="https://github.com/LeeHyunWoo2" target="_blank"
             rel="noopener noreferrer">
          LeeHyunWoo. All rights reserved.
        </a>
      </div>
        </footer>
      </div>
  )
}