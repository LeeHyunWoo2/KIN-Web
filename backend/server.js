require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// MongoDB 연결
connectDB();

// 미들웨어 설정
app.use(express.json());

app.use(helmet()); // 보안처리된 HTTP 헤더를 자동설정해줌.
app.use(cors()); // 다른 도메인의 API 호출 허용.

// 기본 라우트 설정
app.get('/', (req, res) => {
  res.send('API 서버가 작동 중입니다.');
});

// 포트 설정
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 작동 중입니다.`);
});

// 라우트 설정
app.use('/api/auth', authRoutes);
