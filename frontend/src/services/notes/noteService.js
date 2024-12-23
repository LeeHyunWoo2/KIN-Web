import { initDB } from "@/lib/notes/initDB";
import apiClient from "@/lib/apiClient";
import { compressContent, decompressContent } from '@/lib/notes/noteCompressor';


// 서버 시간 가져오기
async function getServerTime() {
  const response = await apiClient.get("/api/server-time");
  return new Date(response.data.serverTime);
}

// 노트 리스트
export const getNotes = async (forceReload = false) => {
  const db = await initDB(); // PouchDB 초기화

  if (forceReload) {
    // PouchDB 삭제 (변경기록이 수시로 남아서 정크데이터가 너무 빨리 쌓이기 때문에 노트쪽에만 사용)
    await db.destroy();

    // 새 PouchDB 초기화
    const newDb = await initDB();

    // 서버에서 최신 데이터 가져오기
    const response = await apiClient.get("/notes", {
      headers: { "cache-control": "no-cache" },
    });
    const loadedNotes = response.data;

    // 복원
    const decompressedNotes = loadedNotes.map((note) => ({
      ...note,
      content: decompressContent(note.content),
    }))

    // 서버 데이터 저장
    for (const note of decompressedNotes) {
      await newDb.put({ ...note, type: "note", _id: note._id || note.id });
    }

    return decompressedNotes;
  } else {
    // PouchDB에서 노트 가져오기
    const result = await db.find({ selector: { type: "note" } }); // type 필터링
    return result.docs; // 결과 반환
  }
};


// 새 노트 생성
export const createNote = async (noteData) => {
  const db = await initDB();

  // content 만 압축, 나머진 그대로 전송
  const compressData = {
    ...noteData,
    content: compressContent(noteData.content),
  };

  // 서버에 새 노트 생성 요청
  const response = await apiClient.post("/notes", compressData); // 압축된 데이터를 서버로 전달
  const newNote = response.data;

  // PouchDB에 저장
  const decompressedNewNote = {
    ...newNote,
    content: decompressContent(newNote.content),
  };
  await db.put({ ...decompressedNewNote, type: "note", _id: newNote._id || newNote.id });

  return decompressedNewNote;
};


// 노트 업데이트
export const updateNote = async (updateDataList) => {
  const db = await initDB();

  // 데이터 압축
  const compressedDataList = updateDataList.map((note) => ({
    ...note,
    ...(note.content && { content: compressContent(note.content) }),
  }));

  // 서버에 압축된 데이터 전송
  const response = await apiClient.put("/notes", { updateDataList: compressedDataList });
  const updatedNotes = response.data;

  // 서버 응답 데이터 복원
  const decompressedUpdatedNotes = updatedNotes.map((note) => ({
    ...note,
    content: decompressContent(note.content),
  }));

  // PouchDB에 복원된 데이터를 저장
  for (const updatedNote of decompressedUpdatedNotes) {
    await db.upsert(updatedNote._id || updatedNote.id, (doc) => {
      doc.type = "note";
      return { ...doc, ...updatedNote }; // 기존 문서와 병합
    });
  }

  // 복원된 데이터를 반환
  return decompressedUpdatedNotes;
};



// 노트 삭제
export const deleteNote = async (ids) => {
  const db = await initDB();

  // 서버에 삭제 요청
  await apiClient.delete("/notes", { data: { ids } });

  // PouchDB에서 삭제
  for (const id of ids) {
    try {
      const note = await db.get(id);
      if (note && note.type === "note") {
        await db.remove(note);
      }
    } catch (error) {
      console.warn(`노트를 찾을 수 없거나 삭제할 수 없습니다.`);
    }
  }

  return ids;
};


// 30일 경과한 노트 자동 삭제
export const deleteExpiredNotes = async () => {
  const db = await initDB();

  // 서버 시간을 가져오기
  const now = await getServerTime();

  // 로컬 PouchDB에서 만료된 노트 가져오기
  const result = await db.find({ selector: { type: "note", is_trashed: true } });

  for (const note of result.docs) {
    const trashedAtTime = new Date(note.trashedAt).getTime();
    if (now - trashedAtTime > 30 * 24 * 60 * 60 * 1000) { // 30일 이상 지난 노트 삭제
      await db.remove(note);
    }
  }
};




/*
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
    // 강제 동기화 시 IndexedDB 비우기
    if (forceReload) {
      const clearTx = db.transaction("notes", "readwrite");
      const clearStore = clearTx.objectStore("notes");
      await clearStore.clear(); // IndexedDB 비우기
      await clearTx.done;
    }
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
export const updateNote = async (updateDataList) => {
  const response = await apiClient.put("/notes", { updateDataList }); // 배열로 전달
  const updatedNotes = response.data;

  const db = await initDB();
  const tx = db.transaction("notes", "readwrite");
  const store = tx.objectStore("notes");

  for await (const updatedNote of updatedNotes) {
    store.put(updatedNote); // 배열로 처리
  }
  await tx.done;

  return updatedNotes; // 배열 반환
};

// 완전 삭제 (휴지통에서 영구 삭제)
export const deleteNote = async (ids) => {
  await apiClient.delete("/notes", { data: { ids } });

  const db = await initDB();
  const tx = db.transaction("notes", "readwrite");
  const store = tx.objectStore("notes");

  for (const id of ids) {
    store.delete(id);
  }
  await tx.done;

  return ids;
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
};*/
