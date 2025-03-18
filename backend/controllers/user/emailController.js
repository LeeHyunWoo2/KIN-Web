const emailService = require('../../services/user/emailService');
const {createErrorResponse} = require("../../middleware/errorFormat");

const verifyEmail = async (req, res) => {
  const {token} = req.query;
  try {
    const email = await emailService.verifyEmailToken(token);
    res.status(200).send({message: '이메일 인증이 완료되었습니다.', email});
  } catch (error) {
    res.status(400).send({message: '인증 시간이 만료되었습니다.', error: error.message});
  }
};

const sendVerificationEmail = async (req, res) => {
  const {email} = req.body;

  try {
    await emailService.sendVerificationEmail(email);
    res.status(200).send({message: '이메일 인증 링크가 전송되었습니다.'});
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "이메일 전송 실패");
    res.status(statusCode).json({ message });
  }
};

module.exports = {
  verifyEmail,
  sendVerificationEmail
}