'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Plate } from '@udecode/plate-common/react';

import { useCreateEditor } from '@/components/notes/editor/use-create-editor';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
import { useEffect } from 'react';
import {useAtom} from "jotai";
import {selectedNoteStateAtom} from "@/atoms/noteStateAtom";

export default function PlateEditor({onChange}) {
  // 외부에서 관리할 state로 value 정의
  const [selectedNoteState, setSelectedNoteState] = useAtom(selectedNoteStateAtom);

  const value = selectedNoteState.content;
  const editor = useCreateEditor(value); // value를 주입

  useEffect(() => {
    if (onChange){
      onChange(editor.children); // 변경사항을 부모객체로 전달
    }
  }, [editor.children, onChange]);

  return (
      <DndProvider backend={HTML5Backend}>
        <Plate
            editor={editor}
            // @ts-ignore
            value={value} // Plate에 value 설정
            onChange={(newValue) => {onChange && onChange(newValue);
            }}
        >
          <EditorContainer className="border rounded-md">
            <Editor variant="fullWidth" />
          </EditorContainer>
        </Plate>
      </DndProvider>
  );
}