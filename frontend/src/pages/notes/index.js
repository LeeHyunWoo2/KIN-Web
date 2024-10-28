import {mails} from "@/utils/data";
import Mail from "@/components/notes/mail";
import Layout from "@/components/Layout"

export default function MailPage() {
  const defaultLayout = undefined;
  const defaultCollapsed = undefined;

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