const Tag = require('../../models/tag');
const Note = require('../../models/note');

// 태그 생성
exports.createTag = async (user_id, name) => {
  return await Tag.create({ name, user_id });
};

// 태그 조회
exports.getTags = async (user_id) => {
  return Tag.find({ user_id }).select('name'); // mongoose는 기본적으로 select를 쓰면 _id를 반환해줌
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
exports.deleteTag = async (user_id, tagId, noteIds) => {

  const tag = await Tag.findOneAndDelete({ _id: tagId, user_id });
  if (!tag) {
    throw new Error('태그를 찾을 수 없습니다.');
  }

  // 노트 업데이트 (노트 ID가 없을 경우에도 안전하게 처리)
  if (noteIds && noteIds.length > 0) {
    await Note.updateMany(
        { _id: { $in: noteIds }, user_id },
        { $pull: { tags: { _id: tagId } } }
    );
  }

  // 결과 반환: 항상 배열
  return { tagId, updatedNotes: noteIds || [] };
};
