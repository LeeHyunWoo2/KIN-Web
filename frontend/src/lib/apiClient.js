// 기본 axios 인스턴스 설정
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // API의 기본 URL 설정 (NEXT_PUBLIC 이 붙어야 외부에 노출됨)
  headers: {
    'Content-Type': 'application/json', // 요청 헤더에 JSON 타입 설정
  },
  withCredentials: true, // 쿠키 전송 설정을 통해 인증 쿠키를 서버에 전달할 수 있도록 함
  timeout: 10000, // 요청이 너무 오래걸리면 자동으로 실패하도록 설정
});

console.log('Cloudflare API Token:', process.env.CLOUDFLARE_API_TOKEN);

// 요청 인터셉터를 통해 Vercel 서버에서 백엔드 경로 접근 제한용으로 만든 헤더 추가
apiClient.interceptors.request.use((config) => {
  config.headers['x-api-key'] = process.env.CLOUDFLARE_API_TOKEN;
  console.log('Axios 요청 헤더:', config.headers);
  console.log('process.env.NEXT_PUBLIC_API_URL : ',process.env.NEXT_PUBLIC_API_URL)
  console.log('process.env.UPLOADTHING_TOKEN : ',process.env.UPLOADTHING_TOKEN)
  console.log('process.env.RECAPTCHA_SITE_KEY : ',process.env.RECAPTCHA_SITE_KEY)
  console.log('process.env.CLOUDFLARE_API_TOKEN : ',process.env.CLOUDFLARE_API_TOKEN)
  return config;
});

export default apiClient
