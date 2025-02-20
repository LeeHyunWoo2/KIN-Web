import { atom } from 'jotai';
import { noteListAtom } from '@/atoms/noteStateAtom';
import {
  selectedCategoryAtom,
  selectedTagsAtom,
  searchTermAtom,
  sortByAtom,
  isLockedAtom,
  isTrashedAtom,
  categoryListAtom, selectedCategoryNameAtom, filterModeAtom
} from '@/atoms/filterAtoms';
import { getChildCategoryIds } from '@/lib/notes/categoryUtils';


// 필터링 로직
export function filterNotes(notes, { category, categories, tags, searchTerm, sortBy, isLocked, isPinned, isTrashed, filterMode }) {

  let filteredNotes = notes;

  if (isTrashed) {
    // 휴지통 모드에서는 다른 필터를 무시하도록 최우선으로 지정. (휴지통까지 가서 카테고리 검색을 하는게 말이 안되니까)
    return filteredNotes.filter(note => note.is_trashed);
  }

  // TODO: 이상하게 위의 if 아래를 else로 둘러싸면 작동안함 나중에 분석해보기
  filteredNotes = filteredNotes.filter(note => note.is_trashed === false);

  // 카테고리 필터링
  if (category) {
    const descendantIds = getChildCategoryIds(category, categories);
    filteredNotes = filteredNotes.filter(note => descendantIds.includes(note.category._id));
  }

  // 태그 필터링
  if (tags?.length > 0) {
    if (filterMode) {
      // AND 모드
      filteredNotes = filteredNotes.filter((note) =>
          tags.every((tag) => note.tags.some((noteTag) => noteTag._id === tag._id))
      );
    } else {
      // OR 모드
      filteredNotes = filteredNotes.filter((note) =>
          tags.some((tag) => note.tags.some((noteTag) => noteTag._id === tag._id))
      );
    }
  }

  // 검색어 필터링
  if (searchTerm) {
    filteredNotes = filteredNotes.filter(note => note.title.toLowerCase().includes(searchTerm.toLowerCase())
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
  if (sortBy === 'created_date') { // updated_date 도 만들것
    filteredNotes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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
  const isTrashed = get(isTrashedAtom); // 휴지통 상태
  const filterMode = get(filterModeAtom); // AND/OR 모드 가져오기

  return filterNotes(notes, { category, categories, tags, searchTerm, sortBy, isLocked, isTrashed, filterMode });
});


// 필터 초기화
export const resetFiltersAtom = atom(null, (get, set) => {
  set(selectedCategoryAtom, null); // 리스트는 하위 카테고리 참조용이라서 초기화하면 안됨
  set(selectedCategoryNameAtom, null);
  set(selectedTagsAtom, []);
  set(searchTermAtom, '');
  set(sortByAtom, 'created_date');
  set(isLockedAtom, false);
  set(isTrashedAtom, false);
});
