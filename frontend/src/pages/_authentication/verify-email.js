import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import apiClient from "@/lib/apiClient";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { token } = router.query; // URL에서 토큰 가져오기
  const [message, setMessage] = useState("");

  const handleClose = () => {
    // 인증 상태를 로컬스토리지에 저장
    localStorage.setItem("emailVerified", "true");
    router.push("/signup");
  };

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await apiClient.get(`/email/verify-email?token=${token}`);
        setMessage(response.data.message || "이메일 인증이 완료되었습니다.");
      } catch (error) {
        setMessage(error.response?.data?.message || "이메일 인증에 실패했습니다.");
      }
    };

    if (token) verifyEmail();
  }, [token]);

  return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">이메일 인증</h1>
        <p>{message}</p>
        <button
            onClick={handleClose}
            className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
        >
          이 창 닫기
        </button>
      </div>
  );
}
