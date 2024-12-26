const { body, validationResult } = require('express-validator');

// 회원가입 데이터 검증 미들웨어
const validateUserSignup = [
  // 이메일 검증
  body('email')
  .isEmail()
  .withMessage('유효한 이메일 주소를 입력하세요.')
  .normalizeEmail(),

  // 비밀번호 검증: 8자 이상, 대문자, 소문자, 숫자, 특수문자 포함
  body('password')
  .isLength({ min: 8 })
  .withMessage('비밀번호는 최소 8자 이상이어야 합니다.')
  .matches(/[A-Z]/)
  .withMessage('비밀번호에는 대문자가 포함되어야 합니다.')
  .matches(/[a-z]/)
  .withMessage('비밀번호에는 소문자가 포함되어야 합니다.')
  .matches(/\d/)
  .withMessage('비밀번호에는 숫자가 포함되어야 합니다.')
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage('비밀번호에는 특수 문자가 포함되어야 합니다.'),

  // 이름 검증
  body('name')
  .optional()
  .isLength({ min: 2, max: 30 })
  .withMessage('이름은 2자 이상 30자 이하로 입력하세요.'),

  // 이용 약관 동의 검증
  body('termsAgreed')
  .equals('true')
  .withMessage('이용 약관에 동의해야 합니다.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


// 로그인 데이터 검증 미들웨어
const validateUserLogin = [
  // 이메일 검증
  body('email')
  .isEmail()
  .withMessage('유효한 이메일 주소를 입력하세요.')
  .normalizeEmail(),

  // 비밀번호 검증 (8자 이상만 확인)
  body('password')
  .isLength({ min: 8 })
  .withMessage('비밀번호는 최소 8자 이상이어야 합니다.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


// 회원 정보 수정 데이터 검증
const validateUserUpdate = [
  body('name')
  .optional()
  .isLength({ min: 2, max: 30 })
  .withMessage('이름은 2자 이상 30자 이하로 입력하세요.'),

  body('newPassword')
  .optional()
  .isLength({ min: 8 })
  .withMessage('비밀번호는 최소 8자 이상이어야 합니다.')
  .matches(/[A-Z]/)
  .withMessage('비밀번호에는 대문자가 포함되어야 합니다.')
  .matches(/[a-z]/)
  .withMessage('비밀번호에는 소문자가 포함되어야 합니다.')
  .matches(/\d/)
  .withMessage('비밀번호에는 숫자가 포함되어야 합니다.')
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage('비밀번호에는 특수 문자가 포함되어야 합니다.'),

  // 검증 결과 처리
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateUserUpdate, validateUserSignup, validateUserLogin };