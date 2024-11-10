const Tag = require('../../models/tag');

// 태그 생성
exports.createTag = async (user_id, name) => {
  return await Tag.create({ name, user_id });
};

// 태그 조회
exports.getTags = async (user_id) => {
  return Tag.find({user_id});
};

// 태그 이름 수정
exports.updateTag = async (user_id, tagId, name) => {
  return Tag.findOneAndUpdate(
      {_id: tagId, user_id},
      {name},
      {new: true}
  );
};

// 태그 삭제
exports.deleteTag = async (user_id, tagId) => {
  return Tag.findOneAndDelete({_id: tagId, user_id});
};
