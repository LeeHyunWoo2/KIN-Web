const User = require('../models/user');
const tokenService = require('../services/tokenService');

// 1. 사용자 정보 조회
const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // 비밀번호 제외
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: '사용자 정보를 가져오는 중 오류가 발생했습니다.', error: error.message });
  }
};

// 2. 사용자 정보 수정
const updateUserInfo = async (req, res) => {
  try {
    const { name, profileIcon } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 사용자 정보 업데이트
    user.name = name || user.name;
    user.profileIcon = profileIcon || user.profileIcon;
    await user.save();

    res.status(200).json({ message: '사용자 정보가 성공적으로 수정되었습니다.', user });
  } catch (error) {
    res.status(500).json({ message: '사용자 정보 수정 중 오류가 발생했습니다.', error: error.message });
  }
};

// 3. 회원 탈퇴
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 유저 삭제 및 토큰 폐기
    await User.findByIdAndDelete(req.user.id);
    await tokenService.invalidateTokens(req.cookies.refreshToken); // 리프레시 토큰 폐기

    // 모든 쿠키 삭제
    res.clearCookie('accessToken', { httpOnly: true });
    res.clearCookie('refreshToken', { httpOnly: true });

    res.status(200).json({ message: '회원 탈퇴가 성공적으로 처리되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '회원 탈퇴 중 오류가 발생했습니다.', error: error.message });
  }
};

module.exports = {
  getUserInfo,
  updateUserInfo,
  deleteUser,
}

/*userController.js는 사용자 정보 조회, 수정, 삭제와 같은 CRUD 작업을 처리하는 컨트롤러로, 사용자 정보에 접근할 때는 인증된 사용자만 접근할 수 있도록 JWT 인증을 확인합니다.

 7번 작업: userController.js 파일 구성

 구현할 주요 기능
1. 사용자 정보 조회: JWT에서 인증된 사용자 정보를 기반으로 사용자 데이터를 조회합니다.
2. 사용자 정보 수정: 사용자 이름, 프로필 이미지 등 주요 정보를 수정합니다.
3. 회원 탈퇴: 데이터베이스에서 사용자를 삭제하고, 클라이언트의 인증 토큰을 폐기하여 로그아웃 처리합니다.


 기능 설명

1. 사용자 정보 조회 (getUserInfo)
   - 인증된 사용자의 ID를 JWT에서 가져와 사용자 정보를 조회합니다. 비밀번호는 제외하고 반환합니다.
   - 사용자 정보를 성공적으로 조회하면 JSON 형식으로 응답하며, 조회 실패 시 404 응답을 반환합니다.

2. 사용자 정보 수정 (updateUserInfo)
   - 인증된 사용자의 ID를 JWT에서 가져와 사용자의 이름, 프로필 이미지 등의 정보 수정 요청을 처리합니다.
   - 변경할 정보만 업데이트하며, 업데이트가 완료되면 성공 메시지와 함께 수정된 정보를 반환합니다.

3. 회원 탈퇴 (deleteUser)
   - 인증된 사용자를 데이터베이스에서 삭제합니다.
   - 리프레시 토큰을 폐기하여 세션을 만료하고, 클라이언트 측 accessToken과 refreshToken 쿠키를 모두 삭제하여 완전한 로그아웃 처리를 수행합니다.

 추가 설명
- 토큰 폐기 및 로그아웃 처리: 회원 탈퇴 시 tokenService를 통해 리프레시 토큰을 무효화하고, 모든 인증 토큰을 폐기합니다.
- 에러 처리: 각 메서드는 오류 발생 시 500 응답과 함께 오류 메시지를 반환하여, 클라이언트가 오류 상황을 쉽게 파악할 수 있도록 합니다.

이제 userController.js에서 사용자 정보 조회, 수정, 삭제 관련 CRUD 기능을 완성할 수 있습니다.*/