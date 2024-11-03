import "@/styles/globals.css";
import {useEffect} from "react";
import {useRouter} from "next/router";
import {ToastProvider} from "@/components/ui/toast";
import {TooltipProvider} from "@/components/ui/tooltip";
import {Toaster} from "@/components/ui/toaster";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import apiClient from '@/lib/errorHandler'; // 오류 핸들링 초기화
import Head from 'next/head';

NProgress.configure({showSpinner: false});

function App({Component, pageProps}) {
  const getLayout = Component.getLayout || ((page) => page);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => NProgress.start();
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
        <ToastProvider>
          <TooltipProvider>
            <Component {...pageProps} />
          </TooltipProvider>
          <Toaster/>
        </ToastProvider>
      </>
  );
}

export default App;