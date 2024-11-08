const Category = require('../../models/category');

// 카테고리 리스트 조회
exports.getCategories = async (userId) => {
  return Category.find({user_id: userId});
};

// 카테고리 생성
exports.createCategory = async (userId, name, description, parent_id) => {
  const category = new Category({
    user_id: userId,
    name,
    description,
    parent_id
  });
  return await category.save();
};

// 카테고리 업데이트
exports.updateCategory = async (categoryId, name, description, parent_id) => {
  return Category.findByIdAndUpdate(
      categoryId,
      {name, description, parent_id},
      {new: true}
  );
};

// 카테고리 삭제
exports.deleteCategory = async (categoryId) => {
  return Category.findByIdAndDelete(categoryId);
};
