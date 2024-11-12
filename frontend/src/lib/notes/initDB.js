import { openDB } from "idb";

// 유저 ID 기반 고정
let setDB;

export function setUserDBInstance(userId) {
  if (!userId) {
    throw new Error("User ID가 필요합니다.");
  }
  setDB = createUserDBInstance(userId);
}

// initDB를 호출 대신 사용할 핸들러 (유저 단위로 DB를 나누고 사용하기 위해서 + initDB 부를때 userId 넣기 귀찮아서 만듦)
export async function initDB() {
  if (!setDB) {
    throw new Error("initDB가 설정되지 않음");
  }
  return await setDB();
}


function createUserDBInstance(userId) {
  return async function setDB() {
    return await openDB(userId, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("notes")) {
          db.createObjectStore("notes", { keyPath: "_id" });
        }
        if (!db.objectStoreNames.contains("tags")) {
          db.createObjectStore("tags", { keyPath: "_id" });
        }
        if (!db.objectStoreNames.contains("categories")) {
          db.createObjectStore("categories", { keyPath: "_id" });
        }
        if (!db.objectStoreNames.contains("user")) {
          db.createObjectStore("user", { keyPath: "_id" });
        }
      },
    });
  };
}
