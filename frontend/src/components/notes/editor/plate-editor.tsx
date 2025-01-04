import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Plate } from '@udecode/plate-common/react';

import { useCreateEditor } from '@/components/notes/editor/use-create-editor';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
import { useAtomValue } from "jotai";
import { selectedNoteStateAtom } from "@/atoms/noteStateAtom";
import {useEffect, useRef } from 'react';
import { isEqual } from 'lodash'; // Lodash의 isEqual 함수 사용

type PlateEditorProps = {
  onChange: (newValue: any) => void; // 부모 컴포넌트로 변경된 데이터를 전달
};

export default function PlateEditor({ onChange }: PlateEditorProps) {
  const selectedNoteState = useAtomValue(selectedNoteStateAtom);

  // 현재 노트의 content를 value로 설정
  const value = selectedNoteState.content;

  // 에디터 인스턴스 생성
  const editor = useCreateEditor(value);

  const lastValue = useRef(value);
  const laseId = useRef(selectedNoteState._id);

  const handleEditorChange = (newValue: any) => {
    const currentValue = newValue.editor.children;

    // 값이 변경되었고 노트id가 같을 때만 onChange 호출 (노트를 선택하는것만으로 다르다고 판단해 저장이 발생하기 때문)
    if (!isEqual(lastValue.current, currentValue) && laseId.current === selectedNoteState._id) {
      lastValue.current = currentValue; // 상태 업데이트
      if (onChange) {
        onChange(currentValue); // 변경된 값만 전달
      }
    }
  };

  useEffect(() => {
    editor.tf.reset();
    editor.tf.setValue(value); // 노트의 _id 가 변경되면 value 재배치
    laseId.current = selectedNoteState._id;
  },[selectedNoteState._id])


  return (
      <DndProvider backend={HTML5Backend}>
        <Plate
            editor={editor}
            // 현재 노트의 content 값을 에디터로 전달
            // @ts-ignore
            value={value}
            onValueChange={handleEditorChange}
            maxLength={20000}
        >
          <EditorContainer className="border rounded-md">
            <Editor variant="fullWidth" />
          </EditorContainer>
        </Plate>
      </DndProvider>
  );
}