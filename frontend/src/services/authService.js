import axios from 'axios';
import { toast } from '@/hooks/use-toast'


// 기본 axios 인스턴스 설정
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청이 백엔드로 보내지기 전에 자동으로 JWT 토큰을 헤더에 추가
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// 응답시에도 낚아채서 리프레시 토큰으로 갱신
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => { // axios요청을 동기처럼 바꿔줌
      const originalRequest = error.config;
      if (error.response && error.response.status === 401 && !originalRequest._retry) { // 리트한적 없으면
        originalRequest._retry = true; // 요청이 중복으로 재시도 되지 않게 리트라이 유무를 true로 변경
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try { // 리프레시 토큰 갱신을 하는 요청
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/token/refresh-token`, { refreshToken });
            localStorage.setItem('accessToken', data.accessToken);
            // 헤더에 새 토큰을 추가하고 재요청
            originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
            return apiClient(originalRequest);
          } catch (err) {
            console.error('토큰 갱신 실패', err);
            // 로그아웃 처리 등 추가 로직 필요
          }
        }
      }
      return Promise.reject(error);
    }
);

// 회원가입 API
export const registerUser = async (userData) => {
  const { data } = await apiClient.post('/auth/local/register', userData);
  return data;
};

// 로그인 API
export const loginUser = async (credentials) => {
  const { data } = await apiClient.post('/auth/local/login', credentials);
  // 액세스 토큰과 리프레시 토큰 저장
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  return data;
};

// 회원 정보 조회 API
export const getUserProfile = async () => {
  const { data } = await apiClient.get('/auth/local/profile');
  return data;
};

// 정보 수정 API
export const updateUserProfile = async (profileData) => {
  const { data } = await apiClient.put('/auth/local/profile', profileData);
  return data;
};

// 프로필 아이콘 수정 API
export const updateUserProfileIcon = async (profileIconUrl) => {
  const { data } = await apiClient.put('/auth/local/profile/icon', { profileIconUrl });
  return data;
};

// 로그아웃 API (토큰 제거)
export const logoutUser = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};