import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/apiClient";
import {useAtomValue} from "jotai";
import {authAtom} from "@/atoms/userState";
import {logoutUser} from "@/services/user/authAPIService";


const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const auth = useAtomValue(authAtom); // Jotai를 사용하여 인증 상태 읽기 및 설정
    const [isLoading, setIsLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {

      // 이미 인증된 경우 인증 체크를 스킵
      if (auth) {
        setIsLoading(false);
        return;
      }

      // 인증 체크 함수
      const checkAuth = async () => {
        try {
          const response = await apiClient.get('/auth/session',{
            headers: {
              // 'x-skip-interceptor' : true, // 확인버튼 누르기도 전에 리다이렉트 발생으로 인해 따로 플래그 추가
            }
          });
          if (response.status !== 200) {
            setShowAlert(true);
          }
        } catch (error) {
          setShowAlert(true); // 인증되지 않은 경우 또는 오류 발생 시
        }
        setIsLoading(false);
      };
      checkAuth();
    }, [auth]);

    const handleAlertClose = async (isOpen) => {
      if (!isOpen) {
        // AlertDialog가 닫힐 때 logoutUser 호출
        await logoutUser();
      }
    };

    if (isLoading) {
      return null; // 로딩 중일 때 아무것도 렌더링하지 않음
    }

    return (
        <>
          {auth ? <WrappedComponent {...props} /> : null}
          {showAlert && (
              <AlertDialog open={showAlert} onOpenChange={(open) => {
                setShowAlert(open);
                handleAlertClose(open);
              }
              }>
                <AlertDialogPortal >
                  <AlertDialogOverlay />
                  <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle>로그인 후 이용하실 수 있습니다.</AlertDialogTitle>
                      <AlertDialogDescription>
                        로그인 페이지로 이동합니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction asChild>
                        <Button>확인</Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogPortal>
              </AlertDialog>
          )}
        </>
    );
  };

  if (WrappedComponent.getLayout) {
    AuthenticatedComponent.getLayout = WrappedComponent.getLayout;
  }

  return AuthenticatedComponent;
};

export default withAuth;