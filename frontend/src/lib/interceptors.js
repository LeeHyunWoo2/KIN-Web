import apiClient from "@/lib/apiClient";
import {refreshToken} from "@/services/user/authService";
import {toast} from "sonner";

export const setupInterceptors = () => {
  apiClient.interceptors.response.use(
      (config) => {
        // HTTP 메서드가 post, put, patch이며, config.data가 undefined인 경우 빈 객체 추가
        // 이게 없을 경우 next.js 의 API 라우트에서 예기치못한 문제를 발생시킴
        if (['post', 'put', 'patch'].includes(config.method) && !config.data) {
          config.data = {}; // 빈 객체 추가
        }
        return config;
      },
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
          if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // 반복 요청 방지

              await refreshToken(); // authService의 토큰 갱신 로직 호출
              return apiClient(originalRequest); // 갱신된 토큰으로 원래 요청 재실행
          } else if (error.response && error.response.status === 419){
            originalRequest._retry = true;
          }
            // 기타 에러 처리
            if (error.response.status !== 404 && error.response.status !== 401) {
              const errorMessage = error.response?.data?.message
                  || "오류가 발생했습니다.";
              toast.error(errorMessage);
            }
          }
        return Promise.reject(error);
      }
  );
};
