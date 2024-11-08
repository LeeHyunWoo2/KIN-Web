const userService = require('../services/userService');

// 1. 사용자 정보 조회
const getUserInfo = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. 사용자 정보 수정
const updateUserInfo = async (req, res) => {
  try {
    const { name, profileIcon } = req.body;
    const updatedUser = await userService.updateUser(req.user.id, { name, profileIcon });
    res.status(200).json({ message: '사용자 정보가 성공적으로 수정되었습니다.', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. 로컬 계정 추가 (소셜 Only 계정용)
const addLocalAccount = async (req, res) => {
  try {
    const { id, email, password } = req.body;
    await userService.addLocalAccount(req.user.id, id, email, password);
    res.status(200).json({ message: '로컬 계정이 성공적으로 추가되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. 회원 탈퇴
const deleteUser = async (req, res) => {
  try {
    await userService.deleteUserById(req.user.id);
    res.clearCookie('accessToken', { httpOnly: true });
    res.clearCookie('refreshToken', { httpOnly: true });
    res.status(200).json({ message: '회원 탈퇴가 완료되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserInfo,
  updateUserInfo,
  addLocalAccount,
  deleteUser,
};