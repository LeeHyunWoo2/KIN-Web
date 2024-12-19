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

  return (
      <DndProvider backend={HTML5Backend}>
        <Plate
            editor={editor}
            // @ts-ignore
            value={value}
            onChange={(newValue) => {
              console.log('onChange triggered:', newValue);
              if (onChange) {
                onChange(newValue); // 부모 컴포넌트로 변경된 데이터를 전달
              } // 이거 지금 newValue 보면 editor 하고 value 두가지가 있어서 이중 value만 따로 보내도록 수정해야함
            }}
        >
          <EditorContainer className="border rounded-md">
            <Editor variant="fullWidth" />
          </EditorContainer>
        </Plate>
      </DndProvider>
  );
}