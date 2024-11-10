import { openDB } from "idb";

async function initDB() {
  return await openDB("notes_app", 1, {
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
    },
  });
}

export default initDB;