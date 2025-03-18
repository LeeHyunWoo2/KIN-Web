require('dotenv').config();
const express = require('express');
const https = require('https');
const session = require("express-session");
const redisClient = require('./config/redis');
const RedisStore = require('connect-redis').default;
const serverConfig = require('./config/serverConfig');
const connectDB = require('./config/database');
const globalMiddleware = require('./middleware/globalMiddleware');
const { globalLimiter, apiLimiter } = require('./middleware/securityMiddleware');
const routes = require('./routes');
const wss = require('./services/admin/websocketService');
const passport = require('passport');
const initializePassport = require('./config/passport');
const errorHandler = require('./middleware/errorHandler');

process.on('uncaughtException', (err) => {
  console.error('[에러] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[에러] Unhandled Rejection:', reason);
});

const app = express();
initializePassport(passport);
app.set('trust proxy', true);
connectDB();

// 미들웨어 설정
globalMiddleware(app);
app.use(globalLimiter);
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: serverConfig.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: serverConfig.httpsOptions !== null,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  },
}));
app.use(passport.initialize());
app.use(passport.session());

// 라우트 설정
app.use(['/auth', '/email'], apiLimiter);
app.use(routes);
app.head('/', (req, res) => {
  res.status(200).end();
});
app.get('/', (req, res) => {
  res.send('서버 실행중');
});

app.use(errorHandler);

// 서버 실행
const server = serverConfig.httpsOptions
    ? https.createServer(serverConfig.httpsOptions, app).listen(serverConfig.port, () => {
      console.log(`HTTPS 서버가 포트 ${serverConfig.port}에서 실행 중입니다.`);
    })
    : app.listen(serverConfig.port, () => {
      console.log(`HTTP 서버가 포트 ${serverConfig.port}에서 실행 중입니다.`);
    });

wss.attachToServer(server);