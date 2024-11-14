// 오류 형식을 지정
module.exports.createErrorResponse = (statusCode, message) => ({
  statusCode,
  message,
});