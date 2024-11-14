const userService = require('../../services/user/userService');
const {createErrorResponse} = require("../../middleware/errorHandler");

// 1. 사용자 정보 조회
const getUserInfo = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "사용자 정보 조회 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

// 2. 사용자 정보 수정
const updateUserInfo = async (req, res) => {
  try {
    const { name, profileIcon } = req.body;
    const updatedUser = await userService.updateUser(req.user.id, { name, profileIcon });
    res.status(200).json({user: updatedUser});
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "사용자 정보 수정 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

// 3. 로컬 계정 추가 (소셜 Only 계정용)
const addLocalAccount = async (req, res) => {
  try {
    const { id, email, password } = req.body;
    await userService.addLocalAccount(req.user.id, id, email, password);
    res.status(200).json();
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "로컬 계정 추가 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

// 4. 회원 탈퇴
const deleteUser = async (req, res) => {
  try {
    await userService.deleteUserById(req.user.id);
    res.clearCookie('accessToken', { httpOnly: true });
    res.clearCookie('refreshToken', { httpOnly: true });
    res.status(200).json();
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "회원 탈퇴 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

module.exports = {
  getUserInfo,
  updateUserInfo,
  addLocalAccount,
  deleteUser,
};