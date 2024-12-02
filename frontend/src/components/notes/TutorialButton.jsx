import { useAtom } from "jotai";
import { tutorialActiveAtom, tutorialSkippedAtom } from "@/atoms/userState";
import {Lightbulb} from "lucide-react";
import {SidebarMenuButton} from "@/components/ui/sidebar";

export default function TutorialButton() {
  const setTutorialActive = useAtom(tutorialActiveAtom)[1];
  const [isTutorialSkipped, setTutorialSkipped] = useAtom(tutorialSkippedAtom);

  const handleStartTutorial = () => {
    // 스킵 상태를 초기화하고 튜토리얼을 다시 활성화
    if (isTutorialSkipped) {
      setTutorialSkipped(false);
    }
    setTutorialActive(true); // 튜토리얼 시작
  };

  return (
      <SidebarMenuButton variant="outline" onClick={handleStartTutorial} className="step5 justify-center font-medium  border bg-background shadow-sm">
        <Lightbulb /><span className="group-data-[collapsible=icon]:hidden">튜토리얼</span>
      </SidebarMenuButton>
  );
}
