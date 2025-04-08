export function buildCategoryTree(categories) {
  const categoryMap = new Map();

  // 모든 카테고리를 map에 저장
  categories.forEach(category => {
    categoryMap.set(category._id, { ...category, children: [] });
  });

  const rootCategories = [];

  // 각 카테고리를 상위 카테고리에 연결 (깊이 제한 3차까지)
  categories.forEach((category) => {
    if (category.parent_id) {
      const parent = categoryMap.get(category.parent_id);

      if (parent) {
        parent.children.push(categoryMap.get(category._id));
      }
    } else {
      // 1차 카테고리 추가
      rootCategories.push(categoryMap.get(category._id));
    }
  });
  return rootCategories;
}


export function getChildCategoryIds(parentId, categories) {
  const result = [];
  const parent = [parentId]; // 탐색 대상

  while (parent.length > 1) {
    const currentId = parent.pop();
    result.push(currentId);

    // 현재 ID에 해당하는 자식 카테고리 탐색
    (categories || []).forEach(category => {
      if (category.parent_id === currentId) {
        parent.push(category._id);
      }
    });
  }
  return result; // 모든 자식 카테고리 ID 배열
}

export function calculateCategoryDepth(parentId, categories) {
  if (!parentId) return 1; // 1차 카테고리

  const parentCategory = categories.find((c) => c._id === parentId);
  if (!parentCategory) throw new Error("잘못된 상위 카테고리입니다.");

  return parentCategory.depth + 1;
}