const User = require('../../models/user'); // User 모델 가져오기

// 유저 활동 시간 갱신
async function updateUserActivityTime(userId, activityTime) {
  try {
    return await User.findByIdAndUpdate(
        userId,
        {lastActivity: activityTime},
        {new: true} // 업데이트된 데이터 반환
    );
  } catch (error) {
    throw new Error;
  }
}

// 유저 활동 시간 조회
async function getUserLastActivity(userId) {
  try {
    const user = await User.findById(userId).select('lastActivity');
    return user.lastActivity;
  } catch (error) {
    throw new Error;
  }
}

module.exports = { updateUserActivityTime, getUserLastActivity };
