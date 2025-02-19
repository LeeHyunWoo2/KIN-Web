import {useAtom} from "jotai";
import Joyride, {ACTIONS} from "react-joyride";
import {tutorialActiveAtom, tutorialSkippedAtom} from "@/atoms/userState";
import {useSetAtom} from "jotai/index";
import {Button} from "@/components/ui/button"; // Shadcn Button 컴포넌트 임포트
import {Card, CardContent, CardFooter} from "@/components/ui/card"; // Shadcn Card 컴포넌트 임포트

// React-Joyride 툴팁을 대체할 Custom Tooltip 컴포넌트
function CustomTooltip({continuous, index, step, backProps, closeProps, primaryProps, skipProps, size}) {
  return (
      <Card className="shadow-lg min-w-[400px]">
        <CardContent className="p-10 text-center">{step.content}</CardContent>
        <CardFooter className="flex items-center justify-between">
          <div>
            <Button className="px-3" variant="ghost" {...skipProps}>
              건너뛰기
            </Button>
          </div>
          <div className="flex space-x-2">
            {index > 0 && (
                <Button variant="outline" {...backProps}>
                  뒤로
                </Button>
            )}
            {continuous ? (
                <Button className="px-3" {...primaryProps}>
                  다음 ({index + 1} / {size})
                </Button>
            ) : (
                <Button variant="primary" {...closeProps}>
                  완료
                </Button>
            )}
          </div>
        </CardFooter>
      </Card>
  );
}

const steps = [
  { target: ".step1", content: (
        <>
          <div className="flex justify-center mb-5">
            <img src="/images/writeTutorial.PNG" alt="writeTutorial"
                 className="h-auto border rounded-xl"/>
          </div>
          이곳에서 새 노트를 작성할 수 있습니다.<br/><br/>
          텍스트 모드: 간단한 메모장 형식<br/>
          에디터 모드: 상세한 문서 작업
        </>
    ), disableBeacon: true
  },
  {
    target: ".step2", content: (
        <>
          프로필을 클릭해 내 정보, 로그아웃,<br/>
          <span className="text-blue-600">소셜 연동</span>, <span
            className="text-red-600">탈퇴</span> 등의 주요 기능을 관리할 수 있습니다.
        </>
    )
  },
  {
    target: ".step3",
    content: (
        <>
          <div className="flex justify-center mb-5">
            <img src="/images/categoryTutorial.PNG" alt="categoryTutorial" className="h-auto border rounded-xl" />
          </div>
          카테고리를 추가 할 수 있습니다.
          <div>
            설정 옵션은 <strong>…</strong> 버튼에서 확인할 수 있습니다.
          </div>
        </>
    ),
  },
  { target: ".step4", content: "휴지통에서 노트를 영구 삭제할 수 있습니다." },
  { target: ".step5", content: (
      <>
        튜토리얼은 언제든 이곳에서 다시 확인할 수 있습니다.<br/>
        현재 일부 내용이 준비 중입니다. 빠른 시일 내에 업데이트하겠습니다.
      </>
    )},
];

export default function Tutorial() {
  const [isTutorialActive, setTutorialActive] = useAtom(tutorialActiveAtom);
  const setTutorialSkipped = useSetAtom(tutorialSkippedAtom);

  // Resize가 필요한 스텝 리스트
  const imageSteps = [2];

  return (
      <Joyride
          steps={steps}
          run={isTutorialActive} // 상태에 따라 튜토리얼 실행
          continuous={true}
          showSkipButton={true}
          disableScrolling={true}
          disableOverlayClose={true}
          hideCloseButton={true}
          showProgress={true}
          tooltipComponent={CustomTooltip} // 커스텀 툴팁 설정
          callback={(data) => {
            // 콜백 처리
            if (data.status === "skipped") {
              setTutorialSkipped(true);
              setTutorialActive(false);
            }
            if (data.status === "finished") {
              setTutorialSkipped(false);
              setTutorialActive(false);
            }
            // 이미지 포함 스텝에서 좌표 틀어지는걸 막기 위해서 10ms 딜레이
            if((data.action === ACTIONS.NEXT || data.action === ACTIONS.PREV) && imageSteps.includes(data.index)) {
              setTimeout(() => {
                window.dispatchEvent(new Event("resize"));
              }, 10)
            }
          }}
          locale={{
            back: "뒤로",
            close: "닫기",
            last: "닫기 5 / 5",
            nextLabelWithProgress: "다음 {step} / {steps}",
            skip: "건너뛰기",
          }}
      />
  );
}