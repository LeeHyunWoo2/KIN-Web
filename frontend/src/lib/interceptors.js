"use client"

import apiClient from "@/lib/apiClient";
import {refreshToken} from "@/services/user/authAPIService";
import {toast} from "sonner";

let isRefreshing = false; // refreshToken 요청 중인지 확인하는 플래그 (401)
let failedRequests = []; // 동시에 들어온 요청들을 대기 상태로 두는 배열

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
        const originalRequest = error.config; // 원래 요청 객체

        // 401 에러 발생 시 세션 갱신 함수 호출
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true; // 중복 재요청 방지 플래그 설정

          if (isRefreshing) {
            //  갱신 요청이 진행 중일 경우 대기열에 추가
            return new Promise((resolve, reject) => {
              failedRequests.push({ resolve, reject });
            })
            .then(() => apiClient(originalRequest)) // 원래 요청 재실행
            .catch((error) => Promise.reject(error));
          }
          // 진행 중이 아니라면 갱신 요청 시작
          isRefreshing = true;
          try {
            await refreshToken(); // 갱신 요청
            failedRequests.forEach((prom) => prom.resolve()); // 모든 요청 재실행
            failedRequests = [];
            return apiClient(originalRequest);
          } catch (error) {
            failedRequests.forEach((prom) => prom.reject(error));
            failedRequests = [];
            return Promise.reject(error);
          } finally {
            isRefreshing = false;
          }
        }

        // 기타 에러 처리 (401 외)
        const errorMessage = error.response?.data?.message || "오류가 발생했습니다.";
        if (error.response.status !== 404 && error.response.status !== 401) {
          toast.error(errorMessage);
        }
        return Promise.reject(error);
      }
  );
};