const Note = require('../../models/note');

// 메모 리스트 조회
exports.getNotes = async (userId) => {
  return Note.find({user_id: userId, is_archived: false}).sort(
      {created_at: -1});
};

// 메모 상세보기
exports.getNoteById = async (noteId, userId) => {
  return Note.findOne({_id: noteId, user_id: userId});
};

// 메모 생성
exports.createNote = async (userId, title, content, category, tags) => {
  const note = new Note({
    user_id: userId,
    title,
    content,
    category,
    tags,
  });
  return await note.save();
};

// 메모 업데이트
exports.updateNote = async (noteId, title, content, category, tags) => {
  return Note.findByIdAndUpdate(
      noteId,
      {title, content, category, tags, updated_at: Date.now()},
      {new: true}
  );
};

// 메모 삭제
exports.deleteNote = async (noteId) => {
  return Note.findByIdAndDelete(noteId);
};
