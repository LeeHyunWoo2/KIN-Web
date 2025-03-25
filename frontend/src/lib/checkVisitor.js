import {
  recordVisitorInfo,
  sendTrackingData
} from "@/services/visitorAPIService";

const VISIT_EXPIRY = 60 * 60 * 1000;

// 일반적으로 쓰이는 봇 user-agent 키워드
const isBot = (userAgent) => {
  const botKeywords = [
    "bot",
    "crawler",
    "spider",
    "curl",
    "python",
    "ahrefs",
    "semrush",
    "facebookexternalhit",
    "bingpreview",
    "slurp",
    "wget",
    "node",
  ];
  const ua = userAgent.toLowerCase();
  return botKeywords.some((keyword) => ua.includes(keyword));
};

// 사람이 직접 찾아온건지 확인
const shouldTrackVisitor = () => {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent;

  const isHumanLike =
      /Mozilla|Chrome|Safari|Firefox|Edg|Opera|SamsungBrowser/.test(ua);

  if (!isHumanLike || isBot(ua)) return false;

  return true;
};

// 로컬스토리지에 만료시간을 설정하여 저장
const setLocalStorageWithExpiry = (key, value, ttl) => {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

// 로컬스토리지에서 만료된 데이터를 자동으로 제거
const getLocalStorageWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
};

export const checkVisitor = async () => {
  if (process.env.NODE_ENV === "development") return;

  const lastVisitTime = getLocalStorageWithExpiry("lastVisitTime");

  if (lastVisitTime || !shouldTrackVisitor()) return;

  await recordVisitorInfo(window.location.pathname);

  // 1시간 후 다시 요청할 수 있도록
  setLocalStorageWithExpiry("lastVisitTime", Date.now(), VISIT_EXPIRY);
};

export const companyTrace = async (stayDuration, trackUrl) => {
  if(stayDuration === undefined) {
    return;
  }
  if(trackUrl === undefined) {
    trackUrl = "/" + document.referrer.split("/")[3];
  }
  const isCompanyTrace = localStorage.getItem("companyTraceEnabled") === "true";
  if (!isCompanyTrace) return;
  await sendTrackingData({
    stayDuration,
    trackUrl,
    visitedAt: new Date().toISOString(),
  })
}