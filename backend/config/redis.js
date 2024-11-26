const Redis = require('ioredis');

// Redis 초기화
const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD || undefined,
  db: 0, // 기본 db 사용
});

redisClient.on('connect', () => {
  console.log('Redis 연결 성공');
});

redisClient.on('error', (err) => {
  console.error('Redis 연결 실패:', err.message);
});

module.exports = redisClient;