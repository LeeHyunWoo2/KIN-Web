import apiClient from "@/lib/apiClient";
import {initDB} from "@//lib/notes/initDB";

// 서버 시간 가져오기
async function getServerTime() {
  const response = await apiClient.get("/api/server-time");
  return new Date(response.data.serverTime);
}

// 노트 리스트
export const getNotes = async (forceReload = false) => { // 기본적으로 false로 선언
  const db = await initDB();
  const tx = db.transaction("notes", "readonly");
  const store = tx.objectStore("notes");

  const notes = await store.getAll();

// 데이터가 없거나 강제 동기화 플래그가 활성화된 경우 서버에서 가져옴
  if (notes.length === 0 || forceReload) {
    const response = await apiClient.get("/notes", {
      headers: {
        'cache-control': 'no-cache',
      },
    }); // 그냥 리로드 버튼 누르면 캐싱해버려서 추가
    const loadedNotes = response.data;

    // IndexedDB에 저장
    const tx = db.transaction("notes", "readwrite");
    const store = tx.objectStore("notes");
    for (const note of loadedNotes) {
      store.put(note);
    }
    await tx.done;
    return loadedNotes;
  }
  return notes;
};

// 새 노트 생성
export const createNote = async (noteData) => {
  const response = await apiClient.post("/notes", noteData);
  const newNote = response.data;

  const db = await initDB();
  const tx = db.transaction("notes", "readwrite");
  const store = tx.objectStore("notes");
  store.put(newNote);
  await tx.done;

  return newNote;
};

// 노트 업데이트
export const updateNote = async (id, updatedData) => {
  const response = await apiClient.put(`/notes/${id}`, updatedData);
  const updatedNote = response.data;

  const db = await initDB();
  const tx = db.transaction("notes", "readwrite");
  const store = tx.objectStore("notes");
  store.put(updatedNote);
  await tx.done;

  return updatedNote;
};

// 완전 삭제 (휴지통에서 영구 삭제)
export const deleteNote = async (id) => {
  await apiClient.delete(`/notes/${id}`);

  const db = await initDB();
  const tx = db.transaction("notes", "readwrite");
  const store = tx.objectStore("notes");
  store.delete(id);
  await tx.done;

  return id;
};

// 30일 경과한 노트 자동 삭제
export const deleteExpiredNotes = async () => {
  const db = await initDB();
  const tx = db.transaction("notes", "readwrite");
  const store = tx.objectStore("notes");

  const allNotes = await store.getAll();
  const now = await getServerTime(); // 서버 시간으로 현재 시간 가져오기

  for (const note of allNotes) {
    if (note.is_trashed && note.trashedAt && now - new Date(note.trashedAt) > 30 * 24 * 60 * 60 * 1000) {
      store.delete(note._id); // 30일 이상 지난 노트 삭제
    }
  }
  await tx.done;
};