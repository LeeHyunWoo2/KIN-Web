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
import {useAtom} from "jotai";
import {authAtom} from "@/atoms/authAtom";


const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();
    const [auth, setAuth] = useAtom(authAtom); // Jotai를 사용하여 인증 상태 읽기 및 설정
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
          const response = await apiClient.get('/auth/check-session');
          if (response.status === 200) {
            setAuth(response.data.user); // 인증 성공 시 인증 상태 저장
          } else {
            setShowAlert(true);
          }
        } catch (error) {
          setShowAlert(true); // 인증되지 않은 경우 또는 오류 발생 시
        }
        setIsLoading(false);
      };

      checkAuth();
    }, [auth, setAuth]);

    const handleRedirect = () => {
      setShowAlert(false);
      router.push('/login');
    };

    if (isLoading) {
      return null; // 로딩 중일 때 아무것도 렌더링하지 않음
    }

    return (
        <>
          {auth ? <WrappedComponent {...props} /> : null}
          {showAlert && (
              <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogPortal>
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
                        <Button onClick={handleRedirect}>확인</Button>
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
