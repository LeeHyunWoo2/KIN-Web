// passport 를 통해 여러 인증 전략을 통합적으로 관리하는 파일
const configureSocialStrategies = require("../services/socialAuthService");
const configureLinkingStrategies = require("../services/linkSocialService");


module.exports = (passport) => {
  // JWT 토큰 인증 설정

  // 소셜 설정
  configureSocialStrategies(passport);

// 추가 연동용 소셜 전략 초기화
  configureLinkingStrategies(passport);

};