require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
require('./config/passport');
const connectDB = require('./config/db');
const morgan = require('morgan');

// 라우터 불러오기
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const socialRoutes = require('./routes/socialRoutes');
const session = require("express-session");

const app = express();

// 1. 데이터베이스 연결
connectDB();

// 커스텀 토큰 설정: 요청 쿼리, 본문
morgan.token('query', (req) => JSON.stringify(req.query)); // 쿼리 파라미터
morgan.token('body', (req) => JSON.stringify(req.body)); // 요청 본문

// 2. 기본 미들웨어 설정
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true })); // 필요에 따라 CORS 설정

// express-session 설정
app.use(session({
  secret: process.env.SESSION_SECRET || 'GWLkL4Sqhdyo3Jk6bnRIQ24Kjs9yZOAC',  // 세션 암호화에 사용할 비밀키
  resave: false,  // 세션을 강제로 다시 저장하지 않음
  saveUninitialized: false,  // 초기화되지 않은 세션을 저장하지 않음
  // 배포 시 쿠키가 HTTPS 연결에서만 전송되도록 설정, 같은 사이트에서만 쿠키가 전송되도록 설정하여 CSRF 방지
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  }, // strict 보단 덜 엄격한
}));

app.use(passport.initialize());
app.use(passport.session());

// 로그 형식 설정: 기본 형식 + 쿼리 + 본문
app.use(morgan(
    ':method :url :status :response-time ms - query: :query - body: :body'));

// 3. 라우터 설정
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/social', socialRoutes);

// 4. 에러 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '서버 오류가 발생했습니다.', error: err.message });
});

// 5. 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

/*server.js 파일은 전체 서버 설정 및 주요 미들웨어 초기화를 담당합니다.

 1번 작업: server.js 파일 구성

 1. 필요한 모듈 및 환경 변수 로드
   - 필요한 패키지들(express, dotenv, cookie-parser, passport 등)을 불러오고, 환경 변수를 .env 파일에서 가져옵니다.

 2. 미들웨어 설정
   - 기본적인 미들웨어를 등록합니다.
   - cookie-parser, express.json, cors(필요 시 설정), passport 초기화 등을 포함하여, 쿠키와 JSON 데이터를 원활하게 처리할 수 있도록 합니다.

 3. 라우터 연결
   - 각 라우터 파일(authRoutes, userRoutes, socialRoutes)을 불러와 연결합니다.
   - 이후 authRoutes는 /auth, userRoutes는 /user, socialRoutes는 /social과 같은 경로로 설정하여 관리하기 쉽게 합니다.

 4. 에러 처리
   - 서버의 공통적인 에러 처리를 설정하여, 예외 발생 시 에러 응답을 일관되게 합니다.

 5. 서버 실행
   - app.listen을 사용하여 서버를 실행하고, 포트가 정상적으로 연결되었는지 콘솔에 출력합니다.*/