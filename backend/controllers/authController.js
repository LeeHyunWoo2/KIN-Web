const jwt = require('jsonwebtoken'); // JWT 라이브러리 불러오기
const User = require('../models/user');
const bcrypt = require('bcryptjs');

// 회원가입 처리 함수
const registerUser = async (req, res) => {
  const {name, email, password, provider} = req.body;

  try {
    // 소셜 로그인 사용자는 비밀번호가 없을 수 있음
    let hashedPassword = null;
    if (provider === 'local') {
      const salt = await bcrypt.genSalt(10);
      // 생성된 salt 값을 사용해 비밀번호를 해시화.
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // 이메일 중복 확인
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({message: '이미 존재하는 이메일입니다.'});
    }

    // 새로운 사용자 객체 생성
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      // 비밀번호는 해시화된 값으로 저장
      provider
    });

    // DB에 저장
    await newUser.save();

    res.status(201).json({message: '회원가입 성공'});
  } catch (error) {
    res.status(500).json({message: '서버 오류', error});
  }
};

// 로그인 처리 함수
const loginUser = async (req, res) => {
  const {email, password, provider} = req.body;

  try {
    // 이메일로 사용자 찾기
    const user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({message: '유효하지 않은 사용자 정보'});
    }

    // 소셜 로그인 처리
    if (provider !== 'local') {
      // 소셜 로그인 유저가 이미 존재하는지 확인 후 토큰 발급
      const accessToken = jwt.sign(
          {userId: user._id}, // ._id 인 이유는 Mongoose 고유 오브젝트id 가 _id 라서 .을 찍어 객체속성 접근을 한것 user_id 저장하려고 한거 아님
          process.env.JWT_SECRET,
          {expiresIn: '1h'}
      );

      const refreshToken = jwt.sign(
          {userId: user._id},
          process.env.REFRESH_TOKEN_SECRET,
          {expiresIn: '7d'}
      );

      user.refreshToken = refreshToken;
      await user.save();

      return res.status(200).json({
        message: '소셜 로그인 성공',
        accessToken,
        refreshToken
      });
    }

    // 로컬 로그인 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({message: '비밀번호가 틀립니다.'});
    }

    // Access Token (1시간 만료)
    const accessToken = jwt.sign(
        {userId: user._id},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    );

    // Refresh Token (7일 만료)
    const refreshToken = jwt.sign(
        {userId: user._id},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '7d'}
    );

    // Refresh Token을 DB에 저장
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      message: '로그인 성공',
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({message: '서버 오류', error});
  }
};
// 컨트롤러 함수들을 내보내서 라우터에서 사용 가능하게 함
module.exports = {registerUser, loginUser};
