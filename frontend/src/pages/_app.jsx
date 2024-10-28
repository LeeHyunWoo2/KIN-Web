import "@/styles/globals.css";
import {ToastProvider} from "@/components/ui/toast";
import {TooltipProvider} from "@/components/ui/tooltip";
import {Toaster} from "@/components/ui/toaster";

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