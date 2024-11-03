// passport 를 통해 여러 인증 전략을 통합적으로 관리하는 파일

const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/user');
const configureSocialStrategies = require('../services/socialAuthService');
const {configureLinkingStrategies} = require("../services/linkSocialService");

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['accessToken']; // 쿠키에서 Access Token 추출
        // console.log("추출된 토큰 :", token);
      }
      return token;
    },
  ]),
  secretOrKey: process.env.JWT_SECRET,
};

module.exports = (passport) => {
  // JWT 토큰 인증 설정
  passport.use(
      new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
          // 토큰에서 추출한 userId로 사용자를 DB에서 찾음
          const user = await User.findById(jwt_payload.userId);
          if (user) {
            return done(null, user); // 인증 성공 시 사용자 반환
          }
          return done(null, false); // 사용자 없음
        } catch (error) {
          if (error.name === 'TokenExpiredError') {
            return done(null, false, { message: '토큰이 만료되었습니다.' });
          }
          return done(error, false);
        }
      })
  );

  // 소셜 설정
  configureSocialStrategies(passport);

// 추가 연동용 소셜 전략 초기화
  configureLinkingStrategies(passport);

  // 직렬화 설정 (사용자 정보를 세션에 저장)
  passport.serializeUser((user, done) => {
    done(null, user.id); // 세션에 저장할 사용자 ID를 지정
  });

  // 역직렬화 설정 (세션에서 사용자 정보를 복원)
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id); // 세션에 저장된 ID로 사용자 조회
      done(null, user); // 사용자를 요청에 추가
    } catch (error) {
      done(error, null);
    }
  });
};