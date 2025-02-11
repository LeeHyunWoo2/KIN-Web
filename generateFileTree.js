const fs = require("fs");
const path = require("path");

// 스캔 경로와 예외 폴더 지정
const ROOT_DIR = path.resolve("./"); // root
const OUTPUT_FILE = path.resolve("file-structure.json");
const EXCLUDE_FOLDERS = ["node_modules", ".git", "dist", ".next", ".fastRequest", ".idea"]; // 예외 폴더

function isExcluded(folder) {
  return EXCLUDE_FOLDERS.includes(folder);
}

// 파일과 폴더를 재귀적으로 탐색하여 JSON 생성
function generateFileTree(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  const result = items
    .filter((item) => !isExcluded(item.name)) // 예외 폴더 필터링
    .map((item) => {
      // 파일일 경우
      if (item.isFile()) {
        return {
          name: item.name,
          type: "file",
        };
      }

      // 폴더일 경우
      if (item.isDirectory()) {
        return {
          name: item.name,
          type: "folder",
          children: generateFileTree(path.join(dir, item.name)), // 재귀적으로 탐색
        };
      }

      return null; // 다른 항목은 제외
    })
    .filter(Boolean); // 빈 항목 제거

  return result;
}

// 최상위 객체 생성
const fileTree = {
  name: path.basename(ROOT_DIR), // Root의 이름
  type: "folder", // 항상 폴더로 시작
  children: generateFileTree(ROOT_DIR), // 재귀적으로 트리 생성
};

// JSON 파일로 저장
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(fileTree, null, 2), "utf-8");
console.log(`File tree has been saved to ${OUTPUT_FILE}`);