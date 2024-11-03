const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { Strategy: KakaoStrategy } = require('passport-kakao');
const { Strategy: NaverStrategy } = require('passport-naver');
const User = require('../models/user');

const configureSocialStrategies = (passport) => {
  // Google Strategy
  passport.use(
      new GoogleStrategy(
          {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
          },
          async (accessToken, refreshToken, profile, done) => {
            try {
              const email = profile.emails[0].value;
              const profileIcon = profile.photos[0].value;
              const existingUser = await User.findOne({ email });
              if (existingUser) {
                return done(null, existingUser, new Error('이미 가입된 이메일 입니다.'));
              }
              const newUser = new User({
                name: profile.displayName,
                email,
                profileIcon,
                socialAccounts: [{ provider: 'google', providerId: String(profile.id) }],
                termsAgreed: true,
              });
              await newUser.save();
              return done(null, newUser);
            } catch (error) {
              return done(error, false);
            }
          }
      )
  );

  // Kakao Strategy
  passport.use(
      new KakaoStrategy(
          {
            clientID: process.env.KAKAO_CLIENT_ID,
            clientSecret: process.env.KAKAO_CLIENT_SECRET,
            callbackURL: process.env.KAKAO_CALLBACK_URL,
          },
          async (accessToken, refreshToken, profile, done) => {
            try {
              const email = profile._json?.kakao_account?.email;
              const profileIcon = profile._json?.properties?.profile_image;
              if (!email) {
                return done(new Error('카카오 계정에서 이메일 정보를 가져올 수 없습니다.'), false);
              }
              const existingUser = await User.findOne({ email });
              if (existingUser) {
                return done(null, existingUser, new Error('이미 가입된 이메일 입니다.'));
              }
              const newUser = new User({
                name: profile.displayName,
                email,
                profileIcon,
                socialAccounts: [{ provider: 'kakao', providerId: String(profile.id) }],
                termsAgreed: true,
              });
              await newUser.save();
              return done(null, newUser);
            } catch (error) {
              return done(error, false);
            }
          }
      )
  );

  // Naver Strategy
  passport.use(
      new NaverStrategy(
          {
            clientID: process.env.NAVER_CLIENT_ID,
            clientSecret: process.env.NAVER_CLIENT_SECRET,
            callbackURL: process.env.NAVER_CALLBACK_URL,
            passReqToCallback: true,
          },
          async (req, accessToken, refreshToken, profile, done) => {
            try {
              const email = profile._json.email;
              const profileIcon = profile._json.profile_image;
              if (!email) {
                return done(new Error("네이버 계정에서 이메일 정보를 가져올 수 없습니다."), false);
              }
              const existingUser = await User.findOne({ email });
              if (existingUser) {
                return done(null, existingUser, new Error('이미 가입된 이메일 입니다.'));
              }
              const newUser = new User({
                name: profile.displayName,
                email,
                profileIcon,
                socialAccounts: [{ provider: 'naver', providerId: String(profile.id) }],
                termsAgreed: true,
              });
              await newUser.save();
              return done(null, newUser);
            } catch (error) {
              return done(error, false);
            }
          }
      )
  );
};

module.exports = configureSocialStrategies;
