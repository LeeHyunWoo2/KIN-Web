import { initDB } from "@/lib/notes/initDB";
import apiClient from "@/lib/apiClient";
import { getCompressor, getDecompressor} from '@/lib/notes/noteCompressor';


// 서버 시간 가져오기
async function getServerTime() {
  const response = await apiClient.get("/server-time");
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
      content: getDecompressor(note.mode)(note.content), // 고차함수, 결과적으로 content 만 반환됨
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
    content: getCompressor(noteData.mode)(noteData.content),
  };

  // 서버에 새 노트 생성 요청
  const response = await apiClient.post("/notes", compressData); // 압축된 데이터를 서버로 전달
  const newNote = response.data;

  // PouchDB에 저장
  const decompressedNewNote = {
    ...newNote,
    content: getDecompressor(newNote.mode)(newNote.content),
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
    ...(note.content && { content: getCompressor(note.mode)(note.content) }),
  }));

  // 서버에 압축된 데이터 전송
  const response = await apiClient.put("/notes", { updateDataList: compressedDataList });
  const updatedNotes = response.data;

  // 서버 응답 데이터 복원
  const decompressedUpdatedNotes = updatedNotes.map((note) => ({
    ...note,
    content: getDecompressor(note.mode)(note.content),
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