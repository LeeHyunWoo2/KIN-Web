// 소셜 인증 전략 설정 파일
const configureSocialStrategies = require("../services/user/socialAuthService");
const configureLinkingStrategies = require("../services/user/linkSocialService");

module.exports = (passport) => {
  // 소셜 로그인 인증 전략
  configureSocialStrategies(passport);

  // 일반계정에 소셜 계정 추가 연동용 인증 전략
  configureLinkingStrategies(passport);
};