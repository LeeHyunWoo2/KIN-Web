"use client"

import {useEffect, useState} from 'react';
import apiClient from '@/lib/apiClient';
import {useAtomValue} from 'jotai';
import {authAtom} from '@/atoms/userState';
import PageNotFound from '@/app/not-found'; // 404 페이지 컴포넌트

const withAdminAuth = (WrappedComponent) => {
  const AdminAuthenticatedComponent = (props) => {
    const auth = useAtomValue(authAtom);
    const [hasAccess, setHasAccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      if (auth === undefined) {
        return;
      } // auth 상태가 명확할 때만 실행

      // 관리자 인증 상태 체크
      const checkAdminAuth = async () => {
        try {
          const token = await apiClient.post('/auth/refresh',{});
          if (token.status !== 200) {
            setHasAccess(false);
            return;
          } else {
            const response = await apiClient.get('/auth/admin-session');
            if (response.status === 200 && response.data.isAdmin === true) {
              setHasAccess(true);
            } else {
              setHasAccess(false);
            }
          }
        } catch (error) {
          setHasAccess(false);
        }
        setIsLoading(false);
      };
      checkAdminAuth();
    }, []);

    if (isLoading) {
      return null; // 로딩 상태에서는 아무것도 렌더링하지 않음
    }

    if (!hasAccess) {
      // 404 페이지 컴포넌트를 렌더링하여 존재하지 않는 페이지처럼 보이게 처리
      return <PageNotFound/>;
    }

    // 관리자 권한이 확인되면 요청한 컴포넌트를 렌더링
    return <WrappedComponent {...props} />;
  };

  if (WrappedComponent.getLayout) {
    AdminAuthenticatedComponent.getLayout = WrappedComponent.getLayout;
  }

  return AdminAuthenticatedComponent;
};

export default withAdminAuth;