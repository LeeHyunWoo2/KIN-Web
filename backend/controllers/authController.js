const authService = require('../services/authService');
const tokenService = require('../services/tokenService');

// 1. 회원가입
const registerController = async (req, res) => {
  try {
    const { id, email, password, name, phone, marketingConsent } = req.body;

    // 회원가입 로직을 서비스에서 처리하고, 생성된 사용자와 토큰을 반환
    const user = await authService.registerUser({ id, email, password, name, phone, marketingConsent });
    const tokens = tokenService.generateTokens(user);

    // 쿠키에 JWT와 리프레시 토큰 설정
    res.cookie('accessToken', tokens.accessToken, { httpOnly: true, maxAge: 60 * 60 * 1000 }); // 1시간
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7일

    res.status(201).json({ message: '회원가입 성공', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. 로그인 (로컬)
const loginController = async (req, res) => {
  try {
    const { id, password } = req.body;

    // 로그인 로직을 서비스에서 처리하고, 사용자와 토큰 반환
    const { user, tokens } = await authService.loginUser(id, password);

    // 쿠키에 JWT와 리프레시 토큰 설정
    res.cookie('accessToken', tokens.accessToken, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json({ message: '로그인 성공', user });
  } catch (error) {
    res.status(400).json({ message: '로그인 실패: ' + error.message });
  }
};

// 3. 로그아웃
const logoutController = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    // 리프레시 토큰 검증 및 폐기를 서비스에서 처리
    await tokenService.verifyRefreshToken(refreshToken);

    // 모든 로그인 관련 쿠키 삭제
    res.clearCookie('accessToken', { httpOnly: true });
    res.clearCookie('refreshToken', { httpOnly: true });

    res.status(200).json({ message: '로그아웃 완료' });
  } catch (error) {
    res.status(500).json({ message: '로그아웃 실패: ' + error.message });
  }
};

// 4. 토큰 갱신
const newTokenController = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    // 리프레시 토큰 검증하고 새 토큰 발급
    const decoded = await tokenService.verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ message: '유효하지 않은 리프레시 토큰입니다.' });
    }

    const user = await authService.getUserById(decoded.id);
    const tokens = tokenService.generateTokens(user);

    // 새롭게 발급된 토큰을 쿠키에 설정
    res.cookie('accessToken', tokens.accessToken, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json({ message: '토큰 갱신 성공', tokens });
  } catch (error) {
    res.status(500).json({ message: '토큰 갱신 실패: ' + error.message });
  }
};

module.exports = {
  registerController,
  loginController,
  logoutController,
  newTokenController,
};