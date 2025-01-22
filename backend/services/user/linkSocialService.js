const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { Strategy: KakaoStrategy } = require('passport-kakao');
const { Strategy: NaverStrategy } = require('passport-naver');
const User = require('../../models/user');

const configureLinkingStrategies = (passport) => {
// Google 연동 전략
  passport.use('google-link', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_LINK_CALLBACK_URL,
    passReqToCallback: true,
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      const providerId = profile.id;
      const user = await User.findById(req.user.id);

      if (user) {
        user.socialAccounts.push({
          provider: 'google',
          providerId,
          socialRefreshToken: refreshToken,
        });
        await user.save();
        return done(null, user);
      }
      return done(new Error);
    } catch (error) {
      console.error(error);
      return done(error, false);
    }
  }));

// Kakao 연동 전략
  passport.use('kakao-link', new KakaoStrategy({
    clientID: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_CLIENT_SECRET,
    callbackURL: process.env.KAKAO_LINK_CALLBACK_URL,
    passReqToCallback: true,
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      const providerId = profile.id;
      const user = await User.findById(req.user.id);

      if (user) {
        user.socialAccounts.push({
          provider: 'kakao',
          providerId,
          socialRefreshToken: refreshToken,
        });
        await user.save();
        return done(null, user);
      }
      return done(new Error);
    } catch (error) {
      return done(error, false);
    }
  }));

// Naver 연동 전략
  passport.use('naver-link', new NaverStrategy({
    clientID: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET,
    callbackURL: process.env.NAVER_LINK_CALLBACK_URL,
    passReqToCallback: true,
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      const providerId = profile.id;
      const user = await User.findById(req.user.id);

      if (user) {
        user.socialAccounts.push({
          provider: 'naver',
          providerId,
          socialRefreshToken: refreshToken,
        });
        await user.save();
        return done(null, user);
      }
      return done(new Error);
    } catch (error) {
      return done(error, false);
    }
  }));
};

module.exports = configureLinkingStrategies;