"use client"

import axios from "axios";

// 클라이언트에서 요청할 때 프론트엔드 서버의 중계 경로를 자동으로 추가
const apiClient = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json", // 요청 헤더 설정
  },
  withCredentials: true, // 쿠키 포함
  timeout: 10000, // 요청 제한 시간
});

export default apiClient;