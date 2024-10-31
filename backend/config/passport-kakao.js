// passport-kakao.js
const KakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models/user');

module.exports = (passport) => {
  passport.use(
      new KakaoStrategy(
          {
            clientID: process.env.KAKAO_CLIENT_ID,
            clientSecret: process.env.KAKAO_CLIENT_SECRET, // 카카오는 시크릿키를 선택적으로 씀
            callbackURL: process.env.KAKAO_CALLBACK_URL,
          },
          async (accessToken, refreshToken, profile, done) => {
            try {
              // 프로필 정보에서 이메일과 프로필 이미지 접근
              const email = profile._json?.kakao_account?.email;
              const profileIcon = profile._json?.properties?.profile_image;

              // 이메일이 없는 경우 처리
              if (!email) {
                return done(null, false, { message: '카카오 계정에서 이메일 정보를 가져올 수 없습니다.' });
              }

              // 기존 유저가 있는지 확인
              let user = await User.findOne({ email });

              if (!user) {
                // 유저가 없으면 새로 생성 (소셜 계정 연동)
                user = new User({
                  name: profile.displayName,
                  email,
                  provider: 'kakao',
                  providerId: profile.id,
                  profileIcon,
                });
                await user.save();
              } else {
                // 기존 유저에 소셜 계정 연동 (유저가 요청할 경우)
                const isLinked = user.socialAccounts.some(
                    (account) => account.provider === 'kakao' && account.providerId === profile.id
                );
                if (!isLinked) {
                  user.socialAccounts.push({
                    provider: 'kakao',
                    providerId: profile.id,
                    profileIcon,
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