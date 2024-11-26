const setCookie = (res, name, value, options = {}) => {
  const defaultOptions = {
    httpOnly: true,
    secure: 'true',
    sameSite: 'lax',
  };
  res.cookie(name, value, { ...defaultOptions, ...options });
};

module.exports = setCookie;