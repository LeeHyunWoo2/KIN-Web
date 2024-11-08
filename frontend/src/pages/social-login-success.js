import { useRouter } from 'next/router';
import { useEffect } from 'react';

const SocialLoginSuccess = () => {
  const router = useRouter();

  useEffect(() => {
    // URL에서 필요한 사용자 정보를 추출
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

  return <div></div>;
};

export default SocialLoginSuccess;