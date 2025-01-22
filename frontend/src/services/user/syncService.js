import apiClient from "@/lib/apiClient";
import { initDB } from "@/lib/notes/initDB";
import { deleteExpiredNotes, getNotes } from "@/services/notes/noteService";
import { getCategories } from "@/services/notes/categoryService";
import { getTags } from "@/services/notes/tagService";

// 유저 활동 시각을 PouchDB의 user 문서에 저장
async function saveUserActivityTime(db, currentTime) {
  try {
    await db.upsert("user_lastActivity", (doc) => {
      doc.type = "user";
      doc.currentTime = currentTime;
      return doc;
    });
  } catch (error) {
    console.error("활동 시간 저장 중 오류:", error);
  }
}

// PouchDB의 user 문서에서 활동 시간 조회
async function getClientLastActivity(db) {
  try {
    // 로컬 PouchDB에서 활동 시간 조회
    const activity = await db.get("user_lastActivity");
    return activity.currentTime;
  } catch (error) {
    if (error.status === 404) { // 활동시간이 없을경우
      return 0; // 기본값
    }
    throw error; // 다른 에러는 그대로 던짐
  }
}


// 서버와 클라이언트의 활동 시간 동기화
export async function SynchronizeWithServer(currentTime) {
  const db = await initDB();
  try {
    // 서버에 활동 시간 업데이트 요청
    await apiClient.put("/sync", { currentTime });

    // 로컬 PouchDB의 user 문서에 저장
    await saveUserActivityTime(db, currentTime);
  } catch (error) {
    console.error("서버와 동기화 중 오류:", error);
  }
}

// 첫 접속 시 서버와 클라이언트 활동 시간을 비교하여 동기화 결정
export async function checkAndSyncOnFirstLoad(forceReload = false) {
  const db = await initDB();
  try {
    // 서버에서 마지막 활동 시간 조회
    const response = await apiClient.get("/sync");
    const convertedServerLastActivity = new Date(response.data.lastActivity).getTime();
    await deleteExpiredNotes(); // 30일 자동 삭제 진행

    // 클라이언트의 마지막 동기화 시점
    const clientLastActivity = await getClientLastActivity(db);

    // 활동 시간 비교 후 서버 시간이 더 최신이거나, 강제 요청 발생 시 동기화 진행
    if (convertedServerLastActivity > clientLastActivity || forceReload) {
      // 노트, 카테고리, 태그 동기화
      const notes = await getNotes(true);
      const categories = await getCategories(true);
      const tags = await getTags(true);

      // 동기화된 데이터를 반환
      return { notes, categories, tags };
    }
    return null; // 동기화 필요 없으면 null
  } catch (error) {
    console.error("동기화 과정 중 오류:", error);
    return null;
  }
}