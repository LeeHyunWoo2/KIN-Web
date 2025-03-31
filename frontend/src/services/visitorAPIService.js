import apiClient from '@/lib/apiClient'
import { v4 as uuidv4 } from "uuid";

export const getVisitorList = async () => {
  try {
    const response = await apiClient.get("/visitor",{});
    return response.data;
  } catch (error) {
    console.error("방문자 데이터 불러오기 실패:", error);
    return [];
  }
}

export const recordVisitorInfo = async (path = "/") => {
  let visitorId = localStorage.getItem("visitorId");
  if (!visitorId) {
    visitorId = uuidv4();
    localStorage.setItem("visitorId", visitorId);
  }

  try {
    await apiClient.post("/visitor", { visitorId, path });
  } catch (error) {
    console.error("방문 기록 저장 실패:", error);
  }
};


export const sendTrackingData = async (data) => {
  const visitorId = localStorage.getItem("visitorId");
  if (!visitorId) return;

  try {
    await apiClient.put("/visitor", {
      visitorId,
      ...data,
    });
  } catch (error) {
    console.error("트래킹 데이터 전송 실패:", error);
  }
};
