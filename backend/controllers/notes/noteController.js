const noteService = require('../../services/notes/noteService');
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// 노트 리스트 조회
exports.getNotes = async (req, res) => {
  try {
    const userId = req.user.id; // 인증된 사용자 ID
    const notes = await noteService.getNotes(userId);
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: '노트 리스트를 불러오는 중 오류가 발생했습니다.' });
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
    console.log("Error creating note:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// 노트 수정
exports.updateNote = async (req, res) => {
  try {
    const  id  = req.params.noteId;
    console.log(id)
    console.log(req.body)
    const { title, content, category, tags } = req.body;
    const user_id = req.user.id;
    console.log(title)

    const updatedNote = await noteService.updateNote(
        { _id: id, user_id },
        title, content, category, tags,
        { new: true }
    );

    if (!updatedNote) return res.status(404).json({ error: "노트를 찾을 수 없습니다." });
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 노트 삭제
exports.deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const deletedNote = await noteService.deleteNote(noteId);
    if (!deletedNote) return res.status(404).json({ message: '노트를 찾을 수 없습니다.' });
    res.status(200).json({ message: '노트가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '노트 삭제 중 오류가 발생했습니다.' });
  }
};
