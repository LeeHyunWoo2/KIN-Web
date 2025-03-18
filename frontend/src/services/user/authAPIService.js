import apiClient from "@/lib/apiClient";

// 토큰 갱신 함수
export const refreshToken = async () => {
  try {
    await apiClient.post('/auth/refresh',{});
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
    return data;
  } catch (error) {
    return null;
  }
};

// 공개 프로필 데이터 요청 API
export const getPublicProfile = async () => {
  try {
    const { data } = await apiClient.get('/user',{});
    localStorage.setItem('userInfo', JSON.stringify({
      name: data.name,
      email: data.email,
      profileIcon: data.profileIcon,
      userId: data.userId,
      role: data.role,
    }));
    return data;
  } catch (error) {
    console.error('공개 프로필 정보 요청 실패:', error.message);
    throw error;
  }
};

// 회원 정보 조회 API
export const getUserProfile = async () => {
  const {data} = await apiClient.post('/user',{});
  return data;
};

// 이메일로 회원 정보 조회 API (아이디 찾기, 비밀번호 변경, 가입메일 중복확인 등)
export const getUserProfileByInput = async (inputData) => {
  const {data} = await apiClient.post(`/user/find`, inputData);
  return data;
}

// 정보 수정 API
export const updateUserProfile = async (profileData) => {
  try {
    const {data} = await apiClient.put('/user', profileData);
    await getPublicProfile(data);
    return data;
  } catch (error) {
    if (error.response.status === 418) {
      alert('테스트용 계정은 변경할 수 없습니다.')
      return window.location.reload();
    }
  }
};

// 비밀번호 변경 API
export const changePassword = async (newPassword, email) => {
  try {
    const {data} = await apiClient.put('/user/password', {newPassword, email});
    const message = data.message;
    return {
      message,
      commit: true,
    };
  } catch (error) {
    const message = error.response.data.message;
    return {
      message,
      commit: false,
    };
  }
}

// 회원 탈퇴 API
export const deleteUserProfile = async () => {
  try {
    await apiClient.delete('/user');
  } catch (error) {
    if (error.response.status === 418) {
      alert('테스트용 계정은 탈퇴할 수 없습니다.')
      return window.location.reload();
    }
  }
  await apiClient.post('/auth/logout', {});
  localStorage.removeItem('auth');
  localStorage.removeItem('userInfo');
  window.location.href = `/login?success=${encodeURIComponent('탈퇴가 완료되었습니다.')}`;
};

// 소셜 계정 연동
export const linkSocialAccount = async (provider) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/social/link/${provider}`;
  if (url) {
    window.location.href = url;
  }

};

// 소셜 계정 연동 해제
export const unlinkSocialAccount = async (provider) => {
  const {data} = await apiClient.delete(`/social/${provider}`,
      {data: {provider}});
  return data;
};

// 로그아웃 API (토큰 제거)
export const logoutUser = async () => {
  try {
    await apiClient.post('/auth/logout', {});
    localStorage.removeItem('auth');
    localStorage.removeItem('userInfo');
    window.location.href = '/';
  } catch (error) {
  }
};
