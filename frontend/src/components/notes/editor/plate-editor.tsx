'use client';

import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

import {Plate} from '@udecode/plate-common/react';

import {useCreateEditor} from '@/components/notes/editor/editor-plugins';
import {Editor, EditorContainer} from '@/components/plate-ui/editor';

export default function PlateEditor() {
  const editor = useCreateEditor();

  return (
      <DndProvider backend={HTML5Backend}>
        <Plate editor={editor}>
          <EditorContainer className="border rounded-md">
            <Editor variant="fullWidth"/>
          </EditorContainer>
        </Plate>
      </DndProvider>
  );
}