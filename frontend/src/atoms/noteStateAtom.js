import { atom } from 'jotai';

// 제목 내용 제외하고 디바운스 없이 바로바로 변경할 필드용 함수
export const saveNoteChangesAtom = atom(
    null, // 읽기 값은 없으므로 null
    (get, set, { updatedFieldsList }) => {
      set(noteEventAtom, {
        type: 'UPDATE',
        payload: updatedFieldsList,
      });
    }
);

export const defaultNoteStateAtom ={
  _id: null,                 // 노트 ID
  title: '',                   // 노트 제목
  content: '',              // 노트 내용
  mode: '', // "editor", "text" 두가지 모드가 있음.
  category: {               // 카테고리 정보
    _id: null,
    name: null
  },
  tags: [],                 // 태그 배열
  created_at: new Date(),   // 작성시각
  updated_at: new Date(),   // 수정 시각
  is_locked: false,         // 잠금 여부
  is_pinned: false,         // 상단 고정 여부
  is_trashed: false,        // 휴지통 여부
  trashedAt: null,           // 휴지통에 들어간 시각
  uploadedFiles:[]         // 해당 노트에 업로드된 파일 url
}

export const selectedNoteUploadFilesAtom = atom([]);

// 통합된 노트 상태
export const selectedNoteStateAtom = atom(defaultNoteStateAtom);

// 노트 갯수 상태
export const noteCountAtom = atom({ active: 0, trashed: 0 });

// 노트 리스트 상태 관리 (업데이트, add 등등 event 발생 시 호출됨)
export const noteListAtom = atom([]);

// 선택된 노트 ID
export const selectedNoteAtom = atom(null);

// 노트 이벤트 전송
export const noteEventAtom = atom(null);  // 이벤트 객체를 담음