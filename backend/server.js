process.on('uncaughtException', (err) => {
  console.error('[에러] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[에러] Unhandled Rejection:', reason);
});


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
const session = require("express-session");
const RedisStore = require('connect-redis').default;
const redisClient = require('./config/redis');
const logger = require("./middleware/logger");
const rateLimit = require("express-rate-limit");
const helmet = require('helmet');
const compression = require('compression');
const schedule = require('node-schedule');
const { backupDatabase } = require('./services/notes/backupService');
const WebSocket = require('ws');
const { getStatus } = require('./services/admin/statusService');
const mongoSanitize = require('express-mongo-sanitize'); // NoSQL 인젝션 보호
const xss = require('xss-clean'); // XSS 공격 방어
const hpp = require('hpp'); // 중복 파라미터 공격 방지

// 라우터 불러오기
const authRoutes = require('./routes/user/authRoutes');
const userRoutes = require('./routes/user/userRoutes');
const socialRoutes = require('./routes/user/socialRoutes');
const syncRoutes = require('./routes/user/syncRoutes');
const noteRoutes = require('./routes/notes/noteRoutes');
const categoryRoutes = require('./routes/notes/categoryRoutes');
const tagRoutes = require('./routes/notes/tagRoutes');
const emailRoutes = require('./routes/user/emailRoutes');
const os = require("os");



const app = express();
initializePassport(passport);

app.set('trust proxy', true);

// 1. 데이터베이스 연결
connectDB();

// morgan 미들웨어
app.use(logger);

// Helmet: 보안 헤더 설정
app.use(
    helmet({
      contentSecurityPolicy: false, // 필요시 설정
      hsts: {
        maxAge: 60 * 60 * 24 * 365, // HTTPS 강제: 1년
        includeSubDomains: true, // 서브도메인 포함
      },
    })
);

let httpsOptions = null;

// HTTPS 옵션 추가
if (process.env.NODE_ENV === 'production') {
  httpsOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH), // SSL 키 경로 (환경변수에 설정)
    cert: fs.readFileSync(process.env.SSL_CERT_PATH), // SSL 인증서 경로 (환경변수에 설정)
  };
}

// 2. 기본 미들웨어 설정
app.use(compression()); // 압축
app.use(express.json()); // JSON 파싱
app.use(cookieParser());
app.use(bodyParser.json());

