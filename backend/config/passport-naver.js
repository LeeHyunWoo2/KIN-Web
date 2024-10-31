const NaverStrategy = require('passport-naver').Strategy;
const User = require('../models/user');

module.exports = (passport) => {
  passport.use(
      new NaverStrategy(
          {
            clientID: process.env.NAVER_CLIENT_ID,
            clientSecret: process.env.NAVER_CLIENT_SECRET,
            callbackURL: process.env.NAVER_CALLBACK_URL,
          },
          async (accessToken, refreshToken, profile, done) => {
            try {
              // 프로필 정보에서 이메일과 프로필 이미지 접근
              const profileData = profile._json.response;
              const email = profileData?.email;
              const profileIcon = profileData?.profile_image;

              // 이메일이 없는 경우 처리
              if (!email) {
                return done(null, false, { message: '네이버 계정에서 이메일 정보를 가져올 수 없습니다.' });
              }

              // 기존 유저가 있는지 확인
              let user = await User.findOne({ email });

              if (!user) {
                // 유저가 없으면 새로 생성 (소셜 계정 연동)
                user = new User({
                  name: profileData?.name,
                  email,
                  provider: 'naver',
                  providerId: profile.id,
                  profileIcon,
                });
                await user.save();
              } else {
                // 기존 유저에 소셜 계정 연동 (유저가 요청할 경우)
                const isLinked = user.socialAccounts.some(
                    (account) => account.provider === 'naver' && account.providerId === profile.id
                );
                if (!isLinked) {
                  user.socialAccounts.push({
                    provider: 'naver',
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