const axios = require('axios');

const pingVercel = async () => {
  try {
    await axios.get(process.env.FRONTEND_URL+'/api/ping');
    console.log('핑');
  } catch (error) {
    console.error('핑실패', error.message);
  }

  // 이후 30~40초 랜덤 간격으로 핑 발송
  const randomInterval = Math.floor(Math.random() * 10000) + 30000;
  setTimeout(pingVercel, randomInterval);
};

// 첫 호출
pingVercel();