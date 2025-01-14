import ReCAPTCHA from "react-google-recaptcha";

const Recaptcha = ({ onVerify, siteKey }) => {
  const handleCaptchaChange = (token) => {
    onVerify(token); // 부모 컴포넌트에 토큰 전달
  };

  return (
      <div>
        <ReCAPTCHA
            sitekey={siteKey || process.env.RECAPTCHA_SITE_KEY}
            onChange={handleCaptchaChange}
        />
      </div>
  );
};

export default Recaptcha;