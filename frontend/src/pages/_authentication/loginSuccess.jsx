import {useRouter} from 'next/router';
import {useEffect} from 'react';
import {getPublicProfile} from '@/services/user/authService';
import {authAtom} from "@/atoms/userState";
import {useSetAtom} from "jotai";

const LoginSuccess = () => {
  const router = useRouter();
  const setAuth = useSetAtom(authAtom);

  useEffect(() => {
    const syncProfile = async () => {
      try {
        const user = await getPublicProfile(); // 공개 데이터 API 호출
        await setAuth(user.role)
        if (user.role === 'admin') {
          await router.push('/admin');
        } else {
          await router.push('/notes'); // Notes 페이지로 이동
        }
      } catch (error) {
        console.error('프로필 동기화 실패:', error);
        await router.push('/login'); // 실패 시 로그인 페이지로 리다이렉트
      }
    };
    syncProfile();
  }, []);

  return null;
};

export default LoginSuccess;