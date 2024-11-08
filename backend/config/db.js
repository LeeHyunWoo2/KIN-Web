const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    //  환경 변수에 있는 MONGO_URI를 통해 연결 URL을 가져옴.
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB 연결 성공');
  } catch (error) {
    console.error('MongoDB 연결 실패:', error);

    process.exit(1);
    // 연결 실패 시 프로세스를 종료
  }
};
module.exports = connectDB;