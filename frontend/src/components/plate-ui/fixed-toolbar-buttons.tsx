'use client';

import React, {useState} from 'react';

import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import {useEditorReadOnly} from '@udecode/plate-common/react';
import {
  FontBackgroundColorPlugin,
  FontColorPlugin,
} from '@udecode/plate-font/react';
import {HighlightPlugin} from '@udecode/plate-highlight/react';
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  VideoPlugin,
} from '@udecode/plate-media/react';
import {
  ArrowUpToLineIcon,
  BaselineIcon,
  BoldIcon,
  Code2Icon,
  HighlighterIcon,
  ItalicIcon,
  PaintBucketIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react';

import {MoreDropdownMenu} from '@/components/plate-ui/more-dropdown-menu';

import {AlignDropdownMenu} from './align-dropdown-menu';
import {ColorDropdownMenu} from './color-dropdown-menu';
import {ExportToolbarButton} from './export-toolbar-button';
import {FontSizeToolbarButton} from './font-size-toolbar-button';
import {RedoToolbarButton, UndoToolbarButton} from './history-toolbar-button';
import {
  BulletedIndentListToolbarButton,
  NumberedIndentListToolbarButton,
} from './indent-list-toolbar-button';
import {IndentTodoToolbarButton} from './indent-todo-toolbar-button';
import {IndentToolbarButton} from './indent-toolbar-button';
import {InsertDropdownMenu} from './insert-dropdown-menu';
import {LineHeightDropdownMenu} from './line-height-dropdown-menu';
import {LinkToolbarButton} from './link-toolbar-button';
import {MarkToolbarButton} from './mark-toolbar-button';
import {MediaToolbarButton} from './media-toolbar-button';
import {ModeDropdownMenu} from './mode-dropdown-menu';
import {OutdentToolbarButton} from './outdent-toolbar-button';
import {TableDropdownMenu} from './table-dropdown-menu';
import {ToggleToolbarButton} from './toggle-toolbar-button';
import {ToolbarGroup} from './toolbar';
import {TurnIntoDropdownMenu} from './turn-into-dropdown-menu';
import {Separator} from "@/components/plate-ui/separator";
import {Button} from "@/components/plate-ui/button";

export function FixedToolbarButtons() {
  const readOnly = useEditorReadOnly();
  const [value, setValue] = useState("menu1");

  const menu: Record<string, string> = {menu1: "서식", menu2: "삽입"}

  return (
      <>
        <div className="flex max-w-50 overflow-x-auto" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(200, 200, 200, 0.5) transparent',
        }}>
          {!readOnly && (
              <>
                <Button onClick={() => setValue(value === "menu1" ? "menu2" : "menu1")}
                variant="outline">
                  메뉴 전환
                </Button>
                <div className="mx-1.5">
                  <Separator orientation="vertical"/>
                </div>

                <ToolbarGroup>
                  <UndoToolbarButton/>
                  <RedoToolbarButton/>
                </ToolbarGroup>

                {value === "menu1" && (
                    <>
                      <ToolbarGroup>
                        <ExportToolbarButton>
                          <ArrowUpToLineIcon/>
                        </ExportToolbarButton>
                      </ToolbarGroup>

                      <ToolbarGroup>
                        <InsertDropdownMenu/>
                        <TurnIntoDropdownMenu/>
                        <FontSizeToolbarButton/>
                      </ToolbarGroup>

                      <ToolbarGroup>
                        <MarkToolbarButton nodeType={BoldPlugin.key} tooltip="Bold (⌘+B)">
                          <BoldIcon/>
                        </MarkToolbarButton>

                        <MarkToolbarButton
                            nodeType={ItalicPlugin.key}
                            tooltip="Italic (⌘+I)"
                        >
                          <ItalicIcon/>
                        </MarkToolbarButton>

                        <MarkToolbarButton
                            nodeType={UnderlinePlugin.key}
                            tooltip="Underline (⌘+U)"
                        >
                          <UnderlineIcon/>
                        </MarkToolbarButton>

                        <MarkToolbarButton
                            nodeType={StrikethroughPlugin.key}
                            tooltip="Strikethrough (⌘+⇧+M)"
                        >
                          <StrikethroughIcon/>
                        </MarkToolbarButton>

                        <MarkToolbarButton nodeType={CodePlugin.key} tooltip="Code (⌘+E)">
                          <Code2Icon/>
                        </MarkToolbarButton>

                        <ColorDropdownMenu
                            nodeType={FontColorPlugin.key}
                            tooltip="Text color"
                        >
                          <BaselineIcon/>
                        </ColorDropdownMenu>

                        <ColorDropdownMenu
                            nodeType={FontBackgroundColorPlugin.key}
                            tooltip="Background color"
                        >
                          <PaintBucketIcon/>
                        </ColorDropdownMenu>
                      </ToolbarGroup>

                      <ToolbarGroup>
                        <AlignDropdownMenu/>

                        <NumberedIndentListToolbarButton/>
                        <BulletedIndentListToolbarButton/>
                        <IndentTodoToolbarButton/>
                        <ToggleToolbarButton/>
                      </ToolbarGroup>
                    </>
                )}

                {value === "menu2" && (
                    <>
                      <ToolbarGroup>
                        <LinkToolbarButton/>
                        <TableDropdownMenu/>
                      </ToolbarGroup>

                      <ToolbarGroup>
                        <MediaToolbarButton nodeType={ImagePlugin.key}/>
                        <MediaToolbarButton nodeType={VideoPlugin.key}/>
                        <MediaToolbarButton nodeType={AudioPlugin.key}/>
                        <MediaToolbarButton nodeType={FilePlugin.key}/>
                      </ToolbarGroup>

                      <ToolbarGroup>
                        <LineHeightDropdownMenu/>
                        <OutdentToolbarButton/>
                        <IndentToolbarButton/>
                      </ToolbarGroup>

                      <ToolbarGroup>
                        <MoreDropdownMenu/>
                      </ToolbarGroup>
                    </>
                )}
              </>
          )}
        </div>
        <>
          <ToolbarGroup>
            <MarkToolbarButton nodeType={HighlightPlugin.key} tooltip="하이라이트">
              <HighlighterIcon/>
            </MarkToolbarButton>
            <Separator orientation="vertical"/>
            <ModeDropdownMenu/>
          </ToolbarGroup>
        </>
      </>
  );
}