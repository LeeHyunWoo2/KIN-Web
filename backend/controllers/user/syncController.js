const syncService = require('../../services/user/syncService');

// 유저 활동 시간 갱신
exports.updateActivityTimeController = async (req, res) => {
  const userId = req.user.id;
  const activityTime = req.body.currentTime;

  try {
    const updatedUser = await syncService.updateUserActivityTime(userId, activityTime);
    res.json({ message: '활동 시간 갱신 : ', lastActivity: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 유저 마지막 활동 시간 조회
exports.getLastActivityController = async (req, res) => {
  const userId = req.user.id;

  try {
    const lastActivity = await syncService.getUserLastActivity(userId);
    res.json({ lastActivity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
