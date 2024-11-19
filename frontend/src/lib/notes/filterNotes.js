// 각종 필터, 정렬
import { atom } from 'jotai';
import { noteListAtom } from '@/atoms/noteStateAtom';
import { selectedCategoryAtom, selectedTagsAtom, searchTermAtom, sortByAtom } from '@/atoms/filterAtoms';
import {getChildCategoryIds} from "@/lib/notes/categoryUtils";

// 필터링 로직
export function filterNotes(notes, { category, categories, tags, searchTerm, sortBy }) {
  let filteredNotes = notes;

  // 카테고리 필터링
  if (category) {
    const descendantIds = getChildCategoryIds(category, categories);
    filteredNotes = filteredNotes.filter(note => descendantIds.includes(note.category._id));
  }
  // 태그
  if (tags) {
    filteredNotes = filteredNotes.filter(note =>
        tags.every(tag => note.tags.includes(tag))
    );
  }
  // 검색어
  if (searchTerm) {
    filteredNotes = filteredNotes.filter(note =>
        note.title.includes(searchTerm)
    );
  }
  // 정렬
  if (sortBy === 'date') {
    filteredNotes.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  } else if (sortBy === 'title') {
    filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
  }
  return filteredNotes;
}


// 필터링된 노트 전역 상태
export const filteredNotesAtom = atom((get) => {
  const notes = get(noteListAtom);
  const category = get(selectedCategoryAtom);
  const tags = get(selectedTagsAtom);
  const searchTerm = get(searchTermAtom);
  const sortBy = get(sortByAtom);

  // 필터링 적용
  return filterNotes(notes, { category, tags, searchTerm, sortBy });
});
