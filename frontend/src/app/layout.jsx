"use client"

import "@/styles/globals.css";
import "@/styles/code-block-element.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Toaster } from "sonner";
import { setupInterceptors } from "@/lib/interceptors";
import { authAtom } from "@/atoms/userState";
import { useAtom } from "jotai";

NProgress.configure({ showSpinner: false });

export default function RootLayout({ children }) {
  const router = useRouter();
  const [auth, setAuth] = useAtom(authAtom);

  // 페이지 로드 시 localStorage와 authAtom 동기화
  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem("auth"));
    if (!auth && storedAuth) {
      setAuth(storedAuth); // 로컬스토리지의 정보를 authAtom에 설정
    }
  }, [auth, setAuth]);

  useEffect(() => {
    const handleStart = () => {
      const excludedPaths = ["/notes"];
      if (!excludedPaths.includes(router.pathname)) {
        NProgress.start();
      }
    };
    const handleStop = () => NProgress.done();
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  setupInterceptors();

  return (
      <html lang="en">
      <head>
        <title>Keep Idea Note</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        {/* SEO 메타 태그 */}
        <meta name="description" content="A productivity app built with modern technologies like Next.js, React, and Node.js." />
        <meta name="keywords" content="Productivity, Note App, Next.js, Vercel, React, Node.js, MongoDB, TailwindCSS" />
        <meta name="author" content="LeeHyunWoo" />
        {/* 기술 스택 관련 메타 태그 */}
        <meta name="frontend-framework" content="Next.js, React" />
        <meta name="frontend-ui" content="Radix UI, Tailwind CSS" />
        <meta name="frontend-tools" content="Jotai, Slate.js, Axios, PouchDB, Uploadthing" />
        <meta name="frontend-deploy" content="Vercel" />
        <meta name="database" content="MongoDB Atlas, Redis" />
        <meta name="backend-framework" content="Express.js, Node.js" />
        <meta name="backend-tools" content="Mongoose, Passport.js, JWT, Axios, Bcrypt, Helmet, Cors, Nodemailer" />
        <meta name="backend-deploy" content="Oracle Cloud" />
        <link rel="preload" href="/fonts/PretendardVariable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
      <style jsx global>{`
          #nprogress .bar {
            background: #888888;
          }
        `}</style>
      <TooltipProvider delayDuration={0}>
        {children}
      </TooltipProvider>
      <Toaster expand={true} richColors position="bottom-center" offset="70px" />
      </body>
      </html>
  );
}
