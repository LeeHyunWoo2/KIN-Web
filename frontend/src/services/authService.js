import axios from "axios";
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
      originalRequest._retry = true;

      // 401 오류 발생 시 토큰 갱신 로직
      if (error.response && error.response.status === 401
          && !originalRequest._retry) {
        console.log("401 에러 발생, 토큰 만료로 간주하고 리프레시 토큰으로 갱신 중...");

        try {
          // 리프레시 토큰으로 새로운 액세스 토큰 요청
          const {data} = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
              {},
              {withCredentials: true}
          );

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

/*
import apiClient from '@/lib/apiClient'
import axios from "axios";

// 응답에서 에러가 발생한 경우 리프레시 토큰을 사용해 Access Token을 갱신
apiClient.interceptors.response.use(
    (response) => {
      console.log("응답 성공:", response);
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      console.log("응답 에러:", error.response ? error.response.status : error);
      originalRequest._retry = true; // 중복된 재시도를 방지하기 위해 플래그 설정
      // 401 오류 발생 시
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        console.log("401 에러 발생, 토큰 만료 확인 중...");

        // 리프레시 토큰 확인을 위한 서버 요청
        try {
          const checkResponse = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/token/check-refresh-token`,
              { withCredentials: true }
          );

          if (checkResponse.status === 200) {
            console.log("리프레시 토큰 유효, 토큰 갱신 시도 중...");

            // 리프레시 토큰을 사용해 새로운 액세스 토큰을 요청
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/token/refresh-token`,
                {},
                { withCredentials: true }
            );

            console.log("새로운 토큰 발급 성공:", data);

            // 갱신된 토큰으로 원래 요청을 다시 수행
            return apiClient(originalRequest);
          }
        } catch (err) {
          console.error("리프레시 토큰 확인 실패 또는 토큰 갱신 실패:", err);
          // 추가적인 로그아웃 처리 등 후속 작업 필요
        }
      }

      console.log("토큰 만료와 관련 없는 오류 또는 재요청 실패:", error);
      return Promise.reject(error);
    }
);




// 회원가입 API
export const registerUser = async (userData) => {
  // 사용자 데이터를 서버로 보내 회원가입 처리
  const {data} = await apiClient.post('/auth/local/register', userData);
  return data;
};

// 로그인 API
export const loginUser = async (credentials) => {
  try {
    // 서버에 로그인 요청을 보내고 사용자 정보와 토큰을 받아옴
    const {data} = await apiClient.post('/auth/local/login', credentials);
    // 유저 프로필 저장 (프로필 화면 출력용, 공개 정보만 로컬 스토리지에 저장)
    localStorage.setItem('userInfo', JSON.stringify({
      name: data.user.name,
      email: data.user.email,
      profileIcon: data.user.profileIcon,
    }));
    console.log('닉네임 : ', data.user.name);
    console.log('이메일 : ', data.user.email);
    console.log('프로필 아이콘 링크 : ', data.user.profileIcon);
    return data;
  } catch (error) {
    console.error('로그인 실패', error.message);
    return null;
  }
};

// 회원 정보 조회 API
export const getUserProfile = async () => {
  // 현재 사용자 정보를 서버에서 가져옴
  const {data} = await apiClient.get('/auth/local/profile');
  return data;
};

// 정보 수정 API
export const updateUserProfile = async (profileData) => {
  // 사용자 프로필 정보를 업데이트하는 요청을 서버로 보냄
  const {data} = await apiClient.put('/auth/local/profile', profileData);
  return data;
};

// 소셜 계정 연동
export const linkSocialAccount = async (provider) => {
  try {
    // 서버가 직접 Google 인증 페이지로 리다이렉트하게 요청
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/social/link/${provider}`;
  } catch (error) {
    console.error('소셜 계정 연동 요청 중 오류 발생:', error);
  }
};


// 소셜 계정 연동 해제
export const unlinkSocialAccount = async (provider) => {
  const { data } = await apiClient.post('/auth/social/unlink', { provider });
  return data;
};

// 로그아웃 API (토큰 제거)
export const logoutUser = async () => {
  try {
    // 서버로 로그아웃 요청 보내기
    await apiClient.post('/auth/token/logout', {});
    console.log("로그아웃 요청 성공");
  } catch (error) {
    console.error("로그아웃 요청 중 오류:", error);
  }

  // 로컬 스토리지 비우고 강제 새로고침
  localStorage.removeItem('userInfo');
  window.location.href = '/login';
};*/
