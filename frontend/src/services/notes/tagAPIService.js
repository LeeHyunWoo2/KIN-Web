import { initDB } from "@/lib/notes/initDB";
import apiClient from "@/lib/apiClient";

// 태그 목록 조회
export const getTags = async (forceReload = false) => {
  const db = await initDB();

  if (forceReload) {
    // 서버에서 태그 데이터 가져오기
    const response = await apiClient.get("/tags", {
      headers: { "cache-control": "no-cache" },
    });
    const loadedTags = response.data;

    // 로컬 PouchDB 초기화
    const existingTags = await db.find({ selector: { type: "tag" } });
    for (const tag of existingTags.docs) {
      await db.remove(tag);
    }

    // 서버에서 가져온 태그 데이터 저장
    for (const tag of loadedTags) {
      await db.put({ ...tag, type: "tag", _id: tag._id || tag.id });
    }

    return loadedTags;
  } else {
    // 로컬 PouchDB에서 태그 데이터 가져오기
    const result = await db.find({ selector: { type: "tag" } });
    return result.docs;
  }
};

// 태그 생성
export const createTag = async (tagData) => {
  const response = await apiClient.post("/tags", tagData);
  const newTag = response.data;

  const db = await initDB();
  await db.put({ ...newTag, type: "tag", _id: newTag._id || newTag.id });

  return newTag;
};

// 태그 업데이트
export const updateTag = async (tagId, updatedData) => {
  const response = await apiClient.put(`/tags/${tagId}`, updatedData);
  const updatedTag = response.data;

  const db = await initDB();
  await db.upsert(updatedTag._id || updatedTag.id, (doc) => {
    doc.type = "tag";
    return { ...doc, ...updatedTag }; // 기존 문서와 병합
  });

  return updatedTag;
};


// 태그 삭제
export const deleteTag = async (tagId) => {
  const db = await initDB();

  // 태그를 참조 중인 노트 조회
  const notesResult = await db.find({ selector: { type: "note" } });
  const notesToUpdate = notesResult.docs.filter((note) =>
      note.tags?.some((tag) => tag._id === tagId)
  );

  // 서버에 태그 삭제 요청
  const response = await apiClient.delete(`/tags/${tagId}`, {
    data: { noteIds: notesToUpdate.map((note) => note._id) },
  });

  const { tagId: deletedTagId } = response.data;

  // 관련 노트 업데이트
  for (const note of notesToUpdate) {
    note.tags = note.tags.filter((tag) => tag._id !== deletedTagId);
    await db.put(note);
  }

  // 로컬 PouchDB에서 태그 삭제
  const tag = await db.get(tagId);
  if (tag && tag.type === "tag") await db.remove(tag);

  return { deletedTagId };
};