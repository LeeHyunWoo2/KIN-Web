const socialService = require('../services/socialService');

// 소셜 계정 연동 해제
const unlinkSocialAccount = async (req, res) => {
  try {
    const { provider } = req.body;
    await socialService.unlinkAccount(req.user.id, provider);
    res.status(200).json({ message: `${provider} 계정이 성공적으로 연동 해제되었습니다.` });
  } catch (error) {
    res.status(500).json({ message: '소셜 계정 연동 해제 중 오류가 발생했습니다.', error: error.message });
  }
};

module.exports = {
  unlinkSocialAccount,
};