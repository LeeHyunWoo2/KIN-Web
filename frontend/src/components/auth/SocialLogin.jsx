"use client"

import Image from "next/image";

const SocialLogin = () => {
  const handleSocialLogin = (provider) => {
    // 통합된 소셜 로그인 URL 생성
    const url = `${process.env.NEXT_PUBLIC_API_URL}/social/${provider}`;

    if (url) {
      window.location.href = url; // 소셜 로그인 URL로 리다이렉트
    }
  };

  return (
      <div>
        <button onClick={() => handleSocialLogin('google')}>
          <Image src="/images/loginlogo/google-login.png" priority={true} alt="google logo" className="mr-3" width={36} height={36}  />
        </button>
        <button onClick={() => handleSocialLogin('kakao')}>
          <Image src="/images/loginlogo/kakao-login.png" priority={true} alt="kakao logo" className="mr-3" width={36} height={36} />
        </button>
        <button onClick={() => handleSocialLogin('naver')}>
          <Image src="/images/loginlogo/naver-login.png" priority={true} alt="naver logo" className="mr-3" width={36} height={36} />
        </button>
      </div>
  );
};

export default SocialLogin;
