// 기본 axios 인스턴스 설정
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // API의 기본 URL 설정
  headers: {
    'Content-Type': 'application/json', // 요청 헤더에 JSON 타입 설정
  },
  withCredentials: true, // 쿠키 전송 설정을 통해 인증 쿠키를 서버에 전달할 수 있도록 함
});

export default apiClient
