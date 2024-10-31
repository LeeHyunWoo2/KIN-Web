import "@/styles/globals.css";
import {ToastProvider} from "@/components/ui/toast";
import {TooltipProvider} from "@/components/ui/tooltip";
import {Toaster} from "@/components/ui/toaster";
import apiClient from '@/lib/errorHandler'; // 오류 핸들링 초기화

function App({Component, pageProps}) {
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
      <>
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