require('dotenv').config();
// .env 파일에서 환경변수 불러옴
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const helmet = require('helmet');
// 보안 관련 HTTP 헤더를 자동으로 설정해줌
const cors = require('cors');
// CORS 설정, 다른 도메인에서의 API 요청을 허용. 특정 도메인으로 허용 범위를 좁히고 싶다면
// app.use(cors({ origin: 'http://your-frontend-domain.com' }));
// 이런식으로 하면 된다.
const passport = require('passport');

const app = express();


// 연결 로직 처리는 config/db.js에서
connectDB();


// 미들웨어 설정
app.use(express.json());
app.use(passport.initialize());
app.use(helmet());
app.use(cors());


// Passport 설정 (구글 OAuth 포함)
require('./config/passport')(passport);

//라우트 설정
app.use('/api/auth', authRoutes);

// JWT 보호 라우트
app.get('/api/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: '인증된 사용자만 접근 가능합니다.' });
});

// Google OAuth 라우트
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(process.env.GOOGLE_CALLBACK_URL,
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/notes'); // 로그인 성공 후 리다이렉트 경로
    }
);

// 기본 라우트 설정 (테스트 라우트)
app.get('/', (req, res) => {
  res.send('API 서버 작동중');
});


app.use((req, res, next) => {
  res.status(404).json({ message: '페이지를 찾을 수 없습니다.' });
});


// Role 체크 미들웨어
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }
    next();
  };
};


// 관리자 전용 라우트
app.get('/admin', passport.authenticate('jwt', { session: false }), checkRole(['admin']), (req, res) => {
  res.json({ message: '관리자 전용 페이지입니다.' });
});


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
