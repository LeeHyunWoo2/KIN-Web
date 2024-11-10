import React from 'react';
import { useRouter } from 'next/router';
import NoteItem from './NoteItem';

export default function NoteList({ notes }) {
  const router = useRouter();

  const handleNoteClick = (id) => {
    router.push(`/notes?id=${id}`, undefined, { shallow: true });
  };

  return (
      <div className="w-1/3 p-4 border-r">
        <div className="flex flex-col gap-2">
          {notes.map((note) => (
              <NoteItem
                  key={note._id}
                  note={note}
                  onClick={() => handleNoteClick(note._id)}
                  isActive={router.query.id === note._id}
              />
          ))}
        </div>
      </div>
  );
}