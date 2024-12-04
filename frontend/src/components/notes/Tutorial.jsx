import { useAtom } from "jotai";
import Joyride from "react-joyride";
import {tutorialActiveAtom, tutorialSkippedAtom} from "@/atoms/userState";
import {useSetAtom} from "jotai/index";
import {MoreHorizontal} from "lucide-react";

const steps = [
  { target: ".step1", content: "이곳에서 새 노트를 작성할 수 있습니다.", disableBeacon: true },
  { target: ".step2", content: "프로필을 클릭해 설정 및 로그아웃을 할 수 있습니다."},
  { target: ".step3", content: (
      <>
        <div className="flex justify-center mb-5">
        <img src="/images/categoryTutorial.PNG" alt="categoryTutorial" className="h-auto border rounded-xl"/>
        </div>
          카테고리를 추가 할 수 있습니다.<pre/>
        <div className="flex justify-center items-center"><MoreHorizontal className="w-5 mr-1"/>버튼을 통해 카테고리의 설정이 가능합니다.</div>
      </>
    )},
  {target: ".step4", content: "휴지통에서 노트를 영구 삭제할 수 있습니다."},
  {target: ".step5", content: "튜토리얼은 이곳에서 다시 볼 수 있습니다."}
];

const joyrideStyles = {
  options: {
    arrowColor: 'hsl(var(--popover))',
    backgroundColor: 'hsl(var(--popover))',
    textColor: 'hsl(var(--sidebar-foreground))',
    borderRadius: 'var(--radius)',
//    primaryColor: 'transparent',
    primaryColor: 'hsl(var(--primary))',
  },
  tooltip: {
    maxWidth: '400px',
    whiteSpace: 'normal',
    fontFamily: 'Pretendard Variable, sans-serif',
  },
};

export default function Tutorial() {
  const [isTutorialActive, setTutorialActive] = useAtom(tutorialActiveAtom);
  const setTutorialSkipped = useSetAtom(tutorialSkippedAtom);

  return (
      <Joyride
          steps={steps}
          styles={joyrideStyles}
          run={isTutorialActive} // 상태에 따라 튜토리얼 실행
          continuous={true}
          showSkipButton={true}
          disableScrolling={true}
          disableOverlayClose={true}
          hideCloseButton={true}
          showProgress={true}
          disableCloseOnEsc={true}
          callback={(data) => {
            if (data.status === "skipped") {
              setTutorialSkipped(true); // 스킵 상태 설정
              setTutorialActive(false); // 튜토리얼 비활성화
            }
            if (data.status === "finished") {
              setTutorialSkipped(false); // 스킵 상태 초기화
              setTutorialActive(false); // 튜토리얼 비활성화
            }
          }}
          locale={{
            back: "뒤로",
            close: "닫기",
            last: "닫기 5 / 5",
            nextLabelWithProgress: '다음 {step} / {steps}',
            skip: "건너뛰기",
          }}
      />
  );
}