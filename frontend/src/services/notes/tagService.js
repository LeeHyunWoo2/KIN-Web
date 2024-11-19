import apiClient from "@/lib/apiClient";
import {initDB} from "@//lib/notes/initDB";

// 태그 목록 조회
export const getTags = async (forceReload = false) => {
  const db = await initDB();
  const tx = db.transaction("tags", "readonly");
  const store = tx.objectStore("tags");

  const tags = await store.getAll();
  if (tags.length === 0 || forceReload) {
    const response = await apiClient.get('/tags', {
      headers: {
        'cache-control': 'no-cache',
      },
    });
    const loadedTags = response.data;

    const tx = db.transaction("tags", "readwrite");
    const store = tx.objectStore("tags");
    for (const tag of loadedTags) {
      store.put(tag);
    }
    await tx.done;

    return loadedTags;
  }

  return tags;
};

// 태그 생성
export const createTag = async (tagData) => {
  const response = await apiClient.post('/tags', tagData);
  const newTag = response.data;

  const db = await initDB();
  const tx = db.transaction("tags", "readwrite");
  const store = tx.objectStore("tags");
  store.put(newTag);
  await tx.done;

  return newTag;
};

// 태그 업데이트
export const updateTag = async (tagId, updatedData) => {
  const response = await apiClient.put(`/tags/${tagId}`, updatedData);
  const updatedTag = response.data;

  const db = await initDB();
  const tx = db.transaction("tags", "readwrite");
  const store = tx.objectStore("tags");
  store.put(updatedTag);
  await tx.done;

  return updatedTag;
};

// 태그 삭제
export const deleteTag = async (tagId) => {
  await apiClient.delete(`/tags/${tagId}`);

  const db = await initDB();
  const tx = db.transaction("tags", "readwrite");
  const store = tx.objectStore("tags");
  store.delete(tagId);
  await tx.done;

  return tagId;
};