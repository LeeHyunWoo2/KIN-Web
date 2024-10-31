// passport 를 통해 여러 인증 전략을 통합적으로 관리하는 파일

const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
// passport-jwt에서 제공하는 JwtStrategy와 ExtractJwt를 불러옴.
// JwtStrategy는 JWT 토큰을 처리하는 전략.
// ExtractJwt는 요청에서 JWT를 추출하는 방법을 정의함.
const User = require('../models/user');

const GoogleStrategy = require('./passport-google')
const KakaoStrategy = require('./passport-kakao');
const NaverStrategy = require('./passport-naver');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // Authorization 헤더에서 JWT 토큰을 추출하는 방식.
  // "Bearer [token]" 형식으로 전달된 토큰을 추출.

  secretOrKey: process.env.JWT_SECRET,
  // JWT 토큰을 검증할 때 사용할 비밀 키. 환경 변수에서 가져옴.
};

module.exports = (passport) => {
  GoogleStrategy(passport);
  KakaoStrategy(passport);
  NaverStrategy(passport);


  // JWT 토큰
  passport.use(
      new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
          // JWT 토큰에서 추출한 userId로 사용자를 데이터베이스에서 찾음.
          const user = await User.findById(jwt_payload.userId);
          if (user) {
            // 사용자를 찾으면 done 함수로 null(에러 없음)과 user 객체를 반환하여 인증 성공.
            return done(null, user);
          }
          // 사용자가 없으면 done 함수로 false를 반환하여 인증 실패 처리.
          return done(null, false);
        } catch (error) {
          if (error.name === 'TokenExpiredError') {
            return done(null, false, { message: '토큰이 만료되었습니다.' });
          }
          return done(error, false);
        }
      })
  );


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