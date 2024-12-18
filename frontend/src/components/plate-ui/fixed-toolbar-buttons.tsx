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
import {ListStyleType} from '@udecode/plate-indent-list';
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
import {RedoToolbarButton, UndoToolbarButton} from './history-toolbar-button';
import {IndentListToolbarButton} from './indent-list-toolbar-button';
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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../ui/select';
import {Separator} from "@/components/plate-ui/separator";

export function FixedToolbarButtons() {
  const readOnly = useEditorReadOnly();
  const [value, setValue] = useState("menu1");

  const menu = { menu1: "서식", menu2: "삽입"}

  return (
      <>
        <div className="flex max-w-50 overflow-x-auto"  style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(200, 200, 200, 0.5) transparent',
        }}>
          {!readOnly && (
              <>
                <Select value={value} onValueChange={setValue}>
                  <SelectTrigger className="h-7">
                    <SelectValue>
                      {menu[value]}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="menu1">서식</SelectItem>
                    <SelectItem value="menu2">삽입</SelectItem>
                  </SelectContent>
                </Select>

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
                        <MarkToolbarButton nodeType={BoldPlugin.key} tooltip="Bold (Ctrl+B)">
                          <BoldIcon/>
                        </MarkToolbarButton>

                        <MarkToolbarButton
                            nodeType={ItalicPlugin.key}
                            tooltip="Italic (Ctrl+I)"
                        >
                          <ItalicIcon/>
                        </MarkToolbarButton>

                        <MarkToolbarButton
                            nodeType={UnderlinePlugin.key}
                            tooltip="Underline (Ctrl+U)"
                        >
                          <UnderlineIcon/>
                        </MarkToolbarButton>

                        <MarkToolbarButton
                            nodeType={StrikethroughPlugin.key}
                            tooltip="Strikethrough (Ctrl+Shift+M)"
                        >
                          <StrikethroughIcon/>
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

                        <MarkToolbarButton nodeType={CodePlugin.key} tooltip="Code (Ctrl+E)">
                          <Code2Icon/>
                        </MarkToolbarButton>
                      </ToolbarGroup>

                      <ToolbarGroup>
                        <AlignDropdownMenu/>
                        <IndentListToolbarButton nodeType={ListStyleType.Disc}/>
                        <IndentListToolbarButton nodeType={ListStyleType.Decimal}/>
                        <IndentTodoToolbarButton/>
                        <ToggleToolbarButton/>
                      </ToolbarGroup>

                      <ToolbarGroup>
                        <LineHeightDropdownMenu/>
                        <OutdentToolbarButton/>
                        <IndentToolbarButton/>
                      </ToolbarGroup>

                      <ToolbarGroup>
                        <TurnIntoDropdownMenu/>
                      </ToolbarGroup>
                    </>
                )}

                {value === "menu2" && (
                    <>
                      <ToolbarGroup>
                        <MoreDropdownMenu/>
                        <InsertDropdownMenu/>
                      </ToolbarGroup>
                      <Separator orientation="vertical"/>
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
                        <ExportToolbarButton>
                          <ArrowUpToLineIcon/>
                        </ExportToolbarButton>
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
