import { atom } from 'jotai';
import {  noteListAtom, selectedNoteAtom, newNoteSignalAtom, noteEventAtom } from '@/atoms/noteStateAtom';
import { createNote, getNotes, updateNote, moveToTrash, deleteNotePermanently } from '@/services/notes/noteService';
import debounce from "lodash/debounce";
import {SynchronizeWithServer} from "@/services/user/syncService";


const debouncedSynchronize = debounce(async () => {
  const currentTime = Date.now(); // 활동 시각 전달
  await SynchronizeWithServer(currentTime);
}, 60 * 3000);

// 리스트 초기화
export const initializeNotesAtom = atom(null, async (get, set) => {
  const notes = await getNotes();
  set(noteListAtom, notes);
});

// 노트 생성
export const createNewNoteAtom = atom(null, async (get, set) => {
  const newNote = await createNote({ title: '', content: '', category: '', tags: [] });
  set(noteListAtom, [...get(noteListAtom), newNote]);
  set(selectedNoteAtom, newNote._id);
  set(newNoteSignalAtom, false);
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
          break;

        case 'DELETE':
          await moveToTrash(targetId);
          set(noteListAtom, noteList.filter(note => note._id !== targetId));
          break;

        case 'UPDATE':
          const updatedNote = await updateNote(targetId, payload);
          set(noteListAtom, noteList.map(note => note._id === targetId ? updatedNote : note));
          break;

        case 'PERMANENT_DELETE':
          await deleteNotePermanently(targetId);
          set(noteListAtom, noteList.filter(note => note._id !== targetId));
          break;
      }
      debouncedSynchronize();
      /*set(selectedNoteAtom, targetId);*/
    }
);