const socialService = require('../../services/user/socialService');
const {createErrorResponse} = require("../../middleware/errorFormat");

// 소셜 계정 연동 해제
const unlinkSocialAccount = async (req, res) => {
  try {
    const { provider } = req.body;
    await socialService.unlinkAccount(req.user.id, provider);
    res.status(200).json();
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "소셜 계정 연동 해제 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

module.exports = {
  unlinkSocialAccount,
};