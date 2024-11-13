import { atom } from 'jotai';

// 제목, 내용 변경사항
export const noteTitleAtom = atom('');
export const noteContentAtom = atom('');

// 이외 변경사항
export const saveNoteChangesAtom = atom(
    null, // 읽기 값은 없으므로 null
    (get, set, { noteId, updatedFields }) => {
      set(noteEventAtom, {
        type: 'UPDATE',
        targetId: noteId,
        payload: updatedFields,
      });
    }
);

// 노트 리스트 상태 관리
export const noteListAtom = atom([]);

// 선택된 노트 ID
export const selectedNoteAtom = atom(null);

// 노트 이벤트 전송
export const noteEventAtom = atom(null);  // 이벤트 객체를 담음