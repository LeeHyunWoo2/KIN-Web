import { atom } from 'jotai';

// 필터 조건들
export const categoryListAtom = atom([]); // 카테고리 구조를 따로 관리(빠른필터링용)
export const categoryTreeAtom = atom([]);
export const selectedCategoryAtom = atom(null); // 선택된 카테고리 (기본값 없음)
export const selectedTagsAtom = atom([]); // 선택된 태그들
export const searchTermAtom = atom(''); // 검색어
export const sortByAtom = atom('date'); // 정렬 기준 (기본값: 날짜)