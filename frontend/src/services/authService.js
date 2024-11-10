import apiClient from "@/lib/apiClient";

// 응답에서 에러가 발생한 경우 리프레시 토큰을 사용해 Access Token을 갱신
apiClient.interceptors.response.use(
    (response) => {
      console.log("응답 성공:", response);
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      console.log("응답 에러:", error.response ? error.response.status : error);

      // 401 오류 발생 시 토큰 갱신 로직
      if (error.response && error.response.status === 401
          && !originalRequest._retry) {
        originalRequest._retry = true;
        console.log("401 에러 발생, 토큰 만료로 간주하고 리프레시 토큰으로 갱신 중...");

        try {
          // 리프레시 토큰으로 새로운 액세스 토큰 요청
          const {data} = await apiClient.post('/auth/refresh-token');
          console.log("새로운 토큰 발급 성공:", data);

          // 새로운 토큰으로 원래 요청 다시 수행
          return apiClient(originalRequest);
        } catch (err) {
          console.error("토큰 갱신 실패:", err);
          // 로그아웃 처리
          logoutUser();
        }
      }

      console.log("토큰 만료와 관련 없는 오류 또는 재요청 실패:", error);
      return Promise.reject(error);
    }
);
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
      name: data.user.name,
      email: data.user.email,
      profileIcon: data.user.profileIcon,
    }));
    return data;
  } catch (error) {
    console.error('로그인 실패', error.message);
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
  } catch (error){
    console.error('탈퇴 실패', error.message);
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
  const {data} = await apiClient.delete(`/social/unlink/${provider}`, {data: {provider}});
  return data;
};

// 로그아웃 API (토큰 제거)
export const logoutUser = async () => {
  try {
    await apiClient.post('/auth/logout', {});
    console.log("로그아웃 요청 성공");
  } catch (error) {
    console.error("로그아웃 요청 중 오류:", error);
  }

  localStorage.removeItem('userInfo');
  window.location.href = '/login';
};