import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getPublicProfile } from '@/services/user/authService';
import { useSetAtom} from 'jotai';
import { userProfileAtom } from '@/atoms/authAtom';

const LoginSuccess = () => {
  const router = useRouter();
  const setUserProfile = useSetAtom(userProfileAtom);

  useEffect(() => {
    const syncProfile = async () => {
      try {
        const profile = await getPublicProfile(); // 공개 데이터 API 호출
        setUserProfile(profile); // Jotai 및 LocalStorage에 저장
        await router.push('/notes'); // Notes 페이지로 이동
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