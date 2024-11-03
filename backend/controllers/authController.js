// 서비스 계층을 호출해 클라이언트 요청을 처리하는 파일

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
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
    const { user, accessToken, refreshToken } = await loginUser(email, password);

    // 토큰을 HTTP-Only 쿠키로 설정
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1시간
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    // 사용자 정보를 반환 (토큰 정보는 포함하지 않음)
    res.status(200).json({ message: '로그인 성공', user });
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
};
