import "@/styles/globals.css";
import {useEffect} from "react";
import {useRouter} from "next/router";
import {TooltipProvider} from "@/components/ui/tooltip";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import Head from 'next/head';
import {Toaster} from 'sonner';
import {setupInterceptors} from "@/lib/interceptors";
import '@/styles/code-block-element.css';
import { authAtom } from "@/atoms/userState";
import {useAtom} from "jotai";

NProgress.configure({showSpinner: false});

function App({Component, pageProps}) {
  const getLayout = Component.getLayout || ((page) => page);
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
        `}</style>
        <Head>
          <title>Keep Idea Note</title>
        </Head>
        <TooltipProvider delayDuration={0}>
          <Component {...pageProps} />
        </TooltipProvider>
        <Toaster expand={true} richColors position="bottom-center" offset="70px"/>
      </>
  );
}

export default App;