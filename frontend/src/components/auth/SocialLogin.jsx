import Image from "next/image";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

const SocialLogin = () => {
  const handleSocialLogin = (provider) => {
    // 통합된 소셜 로그인 URL 생성
    const url = `${process.env.NEXT_PUBLIC_API_URL}/social/${provider}`;

    if (url) {
      window.location.href = url; // 소셜 로그인 URL로 리다이렉트
    }
  };

  return (
      <div className="flex justify-start gap-3">
        <Tooltip>
          <TooltipTrigger>
        <div onClick={() => handleSocialLogin('google')} className="cursor-pointer">
          <Image src="/images/loginlogo/google-login.png" priority={true} alt="google logo" width={36} height={36}  />
        </div>
          </TooltipTrigger>
          <TooltipContent>
            소셜 로그인은 카카오만 가능합니다 (플랫폼 승인 문제)
          </TooltipContent>
        </Tooltip>
        <div onClick={() => handleSocialLogin('kakao')} className="cursor-pointer">
          <Image src="/images/loginlogo/kakao-login.png" priority={true} alt="kakao logo" width={36} height={36} />
        </div>
        <Tooltip>
          <TooltipTrigger>
        <div onClick={() => handleSocialLogin('naver')} className="cursor-pointer">
          <Image src="/images/loginlogo/naver-login.png" priority={true} alt="naver logo" width={36} height={36} />
        </div>
          </TooltipTrigger>
          <TooltipContent>
            소셜 로그인은 카카오만 가능합니다 (플랫폼 승인 문제)
          </TooltipContent>
        </Tooltip>
      </div>
  );
};

export default SocialLogin;
