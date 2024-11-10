import React, {useState, useEffect, useCallback} from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createNote, updateNote } from '@/services/notes/noteService';
import { useAtom } from 'jotai';
import { newNoteAtom } from '@/atoms/newNoteAtom';
import { useRouter } from 'next/router';
import debounce from 'lodash/debounce';


export default function NoteDisplay({ note }) {
  const router = useRouter();
  const [newNote, setNewNote] = useAtom(newNoteAtom); // 새 노트 신호 감지

  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [category, setCategory] = useState(note?.category || ''); // 기본 카테고리 값
  const [tags, setTags] = useState(note?.tags || []); // 기본 태그 값

  // 변경 사항 저장 함수 (디바운스로 설정)
  const saveChanges = async () => {
    if (note) {
      await updateNote(note._id, { title, content, category, tags });
    }
  };

  //  자동 저장 함수 (3초 디바운스)
  const debouncedSave = useCallback(debounce(saveChanges, 2000), [title, content, category, tags, note]);

  // 변경될 때마다 저장 함수 호출
  useEffect(() => {
    debouncedSave();
    // 나갈경우 호출 취소
    return () => debouncedSave.cancel();
  }, [title, content, debouncedSave]);

  // 포커스를 벗어나면 즉시 저장
  const handleBlur = () => {
    debouncedSave();
  };


  // 새 노트 작성 신호가 들어오면 빈 노트를 생성
  useEffect(() => {
    const createNewNote = async () => {
      if (newNote) {
        const newNoteResponse = await createNote({
          title: '',
          content: '',
          category: '',
          tags: []
        });
        setTitle(newNoteResponse.title);
        setContent(newNoteResponse.content);
        setCategory(newNoteResponse.category);
        setTags(newNoteResponse.tags);

        router.push(`/notes?id=${newNoteResponse._id}`);
        setNewNote(false); // 신호 초기화
      } else if (note) {
        setTitle(note.title);
        setContent(note.content);
        setCategory(note.category);
        setTags(note.tags);
      }
    };
    createNewNote();
  }, [newNote, note, router, setNewNote]);


  // 기본적으로 노트가 없고 새 노트 신호도 없으면 안내 문구 표시
  if (!note && !newNote) {
    return <div className="p-8 text-center text-muted-foreground">선택된 노트가 없습니다.</div>;
  }


  return (
      <div className="flex flex-col h-full p-4">
        <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)} // 뭔가 바뀌면 호출
            onBlur={handleBlur} // 포커스 벗어날 때 즉시 저장
            className="mb-4 text-xl font-semibold"
        />
        <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleBlur}
            className="flex-1"
        />
        {/*추후 카테고리와 태그 설정 추가할것*/}
      </div>
  );
}