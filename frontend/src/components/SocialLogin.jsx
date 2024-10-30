import Image from "next/image";

const SocialLogin = () => {
  const handleSocialLogin = (provider) => {
    let url = '';

    switch(provider) {
      case 'google':
        url = `${process.env.NEXT_PUBLIC_API_URL}/auth/social/google`;
        break;
      case 'kakao':
        url = `${process.env.NEXT_PUBLIC_API_URL}/auth/social/kakao`;
        break;
      case 'naver':
        url = `${process.env.NEXT_PUBLIC_API_URL}/auth/social/naver`;
        break;
      default:
        break;
    }

    if (url) {
      window.location.href = url; // 소셜 로그인 URL로 리다이렉트
    }
  };

  return (
      <div>
        <button onClick={() => handleSocialLogin('google')}>
          <Image src="/images/loginlogo/google-login.png" alt="google logo" className="mr-3" width={36} height={36}  />
        </button>
        <button onClick={() => handleSocialLogin('kakao')}>
          <Image src="/images/loginlogo/kakao-login.png" alt="kakao logo" className="mr-3" width={36} height={36} />
        </button>
        <button onClick={() => handleSocialLogin('naver')}>
          <Image src="/images/loginlogo/naver-login.png" alt="naver logo" className="mr-3" width={36} height={36} />
        </button>
      </div>
  );
};

export default SocialLogin;
