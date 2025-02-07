"use client"

import ReCAPTCHA from "react-google-recaptcha";

const Recaptcha = ({ onVerify, siteKey }) => {
  const handleCaptchaChange = (token) => {
    onVerify(token); // 부모 컴포넌트에 토큰 전달
  };
  // TODO: 리캡차 환경변수 NEXT_PUBLIC_ 지우고 서버사이드에서 제공하게 변경
  return (
      <div>
        <ReCAPTCHA
            sitekey={siteKey || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onChange={handleCaptchaChange}
        />
      </div>
  );
};

export default Recaptcha;