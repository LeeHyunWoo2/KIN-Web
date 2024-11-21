import { atom } from 'jotai';
import { noteListAtom } from '@/atoms/noteStateAtom';
import {
  selectedCategoryAtom,
  selectedTagsAtom,
  searchTermAtom,
  sortByAtom,
  isLockedAtom,
  isPinnedAtom,
  isTrashedAtom,
  categoryListAtom, selectedCategoryNameAtom
} from '@/atoms/filterAtoms';
import { getChildCategoryIds } from '@/lib/notes/categoryUtils';


// 필터링 로직
export function filterNotes(notes, { category, categories, tags, searchTerm, sortBy, isLocked, isPinned, isTrashed }) {

  let filteredNotes = notes;

  if (isTrashed) {
    // 휴지통 모드에서는 다른 필터를 무시하도록 최우선으로 지정. (휴지통까지 가서 카테고리 검색을 하는게 말이 안되니까)
    return filteredNotes.filter(note => note.is_trashed);
  }

  // TODO: 이상하게 else 하면 작동안함 나중에 분석해보기
  filteredNotes = filteredNotes.filter(note => note.is_trashed === false);

  // 카테고리 필터링
  if (category) {
    const descendantIds = getChildCategoryIds(category, categories);
    filteredNotes = filteredNotes.filter(note => descendantIds.includes(note.category._id));
  }

  // 태그 필터링
  if (tags?.length > 0) {
    filteredNotes = filteredNotes.filter(note =>
        tags.every(tag => note.tags.includes(tag))
    );
  }

  // 검색어 필터링
  if (searchTerm) {
    filteredNotes = filteredNotes.filter(note =>
        note.title.includes(searchTerm)
    );
  }

  // 잠금 상태 필터링
  if (typeof isLocked === 'boolean') {
    filteredNotes = filteredNotes.filter(note => note.is_locked === isLocked);
  }

  // 상단 고정 필터링
  if (typeof isPinned === 'boolean') {
    filteredNotes = filteredNotes.filter(note => note.is_pinned === isPinned);
  }

  // 정렬
  if (sortBy === 'date') {
    filteredNotes.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  } else if (sortBy === 'title') {
    filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
  }

  return filteredNotes;
}

// 필터링된 노트 상태 관리
export const filteredNotesAtom = atom((get) => {
  const notes = get(noteListAtom);
  const category = get(selectedCategoryAtom);
  const categories = get(categoryListAtom); // 필터에 참고할 카테고리목록
  const tags = get(selectedTagsAtom);
  const searchTerm = get(searchTermAtom);
  const sortBy = get(sortByAtom);
  const isLocked = get(isLockedAtom); // 잠금 상태
  const isPinned = get(isPinnedAtom); // 고정 상태
  const isTrashed = get(isTrashedAtom); // 휴지통 상태

  return filterNotes(notes, { category, categories, tags, searchTerm, sortBy, isLocked, isPinned, isTrashed });
});


// 필터 초기화
export const resetFiltersAtom = atom(null, (get, set) => {
  set(selectedCategoryAtom, null); // 리스트는 하위 카테고리 참조용이라서 초기화하면 안됨
  set(selectedCategoryNameAtom, null);
  set(selectedTagsAtom, []);
  set(searchTermAtom, '');
  set(sortByAtom, 'date');
  set(isLockedAtom, false);
  set(isPinnedAtom, false);
  set(isTrashedAtom, false);
});
