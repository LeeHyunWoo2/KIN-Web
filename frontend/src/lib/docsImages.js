const dimg = {
  security: {
    https: {
      https1: require('../../public/images/docs/security/https/https.PNG'),
      https2: require('../../public/images/docs/security/https/https2.PNG'),
      backendssl: require(
          '../../public/images/docs/security/https/backend ssl blur.png'),
      certificate: require('../../public/images/docs/security/https/인증서.PNG'),
    },
    closedbackend: {
      apikey: require(
          '../../public/images/docs/security/closedbackend/apikeyblur.PNG'),
      iptable: require(
          '../../public/images/docs/security/closedbackend/iptable.PNG'),
      wafinfo: require(
          '../../public/images/docs/security/closedbackend/WAFinfo.PNG'),
      wafblur: require(
          '../../public/images/docs/security/closedbackend/WAFblur.PNG'),
      block: require(
          '../../public/images/docs/security/closedbackend/백엔드 차단.png'),
      notblock: require(
          '../../public/images/docs/security/closedbackend/백엔드차단안하면.PNG'),
      iprules: require(
          '../../public/images/docs/security/closedbackend/수신규칙.PNG'),
      websocketproxy: require(
          '../../public/images/docs/security/closedbackend/웹소켓 프록싱.png'),
      websocketproxylog: require(
          '../../public/images/docs/security/closedbackend/웹소켓프록싱로그.PNG'),
    },
    websocketproxy: {
      before: require(
          '../../public/images/docs/security/websocketproxy/웹소켓프록싱이전.png'),
      after: require(
          '../../public/images/docs/security/websocketproxy/웹소켓프록싱이후.PNG'),
      log: require(
          '../../public/images/docs/security/websocketproxy/웹소켓프록싱로그.PNG'),
    }
  },
  architecture: {
    image: require('../../public/images/docs/architecture.png'),
    diagram: require('../../public/images/docs/architecture-diagram.svg'),
  },
  font: {
    uxBefore: require('../../public/images/docs/fontUXbefore.gif'),
    uxAfter: require('../../public/images/docs/fontUXafter.gif'),
    optimizeBefore: require('../../public/images/docs/fontOptimizeBefore.PNG'),
    optimizeAfter: require('../../public/images/docs/fontOptimizeAfter.PNG'),
  },
  reqOptimize: {
    before: require('../../public/images/docs/issue/before.gif'),
    after: require('../../public/images/docs/issue/after.gif'),
  },
  dberror: require('../../public/images/docs/issue/global_error_handler.PNG'),
  platedoc: require('../../public/images/docs/issue/immutablePlate.png'),
  lighthouse: require('../../public/images/docs/lighthouse.PNG'),
  staticsrc: {
    fail: require('../../public/images/docs/issue/static-src-fail.PNG'),
    faillog: require('../../public/images/docs/issue/static-src-fail-log.png'),
  },
  /*계정 기능*/
  account: {
    signup: {
      test: require('../../public/images/docs/account/signup/testsignup.gif'),
      email: require('../../public/images/docs/account/signup/email.gif'),
    },
    login: {
      ui: require('../../public/images/docs/account/login/login1.PNG'),
      socialGoogle: require(
          '../../public/images/docs/account/login/sociallogin.gif'),
      socialKakao: require('../../public/images/docs/account/login/카카오로그인.gif'),
      socialNaver: require('../../public/images/docs/account/login/네이버로그인.gif'),
    },
    forgot: {
      id: require('../../public/images/docs/account/forgot/forgotid.gif'),
      pw: require('../../public/images/docs/account/forgot/forgotpw.gif'),
    },
    profile: require('../../public/images/docs/account/profile.gif'),
    deleteAccount: require('../../public/images/docs/account/delete.gif'),
    socialDeleteLink: require('../../public/images/docs/account/탈퇴연동.gif'),
  },
  /*노트 기능*/
  notes: {
    filter: {
      category: require('../../public/images/docs/notes/카테고리.gif'),
      tag: require('../../public/images/docs/notes/태그.gif'),
      compositeFilter: require('../../public/images/docs/notes/필터복합.gif'),
      displayTagClick: require('../../public/images/docs/notes/글태그클릭.gif'),
      pin: require('../../public/images/docs/notes/즐겨찾기.PNG'),
    },
  },
};

export default dimg;