import WorkspaceLayout from "@/components/WorkspaceLayout"
import NoteContainer from "@/components/notes/NoteContainer";
import {useAtom, useAtomValue} from "jotai";
import {noteEventHandlerAtom} from "@/lib/notes/noteState";
import {useEffect} from "react";
import {noteEventAtom} from "@/atoms/noteStateAtom";
import FilterMonitor from "@/components/notes/FilterMonitor";

export default function NotePage() {
  const [event] = useAtom(noteEventAtom); // 변경 감지
  const handleEvent = useAtomValue(noteEventHandlerAtom); // 직접 부름

  useEffect(() => {
    if (event) {
      handleEvent(event);
    }
  }, [event]);


  return (
      <>
            <NoteContainer />
        <FilterMonitor />
      </>
  );
}

// 이 페이지에 레이아웃 컴포넌트 적용
NotePage.getLayout = function getLayout(page) {
  return <WorkspaceLayout>{page}</WorkspaceLayout>;
}