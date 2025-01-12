import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Plate } from '@udecode/plate-common/react';

import { useCreateEditor } from '@/components/notes/editor/use-create-editor';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
import {useAtom, useAtomValue } from "jotai";
import { selectedNoteStateAtom, selectedNoteUploadFilesAtom } from "@/atoms/noteStateAtom";
import {useEffect, useRef } from 'react';
import { isEqual } from 'lodash'; // Lodash의 isEqual 함수 사용

type PlateEditorProps = {
  onChange: (newValue: any) => void; // 부모 컴포넌트로 변경된 데이터를 전달
};

export default function PlateEditor({ onChange }: PlateEditorProps) {
  const selectedNoteState = useAtomValue(selectedNoteStateAtom);
  const [uploadedFiles, setUploadedFiles] = useAtom(selectedNoteUploadFilesAtom);

  // 현재 노트의 content를 value로 설정
  const value = selectedNoteState.content;

  // 에디터 인스턴스 생성
  const editor = useCreateEditor(value);

  const lastValue = useRef(value);
  const lastId = useRef(selectedNoteState._id);

  const handleEditorChange = (newValue: any) => {
    const currentValue = newValue.editor.children;

    // 업로드된 파일 목록을 최신 상태로 유지
    const addedFiles: string[] = [];
    const removedFiles: string[] = [];

    // 모든 에디터 동작을 순회하며 추가/삭제 이벤트만 필터링
    editor.operations.forEach((operation) => {
      if (operation.node && (operation.node as any).isUpload === true) {
        // @ts-ignore
        const fileUrl = operation.node.url as string;

        // @ts-ignore
        if (operation.type === "insert_node" && !uploadedFiles.includes(fileUrl)) {
          addedFiles.push(fileUrl); // 추가된 파일 수집
        }

        // @ts-ignore
        if (operation.type === "remove_node" && uploadedFiles.includes(fileUrl)) {
          removedFiles.push(fileUrl); // 삭제된 파일 수집
        }
      }
    });

    // 최종적으로 파일 상태를 업데이트 (최신 상태 기준)
    if (addedFiles.length > 0 || removedFiles.length > 0) {
      console.log("Added Files:", addedFiles);
      console.log("Removed Files:", removedFiles);
      // @ts-ignore
      setUploadedFiles((prev: any) => {
        // 최종 업데이트된 파일 리스트 계산
        const newFiles = [...prev, ...addedFiles].filter(
            (file) => !removedFiles.includes(file) // 삭제된 파일 제거
        );

        // 중복 제거 (명시적으로 처리)
        return Array.from(new Set(newFiles));
      });
    }


    // 값이 변경되었고 노트id가 같을 때만 onChange 호출 (노트를 선택하는것만으로 다르다고 판단해 저장이 발생하기 때문)
    if (!isEqual(lastValue.current, currentValue) && lastId.current === selectedNoteState._id) {
      lastValue.current = currentValue; // 상태 업데이트
      if (onChange) {
        onChange(currentValue); // 변경된 값만 전달
      }
    }
  };

  useEffect(() => {
    editor.tf.reset();
    editor.tf.setValue(value); // 노트의 _id 가 변경되면 value 재배치
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