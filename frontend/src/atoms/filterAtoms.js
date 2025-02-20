import { atom } from 'jotai';

// 필터 조건들
export const categoryListAtom = atom([]); // 일반 배열 카테고리 리스트
export const categoryTreeAtom = atom([]); // 카테고리 트리구조 상태
export const selectedCategoryAtom = atom(null); // 선택된 카테고리 (기본값 없음)
export const selectedCategoryNameAtom = atom(null); // 선택된 카테고리 이름 (구조 바꾸기 곤란해져서 그냥 따로 추가)
export const tagListAtom = atom([]); // 전체 태그
export const selectedTagsAtom = atom([]); // 선택된 태그들
export const searchTermAtom = atom(''); // 검색어
export const sortByAtom = atom('created_date'); // 정렬 기준 (기본값: 작성일)
export const isLockedAtom = atom(false); // 잠금 상태 필터
export const isTrashedAtom = atom(false); // 휴지통 상태

// AND/OR 필터 모드 상태
export const filterModeAtom = atom(true); // true = AND, false = OR