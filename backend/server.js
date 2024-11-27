require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const initializePassport = require('./config/passport');
const connectDB = require('./config/db');
const { createErrorResponse } = require('./middleware/errorHandler');
const https = require('https');
const fs = require('fs');

// 라우터 불러오기
const authRoutes = require('./routes/user/authRoutes');
const userRoutes = require('./routes/user/userRoutes');
const socialRoutes = require('./routes/user/socialRoutes');
const syncRoutes = require('./routes/user/syncRoutes');
const noteRoutes = require('./routes/notes/noteRoutes');
const categoryRoutes = require('./routes/notes/categoryRoutes');
const tagRoutes = require('./routes/notes/tagRoutes');
const emailRoutes = require('./routes/user/emailRoutes');
const session = require("express-session");
const RedisStore = require('connect-redis').default; // redis를 express-session에 연동
const redisClient = require('./config/redis');
const logger = require("./middleware/logger");

const app = express();
initializePassport(passport);

// 1. 데이터베이스 연결
connectDB();

app.set('trust proxy', true);

// morgan 미들웨어
app.use(logger);

// HTTPS 옵션 추가
const httpsOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH), // SSL 키 경로 (환경변수에 설정)
  cert: fs.readFileSync(process.env.SSL_CERT_PATH), // SSL 인증서 경로 (환경변수에 설정)
};

// 2. 기본 미들웨어 설정
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
    cors({
      origin: [ process.env.FRONTEND_URL, process.env.NEXT_PUBLIC_API_URL ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 허용할 HTTP 메서드
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Cache-Control',
        'Accept',
        'Origin',
        'Referer',
        'User-Agent',
        'X-CSRF-Token',
        'X-Requested-With'
      ], // 허용할 헤더
      credentials: true, // 쿠키를 포함한 요청 허용
    })
);
app.options('*', cors()); // CORS 사전요청 허용


// express-session 설정 + redis
app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET, // 세션 암호화 키
      resave: false, // 변경이 없을 경우 세션 저장 방지
      saveUninitialized: false, // 초기화되지 않은 세션 저장 방지
      cookie: {
        secure: true, // HTTPS에서만 쿠키 전송
        httpOnly: true, // XSS 방지
        sameSite: 'lax', // CSRF 방지
        maxAge: 24 * 60 * 60 * 1000, // 세션 쿠키 유효 기간 (1일)
      },
    })
);

app.use(passport.initialize());
app.use(passport.session());



// 3. 라우터 설정
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/social', socialRoutes);
app.use('/notes', noteRoutes);
app.use('/category', categoryRoutes);
app.use('/tags', tagRoutes);
app.use('/sync', syncRoutes);
app.use('/email', emailRoutes);


app.get('/', (req, res) => {
  res.send('서버 실행중');
});


// 서버 타임
app.get("/api/server-time", (req, res) => {
  res.json({ serverTime: new Date().toISOString() });
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

// 4. 전역 에러 처리
app.use((err, req, res, next) => {
  const { statusCode, message } = createErrorResponse(err.status || 500, err.message || "서버에서 오류가 발생했습니다.");
  res.status(statusCode).json({ message, code: statusCode });
});

// 5. HTTPS 서버 실행
const PORT = process.env.PORT;
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`HTTPS 서버가 포트 ${PORT}에서 실행 중입니다.`);
});