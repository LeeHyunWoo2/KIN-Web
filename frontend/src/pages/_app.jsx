import "@/styles/globals.css";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {TooltipProvider} from "@/components/ui/tooltip";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import Head from 'next/head';
import {Toaster} from 'sonner';
import {setupInterceptors} from "@/lib/interceptors";
import {checkVisitor, companyTrace} from "@/lib/checkVisitor";
import '@/styles/code-block-element.css';
import { authAtom } from "@/atoms/userState";
import {useAtom} from "jotai";

NProgress.configure({showSpinner: false});

function App({Component, pageProps}) {
  const getLayout = Component.getLayout || ((page) => page);
  const router = useRouter();
  const [auth, setAuth] = useAtom(authAtom);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontsLoaded(true);
    });
  }, []);

  // 방문자 체크 실행
  useEffect(() => {
    checkVisitor();
  }, []);

  // 추적함수 실행
  useEffect(() => {
    let startTime = Date.now();
    let trackUrl = router.asPath;
    const handleRouteChange = () => {
      const endTime = Date.now();
      const stayDuration = endTime - startTime;
      companyTrace(stayDuration, trackUrl);
      startTime = Date.now();
      trackUrl = router.asPath;
    };
    const handleUnload = () => {
      const endTime = Date.now();
      const stayDuration = endTime - startTime;

      // 라우팅 없이 떠난 경우 referrer 기반으로 기록
      const fallbackUrl = "/" + (document.referrer?.split("/")[3] || "");
      companyTrace(stayDuration, fallbackUrl);
    };
    router.events.on("routeChangeStart", handleRouteChange);
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [router])

  // 페이지 로드 시 localStorage와 authAtom 동기화
  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem("auth"));
    if (!auth && storedAuth) {
      setAuth(storedAuth); // 로컬스토리지의 정보를 authAtom에 설정
    }
  }, [auth, setAuth]);

  useEffect(() => {
    const handleStart = () => {
      const excludedPaths = ['/notes'];
      if (!excludedPaths.includes(router.pathname)) {
        NProgress.start();
      }
    };
    const handleStop = () => NProgress.done();
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);
  setupInterceptors();
  return getLayout(
      <>
        <style jsx global>{`
          #nprogress .bar {
            background: #888888;
          }
          body {
            opacity: ${fontsLoaded ? 1 : 0};
            transition: opacity 0.5s ease-in-out;
          }
        `}</style>
        <Head>
          <title>Keep Idea Note</title>
        </Head>
        <TooltipProvider delayDuration={0}>
            <Component {...pageProps} />
        </TooltipProvider>
        <Toaster expand={true} richColors position="bottom-center"
                 offset="70px"/>
      </>
  );
}

export default App;