const morgan = require('morgan');

// 전체 URL 기준으로 필터링
const skipLog = (req) => {
  const excludedPaths = ['/notes', '/category', '/tags', '/api/server-time', '/sync/activity', '/auth/check-session'];
  const fullPath = req.originalUrl.split('?')[0]; // 쿼리스트링 제거
  return (req.method === 'GET' || req.method === 'OPTIONS' || req.method === 'PUT') && excludedPaths.includes(fullPath);
};

// 현재 시간 토큰 추가 (포맷팅 최적화)
morgan.token('time', () => {
  const now = new Date();
  const date = now.toLocaleDateString('en-CA'); // YYYY-MM-DD
  const time = now.toLocaleTimeString('en-GB', { hour12: false }); // HH:mm:ss
  const ms = now.getMilliseconds().toString().padStart(3, '0'); // 밀리초 추가
  return `${date} / ${time}.${ms}`;
});

// 커스텀 토큰
morgan.token('query', (req) => JSON.stringify(req.query || {}));
morgan.token('body', (req) => {
  const body = req.body || {};
  return JSON.stringify(body, null, 2); // JSON 포매팅
});
morgan.token('errorMessage', (req, res) => {
  return res.statusCode >= 400 ? `Error: ${res.statusMessage || 'Unknown error'}` : '';
});

// 커스텀 로그 포맷 (시간 포함)
const logFormat = ':time / :method :url [:status]  query: :query  body: :body  :errorMessage';

// 미들웨어 생성
const logger = morgan(logFormat, { skip: skipLog });

module.exports = logger;
