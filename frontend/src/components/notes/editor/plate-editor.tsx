import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Plate } from '@udecode/plate-common/react';

import { useCreateEditor } from '@/components/notes/editor/use-create-editor';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
import { useAtomValue, useSetAtom } from "jotai";
import { selectedNoteStateAtom, selectedNoteUploadFilesAtom } from "@/atoms/noteStateAtom";
import {useEffect, useRef } from 'react';
import { isEqual } from 'lodash'; // Lodash의 isEqual 함수 사용

type PlateEditorProps = {
  onChange: (newValue: any) => void; // 부모 컴포넌트로 변경된 데이터를 전달
};

export default function PlateEditor({ onChange }: PlateEditorProps) {
  const selectedNoteState = useAtomValue(selectedNoteStateAtom);
  const setUploadedFiles = useSetAtom(selectedNoteUploadFilesAtom);

  // 현재 노트의 content를 value로 설정
  const value = selectedNoteState.content;

  // 에디터 인스턴스 생성
  const editor = useCreateEditor(value);

  const lastValue = useRef(value);
  const lastId = useRef(selectedNoteState._id);

  const handleEditorChange = (newValue: any) => {
    const operations = editor.operations;

    // 파일 관련 동작이 있는 경우에만 파일 노드 재스캔
    const fileOperationsExist = operations.some(
        (operation) =>
            operation.type === "insert_node" || operation.type === "remove_node"
    );

    if (fileOperationsExist) {
      scanNodesForFiles(newValue.editor.children); // 파일 노드 갱신
    }

    // 기본 에디터 변경 사항은 그대로 처리
    const currentValue = newValue.editor.children;
    if (!isEqual(lastValue.current, currentValue) && lastId.current === selectedNoteState._id) {
      lastValue.current = currentValue; // 상태 업데이트
      if (onChange) {
        onChange(currentValue); // 변경된 값만 전달
      }
    }
  };

  const scanNodesForFiles = (nodes: any[]) => {
    const foundFiles: string[] = [];

    const scan = (nodeList: any[]) => {
      nodeList.forEach((node) => {
        if (node.isUpload && node.url) {
          const fileUrl = node.url as string;
          foundFiles.push(fileUrl); // 파일 노드 추가
        }
        if (Array.isArray(node.children)) {
          scan(node.children); // 재귀적으로 자식 노드 탐색
        }
      });
    };

    scan(nodes);

    // 업로드된 파일 상태 갱신 (중복 제거)
    // @ts-ignore
    setUploadedFiles(Array.from(new Set(foundFiles)));
  };

  useEffect(() => {
    editor.tf.reset();
    editor.tf.setValue(value); // 노트의 _id 가 변경되면 value 재배치
    scanNodesForFiles(editor.children);
    lastId.current = selectedNoteState._id;
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