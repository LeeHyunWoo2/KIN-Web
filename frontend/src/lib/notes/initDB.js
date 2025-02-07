"use client"

import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";
import PouchDBUpsert from "pouchdb-upsert";

// 플러그인 등록
PouchDB.plugin(PouchDBFind);
PouchDB.plugin(PouchDBUpsert);

export async function initDB() {
  // 로컬 스토리지에서 userInfo 가져오기
  const storedUserInfo = localStorage.getItem("userInfo");
  const userId = storedUserInfo ? JSON.parse(storedUserInfo).userId : null;

  if (!userId) {
    throw new Error("유저 정보가 없습니다. 새로고침 후 다시 시도해주세요.");
  }

  // PouchDB 생성
  const dbName = `${userId}-localdb`;
  const db = new PouchDB(dbName);
  db._remote = false;
  // type 필드 인덱스 생성
  try {
    await db.createIndex({
      index: { fields: ["type"] },
    });
  } catch (error) {
    console.error("인덱스 생성 중 오류:", error);
  }

  return db;
}