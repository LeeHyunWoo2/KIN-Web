import {recordVisitor} from "@/services/visitorAPIService";

const VISIT_EXPIRY = 60 * 60 * 1000;

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

const checkVisitor = async () => {
  const lastVisitTime = getLocalStorageWithExpiry("lastVisitTime");

  if (lastVisitTime) return;

  await recordVisitor();

  // 1시간 후 다시 요청할 수 있도록 저장
  setLocalStorageWithExpiry("lastVisitTime", Date.now(), VISIT_EXPIRY);
};

export default checkVisitor;
