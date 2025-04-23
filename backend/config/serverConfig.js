const fs = require('fs');

const isProduction = process.env.NODE_ENV === 'production';

const serverConfig = {
  port: process.env.PORT || 5000,
  frontendUrl: process.env.FRONTEND_ORIGIN,
  backendApiUrl: process.env.BACKEND_API_URL,
  sessionSecret: process.env.SESSION_SECRET,
  httpsOptions: isProduction
      ? {
        key: fs.readFileSync(process.env.SSL_KEY_PATH),
        cert: fs.readFileSync(process.env.SSL_CERT_PATH),
      }
      : null,
};

module.exports = serverConfig;