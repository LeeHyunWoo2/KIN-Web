const Redis = require('ioredis');

// Redis 초기화
const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD || undefined,
  db: 0,
});

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

redisClient.isConnected = () => isConnected;

module.exports = redisClient;