// 오류 형식 지정
module.exports.createErrorResponse = (statusCode, message) => ({
  statusCode,
  message,
});