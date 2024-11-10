import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NoteDisplay from './NoteDisplay';
import { getNotes } from '@/services/notes/noteService';
import NoteList from "@/components/notes/NoteList";

export default function NoteContainer() {
  const router = useRouter();
  const { id } = router.query; // URL의 ID 가져옴
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const loadNotes = async () => {
      const notesData = await getNotes();
      setNotes(notesData);
    };
    loadNotes();
  }, []);

  useEffect(() => {
    if (id) {
      const note = notes.find((note) => note._id);
      setSelectedNote(note || null);
    } else {
      setSelectedNote(null);
    }
  }, [id, notes]);

  return (
      <div className="flex">
        <NoteList notes={notes} selectedNote={selectedNote} />
        <NoteDisplay note={selectedNote} />
      </div>
  );
}