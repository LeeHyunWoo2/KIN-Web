// 전역 쿠키 설정
const setCookie = (res, name, value, options = {}) => {
  const defaultOptions = {
    httpOnly: true,
    secure: 'true',
    sameSite: 'lax',
    domain: process.env.NODE_ENV === 'production' ? 'noteapp.org' : undefined,
  };
  res.cookie(name, value, { ...defaultOptions, ...options });
};

module.exports = setCookie;