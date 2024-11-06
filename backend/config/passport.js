// config/passport.js
const passport = require('passport');
const {Strategy: GoogleStrategy} = require('passport-google-oauth20');
const {Strategy: KakaoStrategy} = require('passport-kakao');
const {Strategy: NaverStrategy} = require('passport-naver');
const User = require('../models/user');

// Google 전략
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    console.log('구글 로그인 전략')

    const provider = 'google';
    const providerId = profile.id;
    const email = profile.emails[0].value;
    const profileIcon = profile.photos[0].value;

    const accountLink = req.session.isLink;
    const currentId = req.session.userId
    let user;

    console.log(refreshToken)

    if (accountLink) {
      console.log('넌 연동이다')
      user = await User.findById(currentId);
      console.log('유저는?')
      console.log(user)
      if (user) {
        user.socialAccounts.push({
          provider: provider,
          providerId: providerId,
          socialRefreshToken: refreshToken});
        await user.save();
        console.log('연동됨')
        console.log(currentId)
        return done(null, user);
      }
    } else {
      user = await User.findOne({
        'socialAccounts.provider': 'google',
        'socialAccounts.providerId': providerId,
      });

      if (!user && (accountLink === true)) {
        const newUser = new User({
          name: profile.displayName,
          email,
          profileIcon,
          socialAccounts: [{
            provider,
            providerId: String(profile.id),
            socialRefreshToken: String(refreshToken),
          }],
          termsAgreed: true,
        });
        await newUser.save();
        console.log('너는 가입이다')
        return done(null, newUser);
      }
      console.log('너는 로그인이다')
      return done(null, user)
    }
  } catch (error) {
    console.log('넌 나가라')
    console.log(error)
    return done(error, false);
  }
}));

// Kakao 전략
passport.use(new KakaoStrategy({
  clientID: process.env.KAKAO_CLIENT_ID,
  clientSecret: process.env.KAKAO_CLIENT_SECRET,
  callbackURL: process.env.KAKAO_CALLBACK_URL,
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    console.log('카카오 로그인 전략')

    const provider = 'kakao';
    const providerId = profile.id;
    const email = profile._json?.kakao_account?.email;
    const profileIcon = profile._json?.properties?.profile_image;

    const accountLink = req.session.isLink;
    const currentId = req.session.userId

    let user;

    if (accountLink) {
      console.log('넌 연동이다')
      user = await User.findById(currentId);
      console.log('유저는?')
      console.log(user)
      if (user) {
        user.socialAccounts.push({
          provider: provider,
          providerId: providerId,
          socialRefreshToken: refreshToken});
        await user.save();
        console.log('연동됨')
        console.log(currentId)
        return done(null, user);
      }
    } else {
      user = await User.findOne({
        'socialAccounts.provider': provider,
        'socialAccounts.providerId': providerId,
      });

      if (!user) {
        const newUser = new User({
          name: profile.displayName,
          email,
          profileIcon,
          socialAccounts: [{
            provider,
            providerId: String(profile.id),
            socialRefreshToken: refreshToken,
          }],
          termsAgreed: true,
        });
        await newUser.save();
        console.log('너는 가입이다')
        return done(null, newUser);
      }
      console.log('너는 로그인이다')
      return done(null, user)
    }
  } catch (error) {
    console.log('넌 나가라')
    console.log(error)
    return done(error, false);
  }
}));

// Naver 전략
passport.use(new NaverStrategy({
  clientID: process.env.NAVER_CLIENT_ID,
  clientSecret: process.env.NAVER_CLIENT_SECRET,
  callbackURL: process.env.NAVER_CALLBACK_URL,
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    console.log('네이버 로그인 전략')

    const provider = 'naver';
    const providerId = profile.id;
    const email = profile._json.email;
    const profileIcon = profile._json.profile_image;

    const accountLink = req.session.isLink;
    const currentId = req.session.userId

    let user;

    if (accountLink) {
      console.log('넌 연동이다')
      user = await User.findById(currentId);
      console.log('유저는?')
      console.log(user)
      if (user) {
        user.socialAccounts.push({
          provider: provider,
          providerId: providerId,
          socialRefreshToken: refreshToken});
        await user.save();
        console.log('연동됨')
        console.log(currentId)
        return done(null, user);
      }
    } else {
      user = await User.findOne({
        'socialAccounts.provider': provider,
        'socialAccounts.providerId': providerId,
      });

      if (!user) {
        const newUser = new User({
          name: profile.displayName,
          email,
          profileIcon,
          socialAccounts: [{
            provider,
            providerId: String(profile.id),
            socialRefreshToken: refreshToken,
          }],
          termsAgreed: true,
        });
        await newUser.save();
        console.log('너는 가입이다')
        return done(null, newUser);
      }
      console.log('너는 로그인이다')
      return done(null, user)
    }
  } catch (error) {
    console.log('넌 나가라')
    console.log(error)
    return done(error, false);
  }
}));

module.exports = passport;

/*passport.js 파일은 소셜 로그인 시 OAuth 2.0 전략 설정을 담당합니다.
기본적으로 passport는 OAuth 인증 전략을 설정하고, 소셜 계정 연동이나 소셜 로그인과 같은 특정 기능에서만 사용됩니다.

 3번 작업: passport.js 파일 구성

1. 필요한 모듈 로드 및 기본 설정
   - passport, passport-google-oauth20, passport-kakao, passport-naver 등 필요한 OAuth 전략을 불러옵니다.
   - 각각의 OAuth 전략을 사용하여 클라이언트 ID, 시크릿 키, 콜백 URL을 설정합니다.

2. OAuth 전략 설정
   - 각 소셜 플랫폼(예: Google, Kakao, Naver)에 대해 전략을 생성하고, 사용자 정보가 데이터베이스에 없으면 새 계정을 생성하거나 연동할 수 있도록 합니다.
   - 사용자 인증에 성공하면 사용자 ID 또는 사용자 객체를 done 콜백으로 반환하여 세션이나 JWT를 발급할 수 있습니다.

3. OAuth 콜백 처리
   - profile 정보에서 이메일, 이름, 프로필 사진 등의 사용자 정보를 가져와 데이터베이스에 저장하거나 업데이트합니다.
   - 연동된 계정이 있는 경우 해당 계정으로 로그인할 수 있도록 provider와 providerId를 확인합니다.

4. 사용자 직렬화/역직렬화 (선택)
   - 서버 세션을 사용할 경우에만 직렬화와 역직렬화 기능을 설정합니다. 하지만 현재는 JWT 기반이므로 세션을 사용하지 않아도 무방합니다.


 추가 설명
- 콜백 URL: 각 소셜 플랫폼에서 콜백 URL을 미리 등록하고 설정 파일(.env)에 환경 변수로 저장해 둡니다.
- 에러 처리: 각 OAuth 인증 실패 시 done(error, false)로 처리하여 에러 발생 시 로그인 실패를 반환합니다.
- 데이터베이스 연동: 데이터베이스에서 기존 계정이 없을 경우에만 계정을 생성하여 중복 생성을 방지합니다.

이렇게 passport.js가 설정되면 소셜 로그인 요청 시 각 소셜 플랫폼의 인증을 거쳐 사용자 정보를 처리할 수 있습니다.*/