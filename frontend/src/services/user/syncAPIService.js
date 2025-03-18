import apiClient from "@/lib/apiClient";
import {initDB} from "@/lib/notes/initDB";
import {deleteExpiredNotes} from "@/services/notes/noteAPIService";
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
    await apiClient.put("/sync", {currentTime});

    // 로컬 PouchDB의 user 문서에 저장
    await saveUserActivityTime(db, currentTime);
  } catch (error) {
    console.error("서버와 동기화 중 오류:", error);
  }
}

// 서버와 클라이언트의 활동시간을 비교해 동기화 작동 여부를 반환
async function shouldSyncWithServer(db) {
  try {
    const syncResponse = await apiClient.get("/sync");
    const serverLastActivity = new Date(
        syncResponse.data.lastActivity).getTime();

    const clientLastActivity = await getClientLastActivity(db);

    return serverLastActivity > clientLastActivity;
  } catch (error) {
    console.error("동기화 여부 확인 중 오류:", error);
    return false;
  }
}

export async function checkAndSyncOnFirstLoad(forceReload = false) {
  let db = await initDB();
  try {
    const needSync = forceReload || await shouldSyncWithServer(db);
    if (needSync) {
      // TODO :  문제가 발생했을때만 destroy 이후 동기화 하도록 변경하기
      await db.destroy();
      db = await initDB();

      const response = await apiClient.get("/sync/all");
      const {notes, categories, tags} = response.data;

      const decompressedNotes = notes.map((note) => ({
        ...note,
        content: getDecompressor(note.mode)(note.content),
      }))

      await saveDataToLocalDB("note", decompressedNotes, db);
      await saveDataToLocalDB("category", categories, db);
      await saveDataToLocalDB("tag", tags, db);

      return {decompressedNotes, categories, tags};
    }
    // 동기화 필요 없을 시 null
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// 통합 요청용 로컬 저장 함수
async function saveDataToLocalDB(type, data, db) {
  // 기존 데이터 제거
  const existingData = await db.find({selector: {type}});
  for (const item of existingData.docs) {
    await db.remove(item);
  }

  // 새로운 데이터 저장
  for (const item of data) {
    await db.put({...item, type, _id: item._id || item.id});
  }
}