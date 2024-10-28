const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
// passport-jwt에서 제공하는 JwtStrategy와 ExtractJwt를 불러옴.
// JwtStrategy는 JWT 토큰을 처리하는 전략.
// ExtractJwt는 요청에서 JWT를 추출하는 방법을 정의함.
const GoogleStrategy = require('passport-google-oauth20').Strategy; // Google OAuth 2.0
const User = require('../models/user');
// MongoDB에서 사용자를 찾기 위해 User 모델을 불러옴.

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // Authorization 헤더에서 JWT 토큰을 추출하는 방식.
  // "Bearer [token]" 형식으로 전달된 토큰을 추출.

  secretOrKey: process.env.JWT_SECRET,
  // JWT 토큰을 검증할 때 사용할 비밀 키. 환경 변수에서 가져옴.
};

module.exports = (passport) => {
  // JWT 토큰
  passport.use(
      new JwtStrategy(opts, async (jwt_payload, done) => {
        // JWT 토큰 디코딩 결과
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
  // Google OAuth
  passport.use(
      new GoogleStrategy(
          {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
          },
          async (accessToken, refreshToken, profile, done) => {
            try {
              // 구글 프로필에서 이메일을 추출
              const email = profile.emails[0].value;

              // 기존 유저가 있는지 확인
              let user = await User.findOne({ email });

              if (!user) {
                // 유저가 없으면 새로 생성 (소셜 계정 연동)
                user = new User({
                  name: profile.displayName,
                  email,
                  provider: 'google',
                  providerId: profile.id,
                });
                await user.save();
              } else {
                // 기존 유저에 소셜 계정 연동 (필요 시)
                const isLinked = user.socialAccounts.some(
                    (account) => account.provider === 'google' && account.providerId === profile.id
                );
                if (!isLinked) {
                  user.socialAccounts.push({
                    provider: 'google',
                    providerId: profile.id,
                  });
                  await user.save();
                }
              }

              return done(null, user);
            } catch (error) {
              return done(error, false);
            }
          }
      )
  );
};