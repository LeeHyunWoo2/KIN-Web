const tokenService = require('../../services/user/tokenService');

// 인증 미들웨어
const injectAuthenticatedUser = async (req, res, next) => {
  const skipInterceptor = req.headers['x-skip-interceptor'] === 'true' || 'false';
  const token = req.cookies?.accessToken;
    try {
      const decoded = await tokenService.verifyAccessToken(token);
      req.user = decoded;
      return next();
    } catch (error) {
      if (skipInterceptor) {
        req.user = null;
        return next();
      }

      switch (error.code) {
        case 'TOKEN_BLACKLISTED':
          return res.status(401).json({ message: 'Access denied.' });
        case 'TOKEN_INVALID':
          return res.status(401).json({ message: 'Access denied.' });
        case 'TOKEN_MISSING':
        default:
          return res.status(401).json({ message: 'Access denied.' });
      }
    }
  };


module.exports = injectAuthenticatedUser;