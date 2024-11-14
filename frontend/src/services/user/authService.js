import apiClient from "@/lib/apiClient";

// 토큰 갱신 함수
export const refreshToken = async () => {
  try {
    const { data } = await apiClient.post('/auth/refresh-token');
  } catch (error) {
    // 토큰 갱신 실패 시 로그아웃 처리
    await logoutUser();
    throw error;
  }
};

// 회원가입 API
export const registerUser = async (userData) => {
  const {data} = await apiClient.post('/auth/register', userData);
  return data;
};

// 로그인 API
export const loginUser = async (credentials) => {
  try {
    const {data} = await apiClient.post('/auth/login', credentials);
    localStorage.setItem('userInfo', JSON.stringify({
      name: data.name,
      email: data.email,
      profileIcon: data.profileIcon,
    }));
    return data;
  } catch (error) {
    return null;
  }
};

// 회원 정보 조회 API
export const getUserProfile = async () => {
  const {data} = await apiClient.get('/user/profile');
  return data;
};

// 정보 수정 API
export const updateUserProfile = async (profileData) => {
  const {data} = await apiClient.put('/user/profile', profileData);
  return data;
};

// 회원 탈퇴 API
export const deleteUserProfile = async () => {
  try {
    await apiClient.delete('/user/profile');
  } catch (error) {
  }
  localStorage.removeItem('userInfo');
  window.location.href = '/login';
};

// 소셜 계정 연동
export const linkSocialAccount = async (provider) => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/social/link/${provider}`;
};

// 소셜 계정 연동 해제
export const unlinkSocialAccount = async (provider) => {
  const {data} = await apiClient.delete(`/social/unlink/${provider}`,
      {data: {provider}});
  return data;
};

// 로그아웃 API (토큰 제거)
export const logoutUser = async () => {
  try {
    await apiClient.post('/auth/logout', {});
  } catch (error) {
  }
  localStorage.removeItem('userInfo');
  window.location.href = '/login';
};
