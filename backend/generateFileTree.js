const fs = require("fs");
const path = require("path");

// 스캔 경로와 예외 폴더 지정
const ROOT_DIR = path.resolve("./"); // root
const EXCLUDE_FOLDERS = ["node_modules", ".git", "dist", ".next", ".fastRequest", ".idea"]; // 예외 폴더

function isExcluded(folder) {
  return EXCLUDE_FOLDERS.includes(folder);
}

// 정렬 함수: 폴더가 위, 파일이 아래로 오도록 정렬
function sortByType(a, b) {
  if (a.type === "folder" && b.type === "file") return -1; // 폴더가 파일보다 앞에
  if (a.type === "file" && b.type === "folder") return 1;  // 파일이 폴더보다 뒤에
  return a.name.localeCompare(b.name); // 이름 기준으로 정렬
}

// 파일과 폴더를 스캔하여 JSON 생성
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

    return null; // 기타 항목은 제외
  })
  .filter(Boolean) // 빈 항목 제거
  .sort(sortByType); // 폴더-파일 순서로 정렬

  return result;
}

// 최상위 객체 생성
const fileTree = {
  name: path.basename(ROOT_DIR), // Root 이름
  type: "folder",
  children: generateFileTree(ROOT_DIR), // 재귀적으로 트리 생성
};

// JSON 파일로 저장
const OUTPUT_FILE = path.resolve("file-structure.json");
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(fileTree, null, 2), "utf-8");
console.log(`File tree has been saved to ${OUTPUT_FILE}`);