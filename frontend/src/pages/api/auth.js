import axios from 'axios';

// 회원가입 API 호출
export const registerUser = async (userData) => {
  const response = await axios.post('/api/auth/register', userData);
  return response.data;
};

// 로그인 API 호출
export const loginUser = async (loginData) => {
  const response = await axios.post('/api/auth/login', loginData);
  return response.data;
};

// 소셜 로그인 버튼 클릭
export const googleLogin = () => {
  window.location.href = '/auth/google'; // 구글 로그인 페이지로 리다이렉트
};