const axios = require("axios");

// 클라우드 플레어 Turnstile 검증
const verifyTurnstile = async (req, res, next) => {
  const { turnstileToken } = req.body;

  if (!turnstileToken) {
    return res.status(400).json({ success: false, message: "Turnstile 토큰 누락" });
  }

  try {
    const response = await axios.post("https://challenges.cloudflare.com/turnstile/v0/siteverify",
        new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
          cdata: req.cookies["cf_clearance"] || "",
        }).toString(),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    if (response.data.success) {
      next();
    } else {
      return res.status(403).json({ success: false, message: "Turnstile 검증 실패" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Turnstile 서버 오류" });
  }
};
module.exports = verifyTurnstile;