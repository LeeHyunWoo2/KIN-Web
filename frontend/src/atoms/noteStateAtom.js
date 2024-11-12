import { atom } from 'jotai';

// 노트 편집 상태 (제목, 내용, 카테고리, 태그)
export const noteTitleAtom = atom('');
export const noteContentAtom = atom('');
export const noteCategoryAtom = atom('');
export const noteTagsAtom = atom([]);

// 노트 리스트 상태 관리
export const noteListAtom = atom([]);

// 선택된 노트 ID
export const selectedNoteAtom = atom(null);

// 새 노트 작성 신호
export const newNoteSignalAtom = atom(false);

// 노트 이벤트 전송
export const noteEventAtom = atom(null);  // 이벤트 객체를 담음