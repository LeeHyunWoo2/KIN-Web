// db 연결 설정을 처리하는 파일
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    //  환경 변수에 있는 MONGO_URI를 통해 연결 URL을 가져옴.
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    process.exit(1);
    // 연결 실패 시 프로세스를 종료
  }
};
module.exports = connectDB;