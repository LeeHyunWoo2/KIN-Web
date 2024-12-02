import { openDB } from "idb";

export async function initDB() {
  // 로컬 스토리지에서 userInfo 가져오기
  const storedUserInfo = localStorage.getItem("userInfo");
  const userId = storedUserInfo ? JSON.parse(storedUserInfo).userId : null;

  if (!userId) {
    throw new Error("유저 정보가 없습니다. 새로고침 후 다시 시도해주세요.");
  }

  // 유저 ID 기반으로 DB 인스턴스 생성 또는 연결
  return await openDB(userId, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("notes")) {
        db.createObjectStore("notes", { keyPath: "_id" });
      }
      if (!db.objectStoreNames.contains("tags")) {
        db.createObjectStore("tags", { keyPath: "_id" });
      }
      if (!db.objectStoreNames.contains("categories")) {
        db.createObjectStore("categories", { keyPath: "_id" });
      }
      if (!db.objectStoreNames.contains("user")) {
        db.createObjectStore("user", { keyPath: "_id" });
      }
    },
  });
}