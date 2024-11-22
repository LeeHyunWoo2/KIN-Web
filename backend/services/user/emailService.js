const nodemailer = require('nodemailer');
const { generateEmailVerificationToken, verifyEmailVerificationToken } = require('./tokenService');

const sendVerificationEmail = async (email) => {
  // 이메일 인증 토큰 생성
  const token = generateEmailVerificationToken(email);
  const verificationLink = `http://localhost:3000/verify-email?token=${token}`;

  // 이메일 전송
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: '이메일 인증 요청',
    text: `Keep Idea Note 에 방문해주셔서 감사합니다.
    
    본인의 인증 요청이 맞다면 다음 링크를 클릭하여 이메일 인증을 완료하실 수 있습니다.
     
     ${verificationLink}`,
  };

  await transporter.sendMail(mailOptions);
};

const verifyEmailToken = async (token) => {
  try {
    const decoded = verifyEmailVerificationToken(token);
    if (!decoded) {
      throw new Error('유효하지 않은 토큰입니다.');
    }
    return decoded.email;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  sendVerificationEmail,
  verifyEmailToken
}