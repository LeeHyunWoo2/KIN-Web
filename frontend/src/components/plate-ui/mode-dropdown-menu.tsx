'use client';

import React from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import {
  focusEditor,
  useEditorReadOnly,
  useEditorRef,
  usePlateStore,
} from '@udecode/plate-common/react';
import { Eye, Pen } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  useOpenState,
} from './dropdown-menu';
import { ToolbarButton } from './toolbar';

export function ModeDropdownMenu(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const setReadOnly = usePlateStore().set.readOnly();
  const readOnly = useEditorReadOnly();
  const openState = useOpenState();

  let value = 'editing';

  if (readOnly) value = 'viewing';

  const item: any = {
    editing: (
      <>
        <Pen />
      </>
    ),
    viewing: (
      <>
        <Eye />
      </>
    ),
  };

  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          pressed={openState.open}
          tooltip="모드 선택"
          isDropdown
        >
          {item[value]}
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-[125px]" align="start">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(newValue) => {
            if (newValue !== 'viewing') {
              setReadOnly(false);
            }
            if (newValue === 'viewing') {
              setReadOnly(true);

              return;
            }
            if (newValue === 'editing') {
              focusEditor(editor);

              return;
            }
          }}
        >
          <DropdownMenuRadioItem value="editing">
            {item.editing}
            편집모드
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="viewing">
            {item.viewing}
            읽기모드
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
