import apiClient from "@/lib/apiClient";
import {initDB} from "@//lib/notes/initDB";
import { getChildCategoryIds } from "@/lib/notes/categoryUtils";
import {deleteNote} from "@/services/notes/noteService"; // 하위 카테고리 탐색 함수

// 카테고리 목록 조회
export const getCategories = async (forceReload = false) => {
  const db = await initDB();
  const tx = db.transaction("categories", "readonly");
  const store = tx.objectStore("categories");

  const categories = await store.getAll();
  if (categories.length === 0 || forceReload) {
    const response = await apiClient.get('/category', {
      headers: {
        'cache-control': 'no-cache',
      },
    });
    const loadedCategories = response.data;

    const tx = db.transaction("categories", "readwrite");
    const store = tx.objectStore("categories");
    for (const category of loadedCategories) {
      store.put(category);
    }
    await tx.done;

    return loadedCategories;
  }

  return categories;
};

// 카테고리 생성
export const createCategory = async (categoryData) => {
  const response = await apiClient.post('/category', categoryData);
  const newCategory = response.data;

  const db = await initDB();
  const tx = db.transaction("categories", "readwrite");
  const store = tx.objectStore("categories");
  store.put(newCategory);
  await tx.done;

  return newCategory;
};

// 카테고리 업데이트
export const updateCategory = async (categoryId, updatedData) => {
  const response = await apiClient.put(`/category/${categoryId}`, updatedData);
  const updatedCategory = response.data;

  const db = await initDB();
  const tx = db.transaction("categories", "readwrite");
  const store = tx.objectStore("categories");
  store.put(updatedCategory);
  await tx.done;

  return updatedCategory;
};

// 카테고리 삭제
export const deleteCategory = async (categoryId, categories) => {
  try {
    // 1. 삭제 대상 추적
    const childCategoryIds = getChildCategoryIds(categoryId, categories); // 하위 카테고리 ID 가져오기
    const categoryIdsToDelete = [...childCategoryIds]; // 삭제할 모든 카테고리 ID 포함

    // 2. 카테고리와 연관된 노트 ID 수집
    const db = await initDB();
    const noteStore = db.transaction("notes", "readonly").objectStore("notes");
    const notes = await noteStore.getAll();
    const noteIdsToDelete = notes
    .filter((note) => categoryIdsToDelete.includes(note.category._id))
    .map((note) => note._id);

    // 3. 서버에 삭제 요청
    const response = await apiClient.delete(`/category`, {
      data: {
        categoryIds: categoryIdsToDelete,
        noteIds: noteIdsToDelete, // 연관된 노트 ID 포함
      },
    });

    const { deletedCategoryIds, deletedNoteIds } = response.data;

    // 4. IndexedDB 동기화
    const tx = db.transaction(["categories", "notes"], "readwrite");
    const categoryStore = tx.objectStore("categories");
    const noteStoreWritable = tx.objectStore("notes");

    deletedCategoryIds.forEach((id) => categoryStore.delete(id)); // 삭제된 카테고리 제거
    deletedNoteIds.forEach((id) => noteStoreWritable.delete(id)); // 삭제된 노트 제거

    await tx.done;

    return { deletedCategoryIds, deletedNoteIds };
  } catch (error) {
    console.error(error);
    throw new Error("카테고리 삭제 중 문제가 발생했습니다.");
  }
};
