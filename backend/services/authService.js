// services/authService.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const tokenService = require('./tokenService');

// 1. 회원가입 (로컬 계정 생성)
const registerUser = async ({ id, email, password, name, phone, marketingConsent }) => {
  const existingUser = await User.findOne({ $or: [{ email }, { id }] });
  if (existingUser) {
    throw new Error('이미 가입된 이메일혹은 id입니다.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    id,
    email,
    password: hashedPassword,
    name,
    socialAccounts: [
      {
        provider: 'local',
        providerId: id,
      },
    ],
    termsAgreed: true,
    phone,
    marketingConsent
  });
  await user.save();
  return user;
};

// 2. 로그인 검증
const loginUser = async (id, password) => {
  const user = await User.findOne({ id });
  if (!user) {
    throw new Error('ID 또는 비밀번호가 잘못되었습니다.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('ID 또는 비밀번호가 잘못되었습니다.');
  }

  // 로그인 성공 시 토큰 발급
  const tokens = await tokenService.generateTokens(user);
  return { user, tokens };
};


module.exports = {
  registerUser,
  loginUser,
};

/*authService.js 파일은 JWT 발급 및 로그인 관련 로직을 담당하며, 로컬 및 소셜 로그인 시 필요한 토큰 발급과 사용자 인증을 처리합니다. 이 서비스 파일에서는 사용자 로그인 검증, JWT 발급 및 반환을 주요 기능으로 구현합니다.

 13번 작업: authService.js 파일 구성

 구현할 주요 기능
1. 회원가입: 새로운 로컬 계정을 생성하여 저장.
2. 로그인 검증: 사용자의 이메일과 비밀번호를 확인하여 로그인 허용 여부 결정.
3. JWT 발급: 로그인 성공 시 사용자에게 JWT와 리프레시 토큰을 발급하여 세션을 유지.


 기능 설명

1. 회원가입 (registerUser)
   - email을 기준으로 중복 계정을 확인하고, 중복된 경우 오류를 발생시킵니다.
   - 비밀번호를 해시하여 새로운 User 객체로 생성 및 저장합니다.
   - 저장된 사용자 객체를 반환합니다.

2. 로그인 검증 (loginUser)
   - 이메일로 사용자를 조회하고, 비밀번호를 비교하여 유효성을 검증합니다.
   - 비밀번호가 일치하면 tokenService.generateTokens를 통해 JWT와 리프레시 토큰을 발급받아 반환합니다.

3. 소셜 로그인 (socialLogin)
   - 소셜 계정(provider와 providerId)을 기준으로 연동된 로컬 계정을 찾습니다.
   - 해당 소셜 계정이 연동된 로컬 계정이 없는 경우 에러를 반환합니다.
   - 로그인 성공 시 tokenService.generateTokens로 JWT와 리프레시 토큰을 발급받아 반환합니다.

 추가 설명
- 토큰 발급: tokenService.generateTokens를 호출하여 로그인 성공 시 JWT와 리프레시 토큰을 발급받고 반환합니다.
- 에러 처리: 회원가입 시 중복 계정 에러, 로그인 시 인증 실패 에러를 명확히 반환하여 사용자에게 알립니다.

이제 authService.js에서 로컬 및 소셜 로그인 관련 인증 및 JWT 발급 로직을 간단하게 관리할 수 있습니다.*/