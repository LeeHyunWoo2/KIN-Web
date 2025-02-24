const visitorService = require("../../services/visitor/visitorService");
const { createErrorResponse } = require("../../middleware/errorHandler");

const recordVisitorController = async (req, res) => {
  try {
    const { visitorId } = req.body;
    const ip = req.headers["cf-connecting-ip"];
    const country = req.headers["cf-ipcountry"];
    const device = req.headers["sec-ch-ua-platform"];
    const browser = req.headers["sec-ch-ua"];

    if (country !== "KR") return res.status(200).json();

    const result = await visitorService.recordVisitor({ visitorId, ip, country, device, browser });
    res.status(201).json(result);
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "방문자 기록 저장 중 오류 발생");
    res.status(statusCode).json({ message, skipToast: true });
  }
};

module.exports = { recordVisitorController };