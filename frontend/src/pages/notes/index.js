import {notes} from "@/lib/notes/data";
import Note from "@/components/notes/note";
import WorkspaceLayout from "@/components/WorkspaceLayout"
import NoteContainer from "@/components/notes/NoteContainer";
import {useAtom} from "jotai";
import {testAtom} from "@/atoms/testAtom";
import {noteEventHandlerAtom} from "@/lib/notes/noteState";
import {useEffect} from "react";
import {noteEventAtom} from "@/atoms/noteStateAtom";

export default function NotePage() {
  const [event] = useAtom(noteEventAtom); // 변경 감지
  const [, handleEvent] = useAtom(noteEventHandlerAtom); // 직접 부름

  useEffect(() => {
    if (event) {
      handleEvent(event);
      console.log("이벤트 트리거 작동 :", event);
    }
  }, [event, handleEvent]);

  const defaultLayout = undefined;
  const defaultCollapsed = undefined;
  const [ mode, setMode ] = useAtom(testAtom);


  return (
      <>
        {mode === "modeB" ? (
        <div className="hidden flex-col md:flex">
          <Note
              notes={notes}
              defaultLayout={defaultLayout}
              defaultCollapsed={defaultCollapsed}
              navCollapsedSize={4}
          />
        </div>
            ) : (
            <NoteContainer />
        )}
      </>
  );
}

// 이 페이지에 레이아웃 컴포넌트 적용
NotePage.getLayout = function getLayout(page) {
  return <WorkspaceLayout>{page}</WorkspaceLayout>;
}