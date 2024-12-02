import apiClient from "@/lib/apiClient";
import { refreshToken } from "@/services/user/authService";
import { toast } from "sonner";

export const setupInterceptors = () => {
  apiClient.interceptors.response.use(
      (response) => {
        // 중복 요청 방지
        if (!response.config._interceptorProcessed) {
          response.config._interceptorProcessed = true;

          // 서버 응답의 message를 Sonner 토스트로 출력
          const message = response.data?.message;
          if (message) {
            toast.success(message);
          }
        }
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (!originalRequest._interceptorProcessed) {
          originalRequest._interceptorProcessed = true;

          // 401 에러 처리: 토큰 만료 시 재발급 요청
          if (error.response && error.response.status === 401) {
            originalRequest._retry = true; // 반복 요청 방지
            await refreshToken(); // authService의 토큰 갱신 로직 호출
            return apiClient(originalRequest); // 갱신된 토큰으로 원래 요청 재실행
          } else if (error.response && error.response.status === 419) {
            // 419 에러 처리: 세션 만료 시 추가 로직 처리 (필요 시 구현)
            originalRequest._retry = true; // 반복 요청 방지
            // 필요한 로직 추가 가능
          } else {
            // 기타 에러 처리
            const errorMessage = error.response?.data?.message || "오류가 발생했습니다.";
            toast.error(errorMessage);
          }
        }
        return Promise.reject(error);
      }
  );
};
