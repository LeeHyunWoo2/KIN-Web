import {notes} from "@/lib/notes/data";
import Note from "@/components/notes/note";
import WorkspaceLayout from "@/components/WorkspaceLayout"
import NoteContainer from "@/components/notes/NoteContainer";
import {useAtom} from "jotai";
import {testAtom} from "@/atoms/testAtom";

export default function NotePage() {
  const defaultLayout = undefined;
  const defaultCollapsed = undefined;
  const [ mode, setMode ] = useAtom(testAtom);


  return (
      <>
        {mode === "modeA" ? (
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