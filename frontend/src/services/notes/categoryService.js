import { initDB } from "@/lib/notes/initDB";
import { getChildCategoryIds } from "@/lib/notes/categoryUtils";
import apiClient from "@/lib/apiClient";

// 카테고리 목록 조회
export const getCategories = async (forceReload = false) => {
  const db = await initDB();

  if (forceReload) {
    // 서버에서 카테고리 데이터 가져오기
    const response = await apiClient.get("/category", {
      headers: { "cache-control": "no-cache" },
    });
    const loadedCategories = response.data;

    // 로컬 PouchDB 초기화
    const existingCategories = await db.find({ selector: { type: "category" } });
    for (const category of existingCategories.docs) {
      await db.remove(category);
    }

    // 서버 데이터 저장
    for (const category of loadedCategories) {
      await db.put({ ...category, type: "category", _id: category._id || category.id });
    }

    return loadedCategories;
  } else {
    // 로컬 PouchDB에서 카테고리 데이터 가져오기
    const result = await db.find({ selector: { type: "category" } });
    return result.docs;
  }
};

// 카테고리 생성
export const createCategory = async (categoryData) => {
  const response = await apiClient.post("/category", categoryData);
  const newCategory = response.data;

  const db = await initDB();
  await db.put({ ...newCategory, type: "category", _id: newCategory._id || newCategory.id });

  return newCategory;
};

// 카테고리 업데이트
export const updateCategory = async (categoryId, updatedData) => {
  const response = await apiClient.put(`/category/${categoryId}`, updatedData);
  const updatedCategory = response.data;

  const db = await initDB();
  await db.upsert(updatedCategory._id || updatedCategory.id, (doc) => {
    doc.type = "category";
    return { ...doc, ...updatedCategory }; // 기존 문서와 병합
  });

  return updatedCategory;
};


// 카테고리 삭제
export const deleteCategory = async (categoryId, categories) => {
  const db = await initDB();

  // 삭제 대상 하위 카테고리 ID 수집
  const childCategoryIds = getChildCategoryIds(categoryId, categories);
  const categoryIdsToDelete = [...childCategoryIds, categoryId];

  // 관련 노트 ID 수집
  const notesResult = await db.find({ selector: { type: "note" } });
  const noteIdsToDelete = notesResult.docs
  .filter((note) => categoryIdsToDelete.includes(note.category._id))
  .map((note) => note._id);

  // 서버에 삭제 요청
  const response = await apiClient.delete("/category", {
    data: {
      categoryIds: categoryIdsToDelete,
      noteIds: noteIdsToDelete,
    },
  });

  const { deletedCategoryIds, deletedNoteIds } = response.data;

  // 로컬 PouchDB에서 삭제
  for (const id of deletedCategoryIds) {
    const category = await db.get(id);
    if (category && category.type === "category") await db.remove(category);
  }

  for (const id of deletedNoteIds) {
    const note = await db.get(id);
    if (note && note.type === "note") await db.remove(note);
  }

  return { deletedCategoryIds, deletedNoteIds };
};




/*
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
    if (forceReload){
      const clearTx = db.transaction("categories", "readwrite");
      const clearStore = clearTx.objectStore("categories");
      await clearStore.clear();
      await clearTx.done();
    }
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
*/
