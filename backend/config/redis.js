const Redis = require('ioredis');

// Redis 초기화
const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD || undefined,
  db: 0, // 기본 db 사용
});

// 연결 상태를 추적할 변수
let isConnected = false;

redisClient.on('connect', () => {
  isConnected = true;
  console.log('Redis 연결 성공');
});

redisClient.on('end', () => {
  isConnected = false;
  console.log('Redis 연결 종료');
});

redisClient.on('error', (err) => {
  console.error('Redis 연결 실패:', err.message);
});

// 연결 상태를 반환하는 함수
redisClient.isConnected = () => isConnected;

module.exports = redisClient;