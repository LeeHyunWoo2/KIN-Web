import apiClient from "@/lib/apiClient";
import {refreshToken} from "@/services/user/authService";
import {toast} from "sonner";
import {setUserDBInstance} from "@/lib/notes/initDB";

let completedSetDB = false; // DB 생성 플래그

export const setupInterceptors = () => {
  apiClient.interceptors.response.use(
      (response) => {
        // 중복 요청 방지
        if (!response.config._interceptorProcessed) {
          response.config._interceptorProcessed = true;
          // ?? 연산자는 왼쪽이 null이나 undefined 일 경우 오른쪽을 반환한다.
          const userId = response.data?.user?._id ?? response.data?.user?.id;
          if (userId && !completedSetDB) {
            setUserDBInstance(userId);
            completedSetDB = true; // 중복 생성 방지
          }
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
          if (error.response && error.response.status === 419
              && !originalRequest._retry) {
            originalRequest._retry = true;
            return
          } else if (error.response.status === 401) {
            originalRequest._retry = true; // 반복 요청 방지
            await refreshToken(); // authService의 토큰 갱신 로직 호출
            return await apiClient(originalRequest); // 갱신된 토큰으로 원래 요청 재실행
          } else {
            const errorMessage = error.response?.data?.message || "오류가 발생했습니다.";
            toast.error(errorMessage);
          }
        }
        return Promise.reject(error);
      }
  );
};
