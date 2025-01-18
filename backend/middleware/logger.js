const morgan = require('morgan');

// 현재 시간 토큰 추가 (포맷팅 최적화)
morgan.token('time', () => {
  const now = new Date();
  const date = now.toLocaleDateString('en-CA'); // YYYY-MM-DD
  const time = now.toLocaleTimeString('en-GB', { hour12: false }); // HH:mm:ss
  const ms = now.getMilliseconds().toString().padStart(3, '0'); // 밀리초 추가
  return `${date} / ${time}.${ms}`;
});

// Body 내용을 수정하여 특정 필드 제외
morgan.token('body', (req) => {
  const body = req.body || {};

  // PUT /notes 요청인지 확인
  if (req.method === 'PUT' && req.originalUrl.split('?')[0] === '/notes') {
    const { updateDataList } = body;

    // updateDataList가 배열이면 content 값을 제거
    if (Array.isArray(updateDataList)) {
      const sanitizedDataList = updateDataList.map((item) => {
        const { content, ...rest } = item; // content 필드 제외
        return rest;
      });

      // 변경된 body 반환 (content 제거 후 JSON으로 포매팅)
      return JSON.stringify({ ...body, updateDataList: sanitizedDataList }, null, 2);
    }
  }

  // 기본적으로 전체 body 출력 (수정 없음)
  return JSON.stringify(body, null, 2);
});

// 커스텀 토큰 생성: query, errorMessage
morgan.token('query', (req) => JSON.stringify(req.query || {}));
morgan.token('errorMessage', (req, res) => {
  return res.statusCode >= 400 ? `Error: ${res.statusMessage || 'Unknown error'}` : '';
});

// 로그 포맷 정의
const logFormat = ':time / :method :url [:status] query: :query body: :body :errorMessage';

// 기본적으로 로그를 제외할 요청 경로 검증 (예외 처리)
const skipLog = (req) => {
  const excludedPaths = ['/category', '/tags', '/api/server-time', '/sync/activity', '/auth/check-session'];
  const fullPath = req.originalUrl.split('?')[0];
  // GET, OPTIONS 메서드에 대해 특정 경로만 로깅 제외
  return (req.method === 'GET' || req.method === 'OPTIONS') && excludedPaths.includes(fullPath);
};

// morgan 미들웨어 생성
const logger = morgan(logFormat, { skip: skipLog });
// const logger = morgan(logFormat, {});

module.exports = logger;