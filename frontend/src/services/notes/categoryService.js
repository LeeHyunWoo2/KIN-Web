import apiClient from "@/lib/apiClient";
import {initDB} from "@//lib/notes/initDB";

// 카테고리 목록 조회
export const fetchCategories = async () => {
  const db = await initDB();
  const tx = db.transaction("categories", "readonly");
  const store = tx.objectStore("categories");

  const categories = await store.getAll();
  if (categories.length === 0) {
    const response = await apiClient.get('/category');
    const fetchedCategories = response.data;

    const tx = db.transaction("categories", "readwrite");
    const store = tx.objectStore("categories");
    for (const category of fetchedCategories) {
      store.put(category);
    }
    await tx.done;

    return fetchedCategories;
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
export const deleteCategory = async (categoryId) => {
  await apiClient.delete(`/category/${categoryId}`);

  const db = await initDB();
  const tx = db.transaction("categories", "readwrite");
  const store = tx.objectStore("categories");
  store.delete(categoryId);
  await tx.done;

  return categoryId;
};
