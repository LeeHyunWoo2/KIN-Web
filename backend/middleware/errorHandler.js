const { createErrorResponse } = require('../utils/errorFormat'); // 기존 포맷팅 유틸 사용

const globalErrorHandler = (err, req, res, next) => {
  const { statusCode, message } = createErrorResponse(err.status || 500, err.message || "서버에서 오류가 발생했습니다.");
  res.status(statusCode).json({ message, code: statusCode });
};

module.exports = globalErrorHandler;