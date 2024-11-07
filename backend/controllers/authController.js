// 로컬 및 소셜 공통 로그인, 로그아웃, 회원가입을 처리하는 컨트롤러
const authService = require('../services/authService');
const tokenService = require('../services/tokenService');

// 1. 회원가입
const registerController = async (req, res) => {
  try {
    const { id, email, password, name, phone, marketingConsent  } = req.body;
    const user = await authService.registerUser({ id, email, password, name, phone, marketingConsent  });
    const tokens = tokenService.generateTokens(user);

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
    const { user, tokens } = await authService.loginUser(id, password);

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
    await tokenService.verifyRefreshToken(req.cookies.refreshToken);

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
    await tokenService.verifyRefreshToken(refreshToken);
    let tokens;
    res.cookie('accessToken', tokens.accessToken, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  } catch (error){

  }
}

module.exports = {
  registerController,
  loginController,
  logoutController,
  newTokenController,
};

/*authController.js는 로컬 및 소셜 공통 로그인, 로그아웃, 회원가입을 처리하는 컨트롤러로, 기본적인 JWT 발급 및 검증 로직을 담당합니다.
 authService와 연계하여 로그인, 로그아웃, 회원가입의 핵심 기능을 구현합니다.

 4번 작업: authController.js 파일 구성

 구현할 기능 목록
1. 회원가입: 새로운 로컬 계정을 생성하고 JWT 발급.
2. 로그인: 로컬 및 소셜 로그인 기능, 로그인 성공 시 JWT와 리프레시 토큰 발급.
3. 로그아웃: 모든 세션 관련 토큰을 폐기하고 사용자를 로그아웃 처리.


 기능 설명

1. 회원가입 (registerController):
   - authService.registerUser를 호출하여 새로운 로컬 계정을 생성합니다.
   - 생성된 계정 정보와 함께 JWT와 리프레시 토큰을 발급받아 쿠키에 저장합니다.
   - 성공 시 사용자 정보와 성공 메시지를 반환합니다.

2. 로그인 (loginController):
   - authService.loginUser를 호출하여 사용자 인증을 처리합니다.
   - 성공 시 JWT와 리프레시 토큰을 발급하고 쿠키에 저장하여 인증 상태를 유지합니다.
   - 로그인 실패 시 에러 메시지를 반환합니다.

3. 로그아웃 (logoutController):
   - tokenService.verifyRefreshToken를 통해 리프레시 토큰을 확인 후 폐기합니다.
   - accessToken, refreshToken 쿠키를 삭제하여 사용자를 로그아웃 처리합니다.

 추가 설명
- 토큰 발급 및 폐기: tokenService를 통해 JWT와 리프레시 토큰을 발급 및 관리하며, 로그아웃 시에는 리프레시 토큰을 무효화합니다.
- 에러 처리: 각 컨트롤러 메서드는 실패 시 에러 메시지를 반환하여 클라이언트에서 처리할 수 있게 합니다.

이제 authController.js에서 로컬 및 소셜 계정에 대한 기본적인 로그인, 로그아웃, 회원가입 기능을 설정할 수 있습니다.*/