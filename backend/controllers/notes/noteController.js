const noteService = require('../../services/notes/noteService');

// 메모 리스트 조회
exports.getNotes = async (req, res) => {
  try {
    const userId = req.user._id; // 인증된 사용자 ID
    const notes = await noteService.getNotes(userId);
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: '메모 리스트를 불러오는 중 오류가 발생했습니다.' });
  }
};

// 메모 상세보기
exports.getNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user._id;
    const note = await noteService.getNoteById(noteId, userId);
    if (!note) return res.status(404).json({ message: '메모를 찾을 수 없습니다.' });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: '메모 상세보기를 불러오는 중 오류가 발생했습니다.' });
  }
};

// 메모 생성
exports.createNote = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, content, category, tags } = req.body;
    const note = await noteService.createNote(userId, title, content, category, tags);
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: '메모 생성 중 오류가 발생했습니다.' });
  }
};

// 메모 업데이트
exports.updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, content, category, tags } = req.body;
    const updatedNote = await noteService.updateNote(noteId, title, content, category, tags);
    if (!updatedNote) return res.status(404).json({ message: '메모를 찾을 수 없습니다.' });
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: '메모 업데이트 중 오류가 발생했습니다.' });
  }
};

// 메모 삭제
exports.deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const deletedNote = await noteService.deleteNote(noteId);
    if (!deletedNote) return res.status(404).json({ message: '메모를 찾을 수 없습니다.' });
    res.status(200).json({ message: '메모가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '메모 삭제 중 오류가 발생했습니다.' });
  }
};
