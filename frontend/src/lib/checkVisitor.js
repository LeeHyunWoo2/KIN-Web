import { v4 as uuidv4 } from "uuid";
import apiClient from "@/lib/apiClient"; // axios 프록시 사용

const checkVisitor = async () => {
  if (localStorage.getItem("visitorFlag") === "true") return;


  let visitorId = localStorage.getItem("visitorId");
  if (!visitorId) {
    visitorId = uuidv4();
    localStorage.setItem("visitorId", visitorId);
  }

  // 플래그 설정 (중복 요청 방지)
  localStorage.setItem("visitorFlag", "true");

  try {
    await apiClient.post("/visit-check", { visitorId });
  } catch (error) {
    console.error("방문자 체크 실패:", error);
  }
};

export default checkVisitor;