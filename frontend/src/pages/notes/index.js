import {mails} from "@/lib/notes/data";
import Mail from "@/components/notes/mail";
import Layout from "@/components/Layout"
import withAuth from "@/lib/hoc/withAuth";

function MailPage() {
  const defaultLayout = undefined;
  const defaultCollapsed = undefined;
  console.log('노트 페이지 호출')

  return (
      <>
        <div className="hidden flex-col md:flex">
          <Mail
              mails={mails}
              defaultLayout={defaultLayout}
              defaultCollapsed={defaultCollapsed}
              navCollapsedSize={4}
          />
        </div>
      </>
  );
}

// 이 페이지에 레이아웃 컴포넌트 적용
MailPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}

// HOC로 감싸서 내보내기
export default withAuth(MailPage);