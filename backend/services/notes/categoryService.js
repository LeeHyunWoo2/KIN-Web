const Category = require('../../models/category');

// 카테고리 리스트 조회
exports.getCategories = async (userId) => {
  return Category.find({user_id: userId});
};

// 카테고리 생성
exports.createCategory = async (userId, name, description, parentId) => {
  try {
    // 상위 카테고리 존재 여부 확인
    if (parentId) {
      const parentCategory = await Category.findOne({ 
        _id: parentId,
        user_id: userId 
      });
      if (!parentCategory) {
        const error = new Error("상위 카테고리를 찾을 수 없습니다.");
        error.status = 400;
        throw error;
      }
    }

    const category = new Category({
      user_id: userId,
      name,
      description,
      parent_id: parentId
    });

    return await category.save();
  } catch (error) {
    throw error;
  }
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
