import axios from 'axios';

// 기본 axios 인스턴스 설정
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', // API의 기본 URL 설정
  headers: {
    'Content-Type': 'application/json', // 요청 헤더에 JSON 타입 설정
  },
  withCredentials: true, // 쿠키 전송 설정을 통해 인증 쿠키를 서버에 전달할 수 있도록 함
});

// 응답에서 에러가 발생한 경우 리프레시 토큰을 사용해 Access Token을 갱신
apiClient.interceptors.response.use(
    (response) => {
      console.log("응답 성공:", response);
      return response; // 응답이 성공적일 경우 그대로 반환
    },
    async (error) => {
      const originalRequest = error.config;
      console.log("응답 에러:", error.response ? error.response.status : error);

      // 토큰 만료로 인해 401 에러가 발생한 경우
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        console.log("토큰 만료 감지, 재요청 시도 중...");

        originalRequest._retry = true; // 중복된 재시도를 방지하기 위해 플래그 설정
        try {
          // 리프레시 토큰을 이용해 새로운 Access Token을 요청
          const { data } = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/token/refresh-token`,
              {},
              { withCredentials: true } // 쿠키 전송 설정 포함
          );

          console.log("새로운 토큰 발급 성공:", data);

          // 갱신된 토큰으로 원래의 요청을 다시 수행
          return apiClient(originalRequest);
        } catch (err) {
          console.error("토큰 갱신 실패:", err);
          // 로그아웃 처리 등 추가적인 후속 작업 필요
        }
      }
      console.log("토큰 만료와 관련 없는 오류 또는 재요청 실패:", error);
      return Promise.reject(error); // 에러를 그대로 반환
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
};