import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import {
  isTrashedAtom,
  isPinnedAtom,
  isLockedAtom,
  searchTermAtom,
  sortByAtom,
  selectedCategoryAtom,
  selectedTagsAtom, selectedCategoryNameAtom,
} from '@/atoms/filterAtoms';


function FilterMonitor() {
  // 필터 상태 구독
  const isTrashed = useAtomValue(isTrashedAtom);
  const isPinned = useAtomValue(isPinnedAtom);
  const isLocked = useAtomValue(isLockedAtom);
  const searchTerm = useAtomValue(searchTermAtom);
  const sortBy = useAtomValue(sortByAtom);
  const category = useAtomValue(selectedCategoryAtom);
  const categoryName = useAtomValue(selectedCategoryNameAtom);
  const tags = useAtomValue(selectedTagsAtom);

  // 상태 변경 감지 로그
  useEffect(() => {
    console.log('필터 상태 : ', {
      isTrashed,
      isPinned,
      isLocked,
      searchTerm,
      sortBy,
      category,
      categoryName,
      tags,
    });
  }, [isTrashed, isPinned, isLocked, searchTerm, sortBy, category, categoryName, tags]);

  return null; // 화면에 표시할 필요 없음
}

export default FilterMonitor;