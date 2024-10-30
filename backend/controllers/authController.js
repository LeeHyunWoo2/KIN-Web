// 서비스 계층을 호출해 클라이언트 요청을 처리하는 파일

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  updateUserProfileIcon
} = require('../services/authService');

// 회원가입
const registerController = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: '회원가입 성공', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 로그인
const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const tokens = await loginUser(email, password);
    res.status(200).json(tokens);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 회원 정보 조회
const getUserProfileController = async (req, res) => {
  try {
    const user = await getUserProfile(req.user._id);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 정보 수정
const updateUserProfileController = async (req, res) => {
  try {
    const updatedUser = await updateUserProfile(req.user._id, req.body);
    res.status(200).json({ message: '회원 정보가 업데이트되었습니다.', updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 프로필 아이콘 업데이트 컨트롤러
const updateUserProfileIconController = async (req, res) => {
  const { profileIconUrl } = req.body;
  try {
    const updatedUser = await updateUserProfileIcon(req.user._id, profileIconUrl);
    res.status(200).json({ message: '프로필 아이콘이 업데이트되었습니다.', updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 회원 탈퇴
const deleteUserController = async (req, res) => {
  try {
    await deleteUser(req.user._id);
    res.status(200).json({ message: '회원 탈퇴가 완료되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  registerController,
  loginController,
  getUserProfileController,
  updateUserProfileController,
  deleteUserController,
  updateUserProfileIconController,
};
