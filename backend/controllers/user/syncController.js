const syncService = require('../../services/user/syncService');
const {createErrorResponse} = require("../../middleware/errorHandler");

// 유저 활동 시간 갱신
exports.updateActivityTimeController = async (req, res) => {
  const userId = req.user.id;
  const activityTime = req.body.currentTime;

  try {
    const updatedUser = await syncService.updateUserActivityTime(userId, activityTime);
    res.json({lastActivity: updatedUser});
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "유저 활동 시간 갱신 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

// 유저 마지막 활동 시간 조회
exports.getLastActivityController = async (req, res) => {
  const userId = req.user.id;

  try {
    const lastActivity = await syncService.getUserLastActivity(userId);
    res.json({ lastActivity });
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "유저 마지막 활동 시간 조회 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};
