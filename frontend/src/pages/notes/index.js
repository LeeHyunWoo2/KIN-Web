import {notes} from "@/lib/notes/data";
import Note from "@/components/notes/note";
import Layout from "@/components/Layout"

export default function NotePage() {
  const defaultLayout = undefined;
  const defaultCollapsed = undefined;

  return (
      <>
        <div className="hidden flex-col md:flex">
          <Note
              notes={notes}
              defaultLayout={defaultLayout}
              defaultCollapsed={defaultCollapsed}
              navCollapsedSize={4}
          />
        </div>
      </>
  );
}

// 이 페이지에 레이아웃 컴포넌트 적용
NotePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}

// HOC로 감싸서 내보내기
