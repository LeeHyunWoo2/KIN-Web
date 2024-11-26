import HeaderLayout from "@/components/HeaderLayout"

export default function Home() {
  return (
    <div
      className={`grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">

      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        메인 화면 준비중
      </footer>
    </div>
  );
}

Home.getLayout = function getLayout(page) {
  return <HeaderLayout>{page}</HeaderLayout>;
}