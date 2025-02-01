import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import apiClient from "@/lib/apiClient";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { token } = router.query; // URL에서 토큰 가져오기
  const [message, setMessage] = useState("");

  const handleClose = () => {
    window.close();
  };

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await apiClient.get(`/email?token=${token}`);
        setMessage(response.data.message || "이메일 인증이 완료되었습니다. 기존 회원가입 화면을 확인해주세요.");
        // 인증 상태를 로컬스토리지에 저장
        localStorage.setItem('emailVerifiedData', JSON.stringify(
            {
              emailVerified: true,
              email: response.data.email,
            }
        ));
      } catch (error) {
        // 만료된 토큰 등등의 상황일땐 아무것도 저장하지 않음
        setMessage(error.response?.data?.message || "이메일 인증에 실패했습니다. 다시 시도해주세요.");
      }
    };
    if (token) verifyEmail();
  }, [token]);

  return (
      <div className="flex flex-col items-center justify-center h-screen" onClick={handleClose}>
        <p className="text-3xl font-bold mb-5">{message}</p>
        <p className="text-xl font-semibold mt-5">아무곳이나 눌러서 닫기</p>
      </div>
  );
}
