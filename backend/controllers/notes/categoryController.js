const categoryService = require('../../services/notes/categoryService');
const {createErrorResponse} = require("../../middleware/errorHandler");
const Category = require("../../models/category");
const Note = require("../../models/note");

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
    const { name, parent_id } = req.body;
    const category = await categoryService.createCategory(req.user.id, name, parent_id);
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
    const { name, parent_id } = req.body;
    const updatedCategory = await categoryService.updateCategory(categoryId, name, parent_id);
    res.status(200).json(updatedCategory);
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "카테고리 업데이트 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

// 카테고리 삭제
exports.deleteCategory = async (req, res) => {
  try {
    const { categoryIds, noteIds } = req.body;

    // 1. 카테고리와 노트가 실제로 존재하는지 확인
    const existingCategories = await Category.find({ _id: { $in: categoryIds } });
    const existingNotes = await Note.find({ _id: { $in: noteIds } });

    const validCategoryIds = existingCategories.map((category) => category._id.toString());
    const validNoteIds = existingNotes.map((note) => note._id.toString());

    // 유효한 ID를 비교하여 로그 기록 (옵션)
    const invalidCategoryIds = categoryIds.filter((id) => !validCategoryIds.includes(id));
    const invalidNoteIds = noteIds.filter((id) => !validNoteIds.includes(id));

    if (invalidCategoryIds.length > 0 || invalidNoteIds.length > 0) {
      console.warn(`Invalid IDs detected. Categories: ${invalidCategoryIds}, Notes: ${invalidNoteIds}`);
    }

    // 2. 삭제 작업
    await Category.deleteMany({ _id: { $in: validCategoryIds } });
    await Note.deleteMany({ _id: { $in: validNoteIds } });

    // 3. 응답
    res.status(200).json({
      deletedCategoryIds: validCategoryIds,
      deletedNoteIds: validNoteIds,
    });
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "카테고리 삭제 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};