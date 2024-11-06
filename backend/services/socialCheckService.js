const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { Strategy: KakaoStrategy } = require('passport-kakao');
const { Strategy: NaverStrategy } = require('passport-naver');
const User = require('../models/user');

const configureSocialCheckStrategies = (passport) => {
  // Google 체크 전략
  console.log("Google 체크 전략 등록");
  passport.use(
      'google-check',
      new GoogleStrategy(
          {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
          },
          async (accessToken, refreshToken, profile, done) => {
            console.log('[google-check] 전략 실행');
            try {
              const user = await User.findOne({
                'socialAccounts.provider': 'google',
                'socialAccounts.providerId': profile.id,
              });
              if (user) {
                console.log('[google-check] 사용자 찾음');
                return done(null, user);
              }
              console.log('[google-check] 사용자 없음');
              return done(null, false, { message: 'Google 사용자 정보를 찾을 수 없습니다.' });
            } catch (error) {
              console.log('[google-check] 오류 발생:', error);
              return done(error, false);
            }
          }
      )
  );

  // Kakao 체크 전략
  passport.use(
      'kakao-check',
      new KakaoStrategy(
          {
            clientID: process.env.KAKAO_CLIENT_ID,
            clientSecret: process.env.KAKAO_CLIENT_SECRET,
            callbackURL: process.env.KAKAO_CALLBACK_URL,
          },
          async (accessToken, refreshToken, profile, done) => {
            try {
              const user = await User.findOne({ 'socialAccounts.provider': 'kakao', 'socialAccounts.providerId': profile.id });
              if (user) {
                return done(null, user);
              }
              return done(null, false, { message: 'Kakao 사용자 정보를 찾을 수 없습니다.' });
            } catch (error) {
              return done(error, false);
            }
          }
      )
  );

  // Naver 체크 전략
  passport.use(
      'naver-check',
      new NaverStrategy(
          {
            clientID: process.env.NAVER_CLIENT_ID,
            clientSecret: process.env.NAVER_CLIENT_SECRET,
            callbackURL: process.env.NAVER_CALLBACK_URL,
          },
          async (accessToken, refreshToken, profile, done) => {
            try {
              const user = await User.findOne({ 'socialAccounts.provider': 'naver', 'socialAccounts.providerId': profile.id });
              if (user) {
                return done(null, user);
              }
              return done(null, false, { message: 'Naver 사용자 정보를 찾을 수 없습니다.' });
            } catch (error) {
              return done(error, false);
            }
          }
      )
  );
};

module.exports = { configureSocialCheckStrategies };