import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import * as React from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useSetAtom} from "jotai/index";
import {resetStateAtom} from "@/atoms/forgotAtoms";
import ForgotPassword from "@/components/auth/ForgotPassword";
import ForgotId from "@/components/auth/ForgotId";

export default function ForgotComponent({setIsForgotComponentOpen, setId}) {
  const resetState = useSetAtom(resetStateAtom);

  const delayedResetState = () => {
    setTimeout(() => {
      resetState();
      localStorage.removeItem("emailVerified");
    }, 500); // 바로 리셋하면 창이 초기화 되면서 닫혀서 딜레이 추가
  };

  return (
      <AlertDialog
          onOpenChange={(open) => {
            setIsForgotComponentOpen(open)
            if (!open) {
              delayedResetState();
            }
          }
          } // 모달 상태 업데이트
      >
        <AlertDialogTrigger asChild>
          <button className="ml-auto inline-block text-sm underline"
                  tabIndex={-1}>
            아이디ㆍ비밀번호 찾기
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogTitle/>
          <Tabs defaultValue="id" className="min-h-64">
            <TabsList className="grid w-full grid-cols-2 min-h-10 mb-3">
              <TabsTrigger value="id" className="min-h-fit text-[16px] font-bold" onClick={resetState}>아이디 찾기</TabsTrigger>
              <TabsTrigger value="pw" className="min-h-fit text-[16px] font-bold" onClick={resetState}>비밀번호 찾기</TabsTrigger>
            </TabsList>
            <TabsContent value="id">
              <ForgotId
                setIsForgotComponentOpen={setIsForgotComponentOpen}
                setId={setId}
                />
            </TabsContent>
              <TabsContent value="pw">
                <ForgotPassword
                    setIsForgotComponentOpen={setIsForgotComponentOpen}
                />
              </TabsContent>
          </Tabs>
        </AlertDialogContent>
      </AlertDialog>
  );
}