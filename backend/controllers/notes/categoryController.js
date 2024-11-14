const categoryService = require('../../services/notes/categoryService');
const {createErrorResponse} = require("../../middleware/errorHandler");

// 카테고리 리스트 조회
exports.getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getCategories(req.user.id);
    res.status(200).json(categories);
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "카테고리 조회 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

// 카테고리 생성
exports.createCategory = async (req, res) => {
  try {
    const { name, description, parent_id } = req.body;
    const category = await categoryService.createCategory(req.user.id, name, description, parent_id);
    res.status(201).json(category);
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "카테고리 생성 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

// 카테고리 업데이트
exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description, parent_id } = req.body;
    const updatedCategory = await categoryService.updateCategory(categoryId, name, description, parent_id);
    res.status(200).json(updatedCategory);
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "카테고리 업데이트 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

// 카테고리 삭제
exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    await categoryService.deleteCategory(categoryId);
    res.status(200).json();
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "카테고리 삭제 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};
