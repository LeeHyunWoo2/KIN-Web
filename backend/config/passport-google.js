const GoogleStrategy = require('passport-google-oauth20').Strategy; // Google OAuth 2.0
const User = require('../models/user');

module.exports = (passport) => {
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
              const profileIcon = profile.photos[0].value; // 유저 구글 프사 가져오기

              // 기존 유저가 있는지 확인
              let user = await User.findOne({email});

              if (!user) {
                // 유저가 없으면 새로 생성 (소셜 계정 연동)
                user = new User({
                  name: profile.displayName,
                  email,
                  provider: 'google',
                  providerId: profile.id,
                  profileIcon,
                });
                await user.save();
              } else {
                // 기존 유저에 소셜 계정 연동 (유저가 요청 할 경우)
                const isLinked = user.socialAccounts.some(
                    (account) => account.provider === 'google'
                        && account.providerId === profile.id
                );
                if (!isLinked) {
                  user.socialAccounts.push({
                    provider: 'google',
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