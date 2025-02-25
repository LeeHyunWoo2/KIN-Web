import apiClient from "@/lib/apiClient";
import { initDB } from "@/lib/notes/initDB";
import { deleteExpiredNotes, getNotes } from "@/services/notes/noteAPIService";
import { getCategories } from "@/services/notes/categoryAPIService";
import { getTags } from "@/services/notes/tagAPIService";
import {getDecompressor} from "@/lib/notes/noteCompressor";

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


export async function checkAndSyncOnFirstLoad(forceReload = false) {
  let db = await initDB();
  try {
    if (forceReload) {
      await db.destroy(); // 기존 데이터베이스 제거
      db = await initDB(); // 새 데이터베이스 초기화

      // forceReload가 활성화된 경우 통합 API 호출
      const response = await apiClient.get("/sync/all"); // 통합된 데이터 요청
      const { notes, categories, tags } = response.data;

      // 복원
      const decompressedNotes = notes.map((note) => ({
        ...note,
        content: getDecompressor(note.mode)(note.content),
      }))

      // 서버 데이터를 로컬 DB에 저장
      await saveDataToLocalDB("note", decompressedNotes, db);
      await saveDataToLocalDB("category", categories, db);
      await saveDataToLocalDB("tag", tags, db);

      return { decompressedNotes, categories, tags }; // 동기화된 데이터 반환
    } else {
      // forceReload가 false라면 개별 요청

      // 1. 활동 시간을 비교하기 위해 서버 API 호출
      const syncResponse = await apiClient.get("/sync");
      const convertedServerLastActivity = new Date(syncResponse.data.lastActivity).getTime();
      const clientLastActivity = await getClientLastActivity(db);

      // 2. 서버 시간과 클라이언트 마지막 활동 시간 비교
      if (convertedServerLastActivity > clientLastActivity) {
        // 새로운 데이터 요청 (3개의 개별 API 요청)
        const [notes, categories, tags] = await Promise.all([
          getNotes(true),
          getCategories(true),
          getTags(true)
        ]);

        // 로컬 데이터 업데이트
        await saveDataToLocalDB("note", notes, db);
        await saveDataToLocalDB("category", categories, db);
        await saveDataToLocalDB("tag", tags, db);

        return { notes, categories, tags }; // 동기화된 데이터 반환
      }

      // 3. 동기화 필요 없을 시 null 반환
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

// 통합 요청용 로컬 저장 함수
async function saveDataToLocalDB(type, data, db) {
  // 기존 데이터 제거
  const existingData = await db.find({ selector: { type } });
  for (const item of existingData.docs) {
    await db.remove(item);
  }

  // 새로운 데이터 저장
  for (const item of data) {
    await db.put({ ...item, type, _id: item._id || item.id });
  }
}