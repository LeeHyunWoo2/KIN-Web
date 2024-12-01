// 기본 axios 인스턴스 설정
import axios from "axios";

// 참고 : axios는 반환하는 값이 프로미스이기 때문에 async 없이 호출하려면 .then() 이런거 써야함

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // API의 기본 URL 설정 (NEXT_PUBLIC 이 붙어야 클라이언트에서 접근가능)
  headers: {
    'Content-Type': 'application/json', // 요청 헤더에 JSON 타입 설정
  },
  withCredentials: true, // 쿠키 전송 설정을 통해 인증 쿠키를 서버에 전달할 수 있도록 함
  timeout: 10000, // 요청이 너무 오래걸리면 자동으로 실패하도록 설정
});

export default apiClient