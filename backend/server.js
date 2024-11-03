require('dotenv').config();
//  .env 파일에서 환경변수 불러옴

const express = require('express');
const session = require('express-session');
const connectDB = require('./config/db');
const helmet = require('helmet'); // 보안 관련 HTTP 헤더를 자동으로 설정해줌
const cors = require('cors');
// CORS 설정, 다른 도메인에서의 API 요청을 허용. 특정 도메인으로 허용 범위를 좁히고 싶다면
// app.use(cors({ origin: 'http://your-frontend-domain.com' })); 이렇게
const passport = require('passport');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// 라우트 파일
const localAuthRoutes = require('./routes/auth-local'); // 로컬 인증 라우트
const socialAuthRoutes = require('./routes/auth-social');
const tokenRoutes = require('./routes/auth-token'); // 토큰 관리 라우트
const sessionRoutes = require('./routes/sessionRoutes'); // 사용자 인증 라우트
const adminRoutes = require('./routes/admin'); // 관리자 라우트

const app = express();

// JSON 데이터를 파싱하기 위해 미들웨어 추가
app.use(express.json());

// 커스텀 토큰 설정: 요청 쿼리와 본문
morgan.token('query', (req) => JSON.stringify(req.query)); // 쿼리 파라미터
morgan.token('body', (req) => JSON.stringify(req.body)); // 요청 본문

// 로그 형식 설정: 기본 형식 + 쿼리 + 본문
app.use(morgan(':method :url :status :response-time ms - query: :query - body: :body'));


// express-session 설정
app.use(session({
  secret: process.env.SESSION_SECRET || 'GWLkL4Sqhdyo3Jk6bnRIQ24Kjs9yZOAC',  // 세션 암호화에 사용할 비밀키
  resave: false,  // 세션을 강제로 다시 저장하지 않음
  saveUninitialized: false,  // 초기화되지 않은 세션을 저장하지 않음
  // 배포 시 쿠키가 HTTPS 연결에서만 전송되도록 설정, 같은 사이트에서만 쿠키가 전송되도록 설정하여 CSRF 방지
  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, sameSite: 'lax' }, // strict 보단 덜 엄격한
}));


// DB 연결, 로직 처리는 config/db.js에서
connectDB();

// 미들웨어 설정
app.use(passport.initialize()); // Passport 초기화
app.use(passport.session());
app.use(express.json()); // JSON 파싱 미들웨어
app.use(helmet()); // 보안 관련 HTTP 헤더 설정
app.use(cors({
  origin: 'http://localhost:3000', // 프론트엔드 출처
  credentials: true, // 쿠키 전송 허용
})); // CORS 설정 나중에 위의 도메인 범위 좁히는 설정 추가 필요
app.use(cookieParser());



// Passport 설정 파일 로드
require('./config/passport')(passport);

//라우트 설정
app.use('/auth/local', localAuthRoutes); // 로컬 인증 관련 라우트
app.use('/auth/social', socialAuthRoutes); // 소셜 인증
app.use('/auth/token', tokenRoutes); // 토큰 관리
app.use('/auth', sessionRoutes); // 사용자 인증
app.use('/admin', adminRoutes); // 관리자


// JWT 보호 라우트 예시
app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: '인증된 사용자만 접근 가능합니다.' });
});

// 기본 라우트 설정 (테스트 라우트)
app.get('/', (req, res) => {
  res.send('API 서버 작동중');
});

// Role 체크 미들웨어 (나중에 활용하기)
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }
    next();
  };
};

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  const statusCode = err.status || 500; // 에러 상태 코드 설정
  res.status(statusCode).json({
    message: err.message, // 에러 메시지 반환
    stack: process.env.NODE_ENV === 'production' ? null : err.stack, // 개발 중에는 스택 트레이스 반환
  });
});

// 포트 설정
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버 작동중 포트 : ${PORT}`);
});
