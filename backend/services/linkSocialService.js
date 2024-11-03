const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { Strategy: KakaoStrategy } = require('passport-kakao');
const { Strategy: NaverStrategy } = require('passport-naver');
const User = require('../models/user');



const configureLinkingStrategies = (passport) => {
  // Google 추가 연동
  passport.use(
      'google-link',
      new GoogleStrategy(
          {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_LINK_CALLBACK_URL,
            passReqToCallback: true, // req 객체 전달을 위해 설정
          },
          async (req, accessToken, refreshToken, profile, done) => {
            try {
              const provider = 'google';
              const providerId = profile.id;

              // 현재 로그인된 사용자 정보로 추가 연동을 진행 (req.user 사용 가능)
              const user = await User.findById(req.session.userId);
              if (!user) {
                return done(null, false, { message: '현재 사용자를 찾을 수 없습니다.' });
              }

              // 이미 연동된 소셜 계정인지 확인
              const isLinked = user.socialAccounts.some(
                  (account) => account.provider === provider && account.providerId === providerId
              );

              if (isLinked) {
                console.log('이미 연동된 구글 계정입니다.');
                return done(null, user, new Error('이미 동일한 계정으로 연동되어 있습니다.'));
              }

              // 소셜 계정 추가
              user.socialAccounts.push({ provider, providerId });
              await user.save();
              console.log(`소셜 계정 추가 완료 - user: ${user.email}`);
              return done(null, user);
            } catch (error) {
              console.error('구글 추가 연동 중 오류:', error);
              return done(error, false);
            }
          }
      )
  );

  // Kakao 추가 연동
  passport.use(
      'kakao-link',
      new KakaoStrategy(
          {
            clientID: process.env.KAKAO_CLIENT_ID,
            clientSecret: process.env.KAKAO_CLIENT_SECRET,
            callbackURL: process.env.KAKAO_LINK_CALLBACK_URL,
            passReqToCallback: true, // req.user 사용을 위해 추가
          },
          async (req, accessToken, refreshToken, profile, done) => {
            try {
              const provider = 'kakao';
              const providerId = profile.id;

              // 다른 계정에 동일한 소셜 계정이 연동되어 있는지 확인
              const existingUser = await User.findOne({
                'socialAccounts.provider': provider,
                'socialAccounts.providerId': providerId,
              });

              if (existingUser) {
                console.log('해당 카카오 계정은 이미 다른 계정에 연동되어 있습니다.');
                return done(null, false, { message: '해당 카카오 계정은 이미 다른 계정에 연동되어 있습니다.' });
              }

              const user = await User.findById(req.session.userId);
              if (!user) {
                return done(null, false, { message: '현재 사용자를 찾을 수 없습니다.' });
              }

              user.socialAccounts.push({ provider, providerId });
              await user.save();
              return done(null, user);
            } catch (error) {
              console.error('카카오 추가 연동 중 오류:', error);
              return done(error, false);
            }
          }
      )
  );

  // Naver 추가 연동
  passport.use(
      'naver-link',
      new NaverStrategy(
          {
            clientID: process.env.NAVER_CLIENT_ID,
            clientSecret: process.env.NAVER_CLIENT_SECRET,
            callbackURL: process.env.NAVER_LINK_CALLBACK_URL,
            passReqToCallback: true, // req.user 사용을 위해 추가
          },
          async (req, accessToken, refreshToken, profile, done) => {
            try {
              const provider = 'naver';
              const providerId = profile.id;

              // 다른 계정에 동일한 소셜 계정이 연동되어 있는지 확인
              const existingUser = await User.findOne({
                'socialAccounts.provider': provider,
                'socialAccounts.providerId': providerId,
              });

              if (existingUser) {
                console.log('해당 네이버 계정은 이미 다른 계정에 연동되어 있습니다.');
                return done(null, false, { message: '해당 네이버 계정은 이미 다른 계정에 연동되어 있습니다.' });
              }

              const user = await User.findById(req.session.userId);
              if (!user) {
                return done(null, false, { message: '현재 사용자를 찾을 수 없습니다.' });
              }

              user.socialAccounts.push({ provider, providerId });
              await user.save();
              return done(null, user);
            } catch (error) {
              console.error('네이버 추가 연동 중 오류:', error);
              return done(error, false);
            }
          }
      )
  );
};

module.exports = { configureLinkingStrategies };
