import { atom } from 'jotai';
import {
  noteListAtom,
  noteEventAtom,
  selectedNoteAtom
} from '@/atoms/noteStateAtom';
import { createNote, getNotes, updateNote, deleteNote } from '@/services/notes/noteService';
import debounce from "lodash/debounce";
import {SynchronizeWithServer} from "@/services/user/syncService";
import {router} from "next/client";


const debouncedSynchronize = debounce(async () => {
  const currentTime = Date.now(); // 활동 시각 전달
  await SynchronizeWithServer(currentTime);
}, 60 * 3000);

// 리스트 초기화
export const initializeNotesAtom = atom(null, async (get, set) => {
  const notes = await getNotes();
  set(noteListAtom, notes);
});

// 이벤트 핸들러
export const noteEventHandlerAtom = atom((get) => get(noteEventAtom),
    async (get, set, event) => {
      const { type, targetId, payload } = event;
      const noteList = get(noteListAtom);

      switch (type) {
        case 'ADD':
          const newNote = await createNote(payload);
          set(noteListAtom, [...noteList, newNote]);
          set(selectedNoteAtom, newNote._id);
          await router.push(`/notes?id=${newNote._id}`, undefined,
              {shallow: true});
          break;

        case 'UPDATE':
          const updatedNote = await updateNote(targetId, payload);
          set(noteListAtom, noteList.map(note => note._id === targetId ? updatedNote : note));
          break;

        case 'DELETE':
          await deleteNote(targetId);
          set(noteListAtom, noteList.filter(note => note._id !== targetId));
          break;
      }
      debouncedSynchronize();
    }
);