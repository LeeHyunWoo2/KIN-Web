import { useAtom } from "jotai";
import { tutorialActiveAtom, tutorialSkippedAtom } from "@/atoms/userState";
import {Button} from "@/components/ui/button";

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
      <Button variant="outline" onClick={handleStartTutorial} className="step5">
        튜토리얼
      </Button>
  );
}
