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
import axios from "axios";

const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);

// 기본 axios 인스턴스 설정
    const apiClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', // API의 기본 URL 설정
      headers: {
        'Content-Type': 'application/json', // 요청 헤더에 JSON 타입 설정
      },
      withCredentials: true, // 쿠키 전송 설정을 통해 인증 쿠키를 서버에 전달할 수 있도록 함
    });

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await apiClient.get('/auth/check-session'); // 백엔드로 인증 상태 요청
          if (response.status === 200) {
            setIsAuthenticated(true);
          } else {
            setShowAlert(true);
          }
        } catch (error) {
          setShowAlert(true); // 인증되지 않은 경우 또는 오류 발생 시
        }
        setIsLoading(false);
      };
      checkAuth();
    }, []);


    const handleRedirect = () => {
      setShowAlert(false);
      router.push('/login');
    };

    // 토큰 확인 중에는 아무것도 렌더링 하지 않음
    if (isLoading) {
      return null;
    }

    return (
        <>
          {isAuthenticated ? (
              <WrappedComponent {...props} />
          ) : null}
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
        </>
    );
  };

  // getLayout 적용
  if (WrappedComponent.getLayout) {
    AuthenticatedComponent.getLayout = WrappedComponent.getLayout;
  }

  return AuthenticatedComponent;
};

export default withAuth;
