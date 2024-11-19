import apiClient from "@/lib/apiClient";
import {initDB} from "@/lib/notes/initDB";
import {deleteExpiredNotes, getNotes} from "@/services/notes/noteService";
import {getCategories} from "@/services/notes/categoryService";
import {
  initializeCategoriesAtom,
  initializeNotesAtom
} from "@/lib/notes/noteState";
import {useSetAtom} from "jotai";

// 유저 활동 시각을 서버에 업데이트
export async function SynchronizeWithServer(currentTime) {
  try {
    await apiClient.put('/sync/activity', { currentTime })

    const db = await initDB();
    const tx = db.transaction("user", "readwrite");
    const store = tx.objectStore("user");
    await store.put({ _id: "lastActivity", currentTime });
  } catch (error) {
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
export async function checkAndSyncOnFirstLoad(forceReload = false) {
  try {
    // 서버에서 마지막 활동 시간 조회
    const response = await apiClient.get('/sync/activity');
    const convertedServerLastActivity = new Date(response.data.lastActivity).getTime();
    await deleteExpiredNotes(); // 30일 자동 삭제 진행

    // 클라이언트의 마지막 동기화 시점 (IndexedDB 또는 전역 상태에서 가져옴)
    const clientLastActivity = await getClientLastActivity();

    // 활동 시간 비교 후 서버 시간이 더 최신이거나, 강제 요청 발생 시 동기화 진행
    if (convertedServerLastActivity > clientLastActivity || forceReload) {
      await getNotes(true);
      await getCategories(true);

      const initializeNotes = useSetAtom(initializeNotesAtom); // Jotai 상태 갱신
      const initializeCategories = useSetAtom(initializeCategoriesAtom);
      await initializeNotes(); // 노트 상태 초기화
      await initializeCategories(); // 카테고리 상태 초기화

      // 동기화 시점 저장
      await SynchronizeWithServer(Date.now());
    }
  } catch (error) {
  }
}