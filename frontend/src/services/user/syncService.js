import apiClient from "@/lib/apiClient";
import {initDB} from "@/lib/notes/initDB";

// 유저 활동 시각을 서버에 업데이트
export async function SynchronizeWithServer(currentTime) {
  try {
    await apiClient.put('/sync/activity', { currentTime })

    const db = await initDB();
    const tx = db.transaction("user", "readwrite");
    const store = tx.objectStore("user");
    await store.put({ _id: "lastActivity", currentTime });
  } catch (error) {
    console.error(error);
  }
}

// 클라이언트 활동 시간 조회
async function getClientLastActivity() {
  const db = await initDB();
  const tx = db.transaction("user", "readonly");
  const store = tx.objectStore("user");
  const activity = await store.get("lastActivity");
  return activity ? activity.currentTime : 0;
}

// 첫 접속 시 서버와 클라이언트 활동 시간을 비교하여 동기화 결정
export async function checkAndSyncOnFirstLoad() {
  try {
    // 서버에서 마지막 활동 시간 조회
    const response = await apiClient.get('/sync/activity');
    const convertedServerLastActivity = new Date(response.data.lastActivity).getTime();


    // 클라이언트의 마지막 동기화 시점 (IndexedDB 또는 전역 상태에서 가져옴)
    const clientLastActivity = await getClientLastActivity();

    // 활동 시간 비교 후 차이가 있으면 동기화 진행 (데이터 동기화 로직은 추후 업데이트하기)
    if (convertedServerLastActivity > clientLastActivity) {
      console.log('동기화 실행');
      await SynchronizeWithServer(Date.now());
    }
  } catch (error) {
    console.error(error);
  }
}