const userService = require('../../services/user/userService');
const {createErrorResponse} = require("../../middleware/errorHandler");

// 공개프로필 데이터
const getUserPublicProfileController = async (req, res) => {
  try {
    const userId = req.user.id; // 유저 검증 미들웨어를 통해 추가된 정보
    const publicProfile = await userService.getUserPublicProfile(userId);
    res.status(200).json(publicProfile);
  } catch (error) {
    res.status(500).json({ message: '프로필 조회 실패', error: error.message });
  }
};

// 사용자 정보 조회
const getUserInfoController = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "사용자 정보 조회 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

// 사용자 정보 조회 (이메일로 유저 찾기)
const getUserByInputController = async (req, res) => {
  try{
    const inputData= req.body;
    const user = await userService.getUserByInput(inputData);

    let checkAccountType;

    // 로컬 계정 여부 확인
    const hasLocalAccount = user.socialAccounts.some(account => account.provider === 'local');
    if (!hasLocalAccount) {
       checkAccountType = "SNS";
    } else {
       checkAccountType = "Local";
    }
    if(inputData.fetchUserId){
      res.status(200).json({signal: 'user_found', accountType: checkAccountType, id: user.id});
    } else {
      res.status(200).json({signal: 'user_found', accountType: checkAccountType, email: user.email});
    }
  } catch (error){
    res.status(200).json({signal: 'user_not_found'});
  }
}

// 사용자 정보 수정
const updateUserInfoController = async (req, res) => {
  try {
    // 테스트 계정 ID 배열
    const testAccountIds = ['672ae1ad9595d29f7bfbf34a', '672ae28b9595d29f7bfbf353'];
    if (testAccountIds.includes(req.user.id)){
      const customError = new Error('테스트 계정은 변경할 수 없습니다.');
      customError.status = 418;
      throw customError;
    }
    const { name, profileIcon } = req.body;
    const updatedUser = await userService.updateUser(req.user.id, { name, profileIcon });
    res.status(200).json({user: updatedUser});
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "사용자 정보 수정 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

// 사용자 정보 수정 (비밀번호 변경, 이메일로 찾기)
const resetPasswordController = async (req, res) => {
  try {
    const { newPassword, email } = req.body;
    await userService.resetPassword(newPassword, email);
    res.status(200).json({ message: "비밀번호가 성공적으로 변경되었습니다." });
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "비밀번호 변경 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

// 로컬 계정 추가 (소셜 Only 계정용)
const addLocalAccountController = async (req, res) => {
  try {
    const { id, email, password } = req.body;
    await userService.addLocalAccount(req.user.id, id, email, password);
    res.status(200).json();
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "로컬 계정 추가 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

// 회원 탈퇴
const deleteUserController = async (req, res) => {
  try {
    // 테스트 계정 ID 배열
    const testAccountIds = ['672ae1ad9595d29f7bfbf34a', '672ae28b9595d29f7bfbf353'];
    if (testAccountIds.includes(req.user.id)){
      const customError = new Error('테스트 계정은 탈퇴할 수 없습니다.');
      customError.status = 418;
      throw customError;
    }
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
  getUserPublicProfileController,
  getUserInfoController,
  getUserByInputController,
  updateUserInfoController,
  resetPasswordController,
  addLocalAccountController,
  deleteUserController,
};