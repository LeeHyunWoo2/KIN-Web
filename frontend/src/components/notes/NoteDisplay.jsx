import React, {useState, useEffect, useCallback} from 'react';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {useAtom} from 'jotai';
import {
  noteTitleAtom,
  noteContentAtom,
  noteCategoryAtom,
  noteTagsAtom,
  newNoteSignalAtom,
  noteEventAtom
} from '@/atoms/noteStateAtom';
import {useRouter} from 'next/router';
import debounce from 'lodash/debounce';

export default function NoteDisplay({note}) {
  const router = useRouter();
  const [newNoteSignal, setNewNoteSignal] = useAtom(newNoteSignalAtom); // 새 노트 신호 감지
  const [, setNoteEvent] = useAtom(noteEventAtom); // 이벤트 전송용 아톰

  const [title, setTitle] = useAtom(noteTitleAtom);
  const [content, setContent] = useAtom(noteContentAtom);
  const [category, setCategory] = useAtom(noteCategoryAtom);
  const [tags, setTags] = useAtom(noteTagsAtom);

  // 노트의 초기 로딩 여부 확인
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // 선택된 노트가 변경될 때 필드 값도 업데이트
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category);
      setTags(note.tags);
      setIsInitialLoad(true); // 처음 로딩 시에는 true
    }
  }, [note, setTitle, setContent, setCategory, setTags]);

  //  자동 저장 함수 (디바운스 1초)
  const saveChanges = useCallback(debounce(() => {
    if (note && !isInitialLoad) {  // 초기 로딩이 아닐 때만 저장
      setNoteEvent({
        type: 'UPDATE', // UPDATE 이벤트 발생
        targetId: note._id,
        payload: {title, content},
      });
    }
  }, 1000), [title, content, setNoteEvent, isInitialLoad]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setIsInitialLoad(false);  // 변경사항이 발생하면 false
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setIsInitialLoad(false);
  };

  useEffect(() => {
    saveChanges();
    return () => saveChanges.cancel();
  }, [title, content, saveChanges]);

  // 새 노트 생성 신호를 받으면 빈 노트를 생성
  useEffect(() => {
    if (newNoteSignal) {
      setNoteEvent({
        type: 'ADD', // ADD 이벤트 발생
        payload: {title: '', content: ''},
      });
      router.push(`/notes?id=${note._id}`);
      setNewNoteSignal(false); // 신호 초기화
    } else if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category);
      setTags(note.tags);
    }
  }, [newNoteSignal, setNoteEvent, setNewNoteSignal]);

  // 기본적으로 노트가 없고 새 노트 신호도 없으면 안내 문구 표시
  if (!note && !newNoteSignal) {
    return <div className="p-8 text-center text-muted-foreground">선택된 노트가
      없습니다.</div>;
  }

  return (
      <div className="flex flex-col h-full p-4">
        <Input
            value={title}
            onChange={handleTitleChange} // 뭔가 바뀌면 호출
            className="mb-4 text-xl font-semibold"
        />
        <Textarea
            value={content}
            onChange={handleContentChange}
            className="flex-1"
        />
        {/*추후 카테고리와 태그 설정 추가할것*/}
      </div>
  );
}