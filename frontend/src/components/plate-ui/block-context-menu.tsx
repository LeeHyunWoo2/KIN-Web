'use client';

import React, { useCallback, useState } from 'react';

import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { unsetNodes } from '@udecode/plate-common';
import {
  ParagraphPlugin,
  focusEditor,
  useEditorPlugin,
} from '@udecode/plate-common/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { IndentListPlugin } from '@udecode/plate-indent-list/react';
import {
  BLOCK_CONTEXT_MENU_ID,
  BlockMenuPlugin,
  BlockSelectionPlugin,
} from '@udecode/plate-selection/react';
import {
  Trash2,
  Files,
  RefreshCw,
  IndentIncrease,
  IndentDecrease,
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  PilcrowIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  QuoteIcon,
} from 'lucide-react';

import { useIsTouchDevice } from '@/hooks/use-is-touch-device';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from './context-menu';

type Value = null;

export function BlockContextMenu({ children }: { children: React.ReactNode }) {
  const { api, editor } = useEditorPlugin(BlockMenuPlugin);
  const [value, setValue] = useState<Value>(null);
  const isTouch = useIsTouchDevice();

  const handleTurnInto = useCallback(
      (type: string) => {
        editor
        .getApi(BlockSelectionPlugin)
        .blockSelection.getNodes()
        .forEach(([node, path]) => {
          if (node[IndentListPlugin.key]) {
            unsetNodes(editor, [IndentListPlugin.key, 'indent'], { at: path });
          }

          editor.tf.toggle.block({ type }, { at: path });
        });
      },
      [editor]
  );

  const handleAlign = useCallback(
      (align: 'center' | 'left' | 'right' | 'justify') => {
        editor
        .getTransforms(BlockSelectionPlugin)
        .blockSelection.setNodes({ align });
      },
      [editor]
  );

  if (isTouch) {
    return children;
  }

  return (
      <ContextMenu
          onOpenChange={(open) => {
            if (!open) {
              // prevent unselect the block selection
              setTimeout(() => {
                api.blockMenu.hide();
              }, 0);
            }
          }}
          modal={false}
      >
        <ContextMenuTrigger
            asChild
            onContextMenu={(event) => {
              const dataset = (event.target as HTMLElement).dataset;

              const disabled = dataset?.slateEditor === 'true';

              if (disabled) return event.preventDefault();

              api.blockMenu.show(BLOCK_CONTEXT_MENU_ID, {
                x: event.clientX,
                y: event.clientY,
              });
            }}
        >
          <div className="w-full">{children}</div>
        </ContextMenuTrigger>
        <ContextMenuContent
            className="w-64"
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              editor.getApi(BlockSelectionPlugin).blockSelection.focus();

              setValue(null);
            }}
        >
          <ContextMenuGroup>
            <ContextMenuItem
                onClick={() => {
                  editor
                  .getTransforms(BlockSelectionPlugin)
                  .blockSelection.removeNodes();
                  focusEditor(editor);
                }}
            >
              <Trash2 className="mr-2" size={16} />
              Delete
            </ContextMenuItem>
            <ContextMenuItem
                onClick={() => {
                  editor
                  .getTransforms(BlockSelectionPlugin)
                  .blockSelection.duplicate(
                      editor.getApi(BlockSelectionPlugin).blockSelection.getNodes()
                  );
                }}
            >
              <Files className="mr-2" size={16} />
              Duplicate
              {/* <ContextMenuShortcut>Ctrl + D</ContextMenuShortcut> */}
            </ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger><RefreshCw className="mr-2" size={16} />Turn into</ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-48">
                <ContextMenuItem
                    onClick={() => handleTurnInto(ParagraphPlugin.key)}
                >
                  <PilcrowIcon className="mr-2" size={16} />Paragraph
                </ContextMenuItem>

                <ContextMenuItem onClick={() => handleTurnInto(HEADING_KEYS.h1)}>
                  <Heading1Icon  className="mr-2" size={16} />Heading 1
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleTurnInto(HEADING_KEYS.h2)}>
                  <Heading2Icon className="mr-2" size={16} />Heading 2
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleTurnInto(HEADING_KEYS.h3)}>
                  <Heading3Icon className="mr-2" size={16} />Heading 3
                </ContextMenuItem>
                <ContextMenuItem
                    onClick={() => handleTurnInto(BlockquotePlugin.key)}
                >
                  <QuoteIcon className="mr-2" size={16} />Blockquote
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuGroup>

          <ContextMenuGroup>
            <ContextMenuItem
                onClick={() =>
                    editor
                    .getTransforms(BlockSelectionPlugin)
                    .blockSelection.setIndent(1)
                }
            >
              <IndentIncrease className="mr-2" size={16} />Indent
            </ContextMenuItem>
            <ContextMenuItem
                onClick={() =>
                    editor
                    .getTransforms(BlockSelectionPlugin)
                    .blockSelection.setIndent(-1)
                }
            >
              <IndentDecrease className="mr-2" size={16} />
              Outdent
            </ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <AlignLeftIcon className="mr-2" size={16} />Align
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-48">
                <ContextMenuItem onClick={() => handleAlign('justify')}>
                  <AlignJustifyIcon className="mr-2" size={16} />justify
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleAlign('left')}>
                  <AlignLeftIcon className="mr-2" size={16} />Left
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleAlign('center')}>
                  <AlignCenterIcon className="mr-2" size={16} />Center
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleAlign('right')}>
                  <AlignRightIcon className="mr-2" size={16} />Right
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
  );
}
