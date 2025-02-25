const Note = require('../../models/note');

// 노트 리스트 조회
exports.getNotes = async (userId) => {
  return Note.find({user_id: userId})
  .sort({created_at: -1});
};

// 노트 생성
exports.createNote = async (userId, title, content, category, tags, mode) => {
  const note = new Note({
    user_id: userId,
    title,
    content: Buffer.from(content),
    category,
    tags,
    mode,
  });
  return await note.save();
};

// 노트 업데이트
exports.updateNote = async (filter, updates) => {
  // content를 업데이트할 때 Buffer로 변환 필요
  if (updates.content) {
    updates.content = Buffer.from(updates.content);
  }
  return Note.findOneAndUpdate(
      filter,
      { ...updates, updated_at: Date.now() },
      { new: true }
  );
};

// 노트 삭제
exports.deleteNote = async (noteId) => {
  return Note.findByIdAndDelete(noteId);
};
