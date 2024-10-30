import { useRouter } from 'next/router';
import { useEffect } from 'react';

const SocialLoginSuccess = () => {
  const router = useRouter();

  useEffect(() => {
    // URL에서 accessToken과 refreshToken을 추출
    const { accessToken, refreshToken } = router.query;

    if (accessToken && refreshToken) {
      // 토큰을 로컬 스토리지에 저장하거나, 상태 관리 라이브러리에 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // 다른 페이지로 리다이렉트
      router.push('/notes');
    }
  }, [router.query]);

  return <div>로그인 성공! 리다이렉트 중...</div>;
};

export default SocialLoginSuccess;