export function buildCategoryTree(categories) {
  const categoryMap = new Map();

  categories.forEach(category => {
    categoryMap.set(category._id, { ...category, children: [] });
  });

  const rootCategories = [];

  // 각 카테고리를 상위 카테고리에 연결
  categories.forEach(category => {
    if (category.parent_id) {
      const parent = categoryMap.get(category.parent_id);
      if (parent) {
        parent.children.push(categoryMap.get(category._id));
      }
    } else {
      rootCategories.push(categoryMap.get(category._id));
    }
  });

  return rootCategories;
}