app.use(
    cors({
      origin: [process.env.FRONTEND_URL, process.env.BACKEND_API_URL],
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
        'X-Requested-With',
        'cf-connecting-ip',
        'x-skip-interceptor',
        'x-api-key'
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
        secure: process.env.NODE_ENV === 'production', // HTTPS에서만 쿠키 전송
        httpOnly: true, // XSS 방지
        sameSite: 'lax', // CSRF 방지
        maxAge: 24 * 60 * 60 * 1000, // 세션 쿠키 유효 기간 (1일)
      },
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Rate Limit: 요청 제한
const globalLimiter = rateLimit({
  validate: {trustProxy: false}, // 프록시 검사 끄기, 클라우드플레어 때문에 켬
  windowMs: 10 * 60 * 1000,
  max: 1500, // IP당 1500 요청
  message: "요청 횟수를 초과했습니다.",
});

const apiLimiter = rateLimit({
  validate: {trustProxy: false},
  windowMs: 3 * 60 * 1000,
  max: 100, // IP당 최대 100 요청
  message: "요청 횟수를 초과 하였습니다. 잠시 후 다시 시도해주세요.",
  keyGenerator: (req) => {
    // 클라이언트의 실제 IP
    return req.headers['cf-connecting-ip'] || req.ip; // Cloudflare의 원본 IP 사용
  },
});

app.use(globalLimiter); // 전역 요청 제한

app.use('/auth', apiLimiter, authRoutes); // 좀 더 빡세게 제한
app.use('/email', apiLimiter, emailRoutes);

// 신규 추가된 보안 미들웨어
app.use(hpp()); // HTTP Parameter Pollution 방지
app.use(xss()); // XSS 공격 방어
app.use(mongoSanitize()); // MongoDB 주입 공격 방지

// 3. 라우터 설정
app.use('/user', userRoutes);
app.use('/social', socialRoutes);
app.use('/notes', noteRoutes);
app.use('/categories', categoryRoutes);
app.use('/tags', tagRoutes);
app.use('/sync', syncRoutes);

redisClient.on('error', (err) => {
  console.error('Redis Error:', err);
});

app.head('/', (req, res) => {
  res.status(200).end(); // 본문 없이 상태 코드만 반환
});

app.get('/', (req, res) => {
  res.send('서버 실행중');
});


// 서버 타임
app.get("/server-time", (req, res) => {
  res.json({ serverTime: new Date().toISOString() });
});

// 4. 전역 에러 포맷팅
app.use((err, req, res, next) => {
  const { statusCode, message } = createErrorResponse(err.status || 500, err.message || "서버에서 오류가 발생했습니다.");
  res.status(statusCode).json({ message, code: statusCode });
});

// 5. 백업 스케줄러 실행 (매일 정각)
schedule.scheduleJob('0 0 * * *', () => {
  console.log('백업 실행 : ', new Date());
  backupDatabase();
});

// 6. WebSocket 서버 생성
const wss = new WebSocket.Server({ noServer: true });
let isClientConnected = false; // 클라이언트 연결 상태 추적
let refreshInterval = 5000; // 기본값 5초
let intervalId;
const MAX_MESSAGE_SIZE = 1024 * 100; // 최대 100kb 까지 허용

// 웹소켓 핸들러 설정
wss.on('connection', async (ws) => {
  console.log('클라이언트 연결됨');
  isClientConnected = true;
  ws.isAlive = true;

  ws.on('pong', () => {
    ws.isAlive = true; // 클라이언트 연결 상태 체크
  });

  const interval = setInterval(() => {
    if (!ws.isAlive) {
      console.log('WebSocket ');
      ws.terminate();
      return;
    }

    ws.isAlive = false;
    ws.ping(); // 클라이언트가 응답하지 않으면 종료할 준비
  }, 30000); // 30초마다 Ping 체크

  // 첫 연결에 한해서 바로 전송
  const initialStatus = {
    ...(await getStatus()),
    cpuCount: os.cpus().length,
    cpuModel: os.cpus()[0].model,
    cpuSpeed: os.cpus()[0].speed
  } // 정적인 데이터는 갱신데이터에서 제외하고 처음에만 추가로 전송
  ws.send(JSON.stringify(initialStatus));

  ws.on('message', (message) => {
    if (message.length > MAX_MESSAGE_SIZE) {
      // 과도한 크기의 데이터가 들어오면 차단
      console.log('웹소켓 메세지 크기 초과');
      ws.close();
    }
    const data = JSON.parse(message);
    if (data.type === "setInterval" && typeof data.interval === "number") {
      refreshInterval = data.interval * 1000; // ms 단위로 변환
      clearInterval(intervalId); // 기존 간격 제거
      startInterval(); // 새 간격으로 시작
      console.log(`새로고침 간격 : ${refreshInterval / 1000}초`);
    }
  });

  ws.on('close', () => {
    console.log('클라이언트 연결 종료');
    clearInterval(interval);
    if (wss.clients.size === 0) {
      isClientConnected = false; // 모든 클라이언트가 연결 종료되면 false (여러 관리자가 모니터링중일때 바로 끊어지면 안됨)
    }
  });
});

// 상태 정보를 주기적으로 클라이언트에 전송
const startInterval = () => {
  intervalId = setInterval(async () => {
    const status = await getStatus();
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(status));
      }
    });
  }, refreshInterval);
};

// 서버 시작 시 초기 호출
startInterval();

// 7. Express, WebSocket 서버 연결
const PORT = process.env.PORT;
if (process.env.NODE_ENV === 'production') {
  https.createServer(httpsOptions, app).on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }).listen(PORT, () => {
    console.log(`HTTPS 서버가 포트 ${PORT}에서 실행 중입니다.`);
  });
} else {
  const server = app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  });

  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });
}