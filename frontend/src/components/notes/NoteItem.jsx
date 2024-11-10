import React from 'react';
import { cn } from '@/lib/utils';

export default function NoteItem({ note, onClick, isActive }) {
  return (
      <button
          onClick={onClick}
          className={cn(
              "p-3 rounded-lg transition-all text-left",
              isActive ? "bg-accent" : "hover:bg-muted"
          )}
      >
        <div className="font-semibold">{note.title || '제목 없음'}</div>
        <div className="text-xs text-muted-foreground line-clamp-2">
          {note.content || '내용 없음'}
        </div>
      </button>
  );
}