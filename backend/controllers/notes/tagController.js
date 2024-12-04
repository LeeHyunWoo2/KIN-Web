const tagService = require('../../services/notes/tagService');
const {createErrorResponse} = require("../../middleware/errorHandler");

// 태그 생성
exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;

    const tag = await tagService.createTag(req.user.id, name);
    res.status(201).json(tag);
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "태그 생성 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

// 태그 조회
exports.getTags = async (req, res) => {
  try {
    const tags = await tagService.getTags(req.user.id);
    res.status(200).json(tags);
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "태그 조회 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

// 태그 이름 수정
exports.updateTag = async (req, res) => {
  try {
    const { tagId } = req.params;
    const { name } = req.body;

    const updatedTag = await tagService.updateTag(req.user.id, tagId, name);
    if (!updatedTag) return res.status(404).json({ message: "해당 태그를 찾을 수 없습니다." });
    res.status(200).json(updatedTag);
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "태그 수정 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

// 태그 삭제
exports.deleteTag = async (req, res) => {
  try {
    const { tagId } = req.params;
    const { noteIds } = req.body; // 클라이언트에서 전달한 noteIds

    console.log(noteIds);

    const deletedTag = await tagService.deleteTag(req.user.id, tagId, noteIds);
    if (!deletedTag) {
      return res.status(404).json({ message: "해당 태그를 찾을 수 없습니다." });
    }

    res.status(200).json(deletedTag); // 삭제 결과 반환
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "태그 삭제 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};