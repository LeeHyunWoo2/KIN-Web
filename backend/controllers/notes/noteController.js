const noteService = require('../../services/notes/noteService');
const mongoose = require("mongoose");
const {createErrorResponse} = require("../../middleware/errorHandler");
const { ObjectId } = mongoose.Types;

// 노트 리스트 조회
exports.getNotes = async (req, res) => {
  try {
    const userId = req.user.id; // 인증된 사용자 ID
    const notes = await noteService.getNotes(userId);
    res.status(200).json(notes);
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "노트를 불러오던 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

// 노트 생성
exports.createNote = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const userId = new ObjectId(req.user.id); // 컨트롤러에서 변환

    const note = await noteService.createNote(userId, title, content, category, tags);

    res.status(201).json(note);
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "노트 생성 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

// 노트 수정
exports.updateNote = async (req, res) => {
  try {
    const id = req.params.noteId;
    const user_id = req.user.id;
    const updates = req.body; // 변경이 생긴 필드만

    const updatedNote = await noteService.updateNote(
        { _id: id, user_id },
        updates
    );
    if (!updatedNote) return res.status(404).json({ message: "해당 노트를 찾을 수 없습니다." });
    res.status(200).json(updatedNote);
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "노트 수정 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};


// 노트 삭제
exports.deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const deletedNote = await noteService.deleteNote(noteId);
    if (!deletedNote) return res.status(404).json({ message: '해당 노트를 찾을 수 없습니다.' });
    res.status(200).json();
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "노트 삭제 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};
