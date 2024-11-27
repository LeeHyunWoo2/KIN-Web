const morgan = require('morgan');

// 전체 URL 기준으로 필터링
const skipLog = (req) => {
  const excludedPaths = ['/notes', '/category', '/tags'];
  const fullPath = req.originalUrl.split('?')[0]; // 쿼리스트링 제거
  return (req.method === 'GET' || req.method === 'OPTIONS') && excludedPaths.includes(fullPath);
};

// 커스텀 토큰
morgan.token('query', (req) => JSON.stringify(req.query || {}));
// 요청 본문
morgan.token('body', (req) => {
  const body = req.body || {};
  return JSON.stringify(body, null, 2); // JSON 포매팅
});
morgan.token('errorMessage', (req, res) => {
  return res.statusCode >= 400 ? `Error: ${res.statusMessage || 'Unknown error'}` : '';
});

// 커스텀 로그 포맷
const logFormat = ':method :url :status :response-time ms - query: :query - body: :body - :errorMessage';

// 미들웨어 생성
const logger = morgan(logFormat, { skip: skipLog });

module.exports = logger;