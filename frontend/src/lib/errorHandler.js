import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

// api 요청할때 AOP ExceptionHandler 마냥 에러 처리해주는 로직
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      const errorMessage = handleApiError(error);
      console.error(errorMessage);
      alert(errorMessage);
      return Promise.reject(error);
    }
);

const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    switch (status) {
      case 400:
        return data.errors?.map(err => err.msg).join('\n') || '잘못된 요청입니다.';
      case 401:
        return '인증이 필요합니다. 다시 로그인해 주세요.';
      case 500:
        return '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
      default:
        return '오류가 발생했습니다. 다시 시도해 주세요.';
    }
  }
  return '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.';
};

export default apiClient;
