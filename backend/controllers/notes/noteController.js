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
exports.updateNotes = async (req, res) => {
  try {
    const user_id = req.user.id; // 사용자 인증 정보
    const updateDataList = req.body.updateDataList; // 배열로 전달

    if (!Array.isArray(updateDataList) || updateDataList.length === 0) {
      return res.status(400).json({ message: "업데이트할 데이터가 없습니다." });
    }

    const updatedNotes = await Promise.all(
        updateDataList.map((data) =>
            noteService.updateNote(
                { _id: data.id, user_id }, // 필터
                { ...data }               // 업데이트 필드
            )
        )
    );

    res.status(200).json(updatedNotes.filter(Boolean)); // 업데이트된 노트 반환
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "노트 수정 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};



// 노트 삭제
exports.deleteNotes = async (req, res) => {
  try {
    const { ids } = req.body; // 삭제할 노트 ID 배열

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "삭제할 노트 ID가 없습니다." });
    }

    const deletedNotes = await Promise.all(
        ids.map((id) => noteService.deleteNote(id))
    ); // 배열 돌려가면서 삭제

    res.status(200).json(deletedNotes.filter(Boolean)); // 삭제된 노트 반환
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "노트 삭제 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};