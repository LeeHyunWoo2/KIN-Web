const tagService = require('../../services/notes/tagService');

// 태그 생성
exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;

    const tag = await tagService.createTag(req.user.id, name);
    res.status(201).json(tag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 태그 조회
exports.getTags = async (req, res) => {
  try {
    const tags = await tagService.getTags(req.user.id);
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 태그 이름 수정
exports.updateTag = async (req, res) => {
  try {
    const { tagId } = req.params;
    const { name } = req.body;

    const updatedTag = await tagService.updateTag(req.user.id, tagId, name);
    if (!updatedTag) return res.status(404).json({ error: "태그를 찾을 수 없습니다." });
    res.status(200).json(updatedTag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 태그 삭제
exports.deleteTag = async (req, res) => {
  try {
    const { tagId } = req.params;

    const deletedTag = await tagService.deleteTag(req.user.id, tagId);
    if (!deletedTag) return res.status(404).json({ error: "태그를 찾을 수 없습니다." });
    res.status(200).json({ message: "태그 삭제 완료" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};