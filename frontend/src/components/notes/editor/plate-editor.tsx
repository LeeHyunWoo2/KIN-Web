'use client';

import { Plate } from '@udecode/plate-common/react';

import { useCreateEditor } from '@/components/notes/editor/use-create-editor';
import { Editor, EditorContainer } from '@/components/notes/plate-ui/editor';

export function PlateEditor() {
  const editor = useCreateEditor();

  return (
    <Plate editor={editor}>
      <EditorContainer className="border rounded-md">
        <Editor variant="fullWidth" placeholder="새 페이지" />
      </EditorContainer>
    </Plate>
  );
}