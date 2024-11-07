const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { Strategy: KakaoStrategy } = require('passport-kakao');
const { Strategy: NaverStrategy } = require('passport-naver');
const User = require('../models/user');

const configureSocialStrategies = (passport) => {
  console.log('로그인 전략')
// Google 로그인/가입 전략
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      console.log('구글 로그인 전략');
      const providerId = profile.id;
      let user = await User.findOne({
        'socialAccounts.provider': 'google',
        'socialAccounts.providerId': providerId,
      });

      if (!user) {
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          profileIcon: profile.photos[0].value,
          socialAccounts: [{
            provider: 'google',
            providerId,
            socialRefreshToken: refreshToken,
          }],
          termsAgreed: true,
        });
        await user.save();
        console.log('너는 가입이다');
        return done(null, user);
      }
      console.log('너는 로그인이다');
      return done(null, user);
    } catch (error) {
      console.error(error);
      return done(error, false);
    }
  }));

// Kakao 로그인/가입 전략
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_CLIENT_SECRET,
    callbackURL: process.env.KAKAO_CALLBACK_URL,
    passReqToCallback: true,
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      console.log('카카오 로그인 전략');
      const providerId = profile.id;
      let user = await User.findOne({
        'socialAccounts.provider': 'kakao',
        'socialAccounts.providerId': providerId,
      });

      if (!user) {
        user = new User({
          name: profile.displayName,
          email: profile._json?.kakao_account?.email,
          profileIcon: profile._json?.properties?.profile_image,
          socialAccounts: [{
            provider: 'kakao',
            providerId,
            socialRefreshToken: refreshToken,
          }],
          termsAgreed: true,
        });
        await user.save();
        console.log('너는 가입이다');
        return done(null, user);
      }
      console.log('너는 로그인이다');
      return done(null, user);
    } catch (error) {
      console.error(error);
      return done(error, false);
    }
  }));

// Naver 로그인/가입 전략
  passport.use(new NaverStrategy({
    clientID: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET,
    callbackURL: process.env.NAVER_CALLBACK_URL,
    passReqToCallback: true,
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      console.log('네이버 로그인 전략');
      const providerId = profile.id;
      let user = await User.findOne({
        'socialAccounts.provider': 'naver',
        'socialAccounts.providerId': providerId,
      });

      if (!user) {
        user = new User({
          name: profile.displayName,
          email: profile._json.email,
          profileIcon: profile._json.profile_image,
          socialAccounts: [{
            provider: 'naver',
            providerId,
            socialRefreshToken: refreshToken,
          }],
          termsAgreed: true,
        });
        await user.save();
        console.log('너는 가입이다');
        return done(null, user);
      }
      console.log('너는 로그인이다');
      return done(null, user);
    } catch (error) {
      console.error(error);
      return done(error, false);
    }
  }));
};
module.exports = configureSocialStrategies;