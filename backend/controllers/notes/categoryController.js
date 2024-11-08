const categoryService = require('../../services/notes/categoryService');

// 카테고리 리스트 조회
exports.getCategories = async (req, res) => {
  try {
    const userId = req.user._id;
    const categories = await categoryService.getCategories(userId);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: '카테고리 리스트를 불러오는 중 오류가 발생했습니다.' });
  }
};

// 카테고리 생성
exports.createCategory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, description, parent_id } = req.body;
    const category = await categoryService.createCategory(userId, name, description, parent_id);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: '카테고리 생성 중 오류가 발생했습니다.' });
  }
};

// 카테고리 업데이트
exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description, parent_id } = req.body;
    const updatedCategory = await categoryService.updateCategory(categoryId, name, description, parent_id);
    if (!updatedCategory) return res.status(404).json({ message: '카테고리를 찾을 수 없습니다.' });
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: '카테고리 업데이트 중 오류가 발생했습니다.' });
  }
};

// 카테고리 삭제
exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const deletedCategory = await categoryService.deleteCategory(categoryId);
    if (!deletedCategory) return res.status(404).json({ message: '카테고리를 찾을 수 없습니다.' });
    res.status(200).json({ message: '카테고리가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '카테고리 삭제 중 오류가 발생했습니다.' });
  }
};
