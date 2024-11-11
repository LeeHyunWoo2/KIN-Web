import apiClient from "@/lib/apiClient";
import initDB from "@//lib/notes/initDB";

// 서버 시간 가져오기
async function getServerTime() {
  const response = await apiClient.get("/api/server-time");
  return new Date(response.data.serverTime);
}

// 노트 리스트
export const getNotes = async () => {
  const db = await initDB();
  const tx = db.transaction("notes", "readonly");
  const store = tx.objectStore("notes");

  const notes = await store.getAll();

  if (notes.length === 0) {
    const response = await apiClient.get("/notes");
    const fetchedNotes = response.data;

    // IndexedDB에 저장
    const tx = db.transaction("notes", "readwrite");
    const store = tx.objectStore("notes");
    for (const note of fetchedNotes) {
      store.put(note);
    }
    await tx.done;
    return fetchedNotes;
  }
  return notes;
};


// ID로 특정 노트 출력
export const getNoteById = async (id) => {
  const db = await initDB();
  const tx = db.transaction("notes", "readonly");
  const store = tx.objectStore("notes");

  const note = await store.get(id);

  if (!note) {
    const response = await apiClient.get(`/notes/${id}`);
    const fetchedNote = response.data;

    const tx = db.transaction("notes", "readwrite");
    const store = tx.objectStore("notes");
    store.put(fetchedNote);
    await tx.done;

    return fetchedNote;
  }

  return note;
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

// 휴지통에 노트 이동
export const moveToTrash = async (id) => {
  const db = await initDB();
  const serverTime = await getServerTime(); // 서버 시간 가져오기

  const tx = db.transaction("notes", "readwrite");
  const store = tx.objectStore("notes");

  const note = await store.get(id);
  if (note) {
    note.isTrashed = true;
    note.trashedAt = serverTime; // 서버 시간으로 삭제 날짜 설정
    store.put(note);
  }
  await tx.done;

  return note;
};

// 노트 복구
export const restoreNote = async (id) => {
  const db = await initDB();
  const tx = db.transaction("notes", "readwrite");
  const store = tx.objectStore("notes");

  const note = await store.get(id);
  if (note) {
    note.isTrashed = false;
    note.trashedAt = null; // 삭제 날짜 초기화
    store.put(note);
  }
  await tx.done;

  return note;
};

// 완전 삭제 (휴지통에서 영구 삭제)
export const deleteNotePermanently = async (id) => {
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
    if (note.isTrashed && note.trashedAt && now - new Date(note.trashedAt) > 30 * 24 * 60 * 60 * 1000) {
      store.delete(note._id); // 30일 이상 지난 노트 삭제
    }
  }
  await tx.done;
};