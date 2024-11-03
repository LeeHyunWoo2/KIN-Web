import { useRouter } from 'next/router';
import { useEffect } from 'react';

const SocialLoginSuccess = () => {
  const router = useRouter();

  useEffect(() => {
    // URL에서 필요한 사용자 정보를 추출 (액세스 토큰과 리프레시 토큰은 서버에서 쿠키로 설정됨)
    const { name, email, profileIcon } = router.query;

    if (name && email) {
      // 공개 사용자 정보를 로컬 스토리지에 저장
      localStorage.setItem('userInfo', JSON.stringify({
        name: name,
        email: email,
        profileIcon: profileIcon,
      }));
      // 다른 페이지로 리다이렉트
      router.push('/notes');
    }
  }, [router.query]);

  return <div>로그인 성공! 리다이렉트 중...</div>;
};

export default SocialLoginSuccess;