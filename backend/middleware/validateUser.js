const { body, validationResult } = require('express-validator');

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

/*
  // 비밀번호 확인 (passwordConfirm이 password와 일치하는지 확인)
  body('passwordConfirm')
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('비밀번호 확인이 일치하지 않습니다.');
    }
    return true;
  }),
*/

  // 닉네임 검증 2자 이상 30자 이하
  body('name')
  .optional()
  .isLength({ min: 2, max: 30 })
  .withMessage('닉네임은 2자 이상 30자 이하로 입력하세요.'),

  // 전화번호 검증
  body('phone')
  .optional()
  .matches(/^010-\d{4}-\d{4}$/)
  .withMessage('전화번호는 "010-xxxx-xxxx" 형식으로 입력하세요.'),

  // 이용 약관 동의 검증: 필수
  body('termsAgreed')
  .equals('true')
  .withMessage('이용 약관에 동의해야 합니다.'),

  body('marketingConsent')
  .optional()
  .isBoolean()
  .withMessage('마케팅 정보 수신 동의는 true 또는 false로 입력해야 합니다.'),

  // 검증 결과 처리
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateUserSignup };