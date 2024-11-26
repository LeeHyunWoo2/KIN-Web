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
import {categoryListAtom, tagListAtom} from "@/atoms/filterAtoms";
import {getCategories} from "@/services/notes/categoryService";
import {getTags} from "@/services/notes/tagService";


const debouncedSynchronize = debounce(async () => {
  const currentTime = Date.now(); // 활동 시각 전달
  await SynchronizeWithServer(currentTime);
}, 2000);

// 리스트 초기화
export const initializeNotesAtom = atom(null, async (get, set) => {
  const notes = await getNotes();
  set(noteListAtom, notes);
});

// 카테고리 초기화
export const initializeCategoriesAtom = atom(null, async (get, set) => {
  const categories = await getCategories();
  set(categoryListAtom, categories); // 배열로 상태 저장
});

// 태그 초기화
export const initializeTagsAtom = atom(null, async (get, set) => {
  const tags = await getTags();
  set(tagListAtom, tags); // 배열
})

// 이벤트 핸들러
export const noteEventHandlerAtom = atom((get) => get(noteEventAtom),
    async (get, set, event) => {
      const { type, payload } = event;
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
          const updatedNotes = await updateNote(payload); // 배열로 전달
          set(noteListAtom, noteList.map(note =>
              updatedNotes.find(updated => updated._id === note._id) || note
          ));
          break;

        case 'DELETE':
          await deleteNote(payload);
          set(noteListAtom, noteList.filter(note => !payload.includes(note._id)));
          break;
      }
      debouncedSynchronize();
    }
);