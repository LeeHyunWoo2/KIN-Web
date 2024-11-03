const checkSession = (req, res) => {
  if (req.user) {
    // 인증된 (로그인중인) 사용자가 존재할 경우
    console.log('인증완료', req.user);
    res.status(200).json({ authenticated: true, user: req.user });
  } else {
    // 없을 경우
    console.log('미인증 상태')
    res.status(401).json({ authenticated: false });
  }
};
module.exports = {
  checkSession,
};