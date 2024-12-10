import { withProps } from '@udecode/cn';
import { usePlateEditor, ParagraphPlugin, PlateLeaf } from '@udecode/plate-common/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CodeBlockPlugin, CodeLinePlugin, CodeSyntaxPlugin } from '@udecode/plate-code-block/react';
import { HeadingPlugin, TocPlugin } from '@udecode/plate-heading/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { LinkPlugin } from '@udecode/plate-link/react';
import { ImagePlugin, MediaEmbedPlugin, PlaceholderPlugin } from '@udecode/plate-media/react';
import { ExcalidrawPlugin } from '@udecode/plate-excalidraw/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import { ColumnPlugin, ColumnItemPlugin } from '@udecode/plate-layout/react';
import { TablePlugin, TableRowPlugin, TableCellPlugin, TableCellHeaderPlugin } from '@udecode/plate-table/react';
import { TodoListPlugin } from '@udecode/plate-list/react';
import { DatePlugin } from '@udecode/plate-date/react';
import { CaptionPlugin } from '@udecode/plate-caption/react';
import { BoldPlugin, ItalicPlugin, UnderlinePlugin, StrikethroughPlugin, CodePlugin, SubscriptPlugin, SuperscriptPlugin } from '@udecode/plate-basic-marks/react';
import {BaseFontColorPlugin, BaseFontBackgroundColorPlugin, BaseFontSizePlugin } from '@udecode/plate-font';
import { HighlightPlugin } from '@udecode/plate-highlight/react';
import { KbdPlugin } from '@udecode/plate-kbd/react';
import { BaseAlignPlugin } from '@udecode/plate-alignment';
import { IndentPlugin } from '@udecode/plate-indent/react';
import { IndentListPlugin } from '@udecode/plate-indent-list/react';
import {BaseLineHeightPlugin } from '@udecode/plate-line-height';
import { AutoformatPlugin } from '@udecode/plate-autoformat/react';
import { BlockSelectionPlugin, BlockMenuPlugin, CursorOverlayPlugin } from '@udecode/plate-selection/react';
import { DndPlugin } from '@udecode/plate-dnd';
import { ExitBreakPlugin, SoftBreakPlugin } from '@udecode/plate-break/react';
import { DeletePlugin } from '@udecode/plate-select';
import { TabbablePlugin } from '@udecode/plate-tabbable/react';
import { NodeIdPlugin } from '@udecode/plate-node-id';
import { ResetNodePlugin } from '@udecode/plate-reset-node/react';
import { TrailingBlockPlugin } from '@udecode/plate-trailing-block';
import { BaseSlashPlugin } from '@udecode/plate-slash-command';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { FixedToolbarPlugin } from '@/components/notes/editor/plugins/fixed-toolbar-plugin';
import { FloatingToolbarPlugin } from '@/components/notes/editor/plugins/floating-toolbar-plugin';


import { BlockquoteElement } from '@/components/plate-ui/blockquote-element';
import { CodeBlockElement } from '@/components/plate-ui/code-block-element';
import { CodeLineElement } from '@/components/plate-ui/code-line-element';
import { CodeSyntaxLeaf } from '@/components/plate-ui/code-syntax-leaf';
import { CursorOverlay } from '@/components/plate-ui/cursor-overlay';
import { ExcalidrawElement } from '@/components/plate-ui/excalidraw-element';
import { HrElement } from '@/components/plate-ui/hr-element';
import { ImageElement } from '@/components/plate-ui/image-element';
import { LinkElement } from '@/components/plate-ui/link-element';
import { LinkFloatingToolbar } from '@/components/plate-ui/link-floating-toolbar';
import { ToggleElement } from '@/components/plate-ui/toggle-element';
import { ColumnGroupElement } from '@/components/plate-ui/column-group-element';
import { ColumnElement } from '@/components/plate-ui/column-element';
import { HeadingElement } from '@/components/plate-ui/heading-element';
import { MediaEmbedElement } from '@/components/plate-ui/media-embed-element';
import { ParagraphElement } from '@/components/plate-ui/paragraph-element';
import { TableElement } from '@/components/plate-ui/table-element';
import { TableRowElement } from '@/components/plate-ui/table-row-element';
import { TableCellElement, TableCellHeaderElement } from '@/components/plate-ui/table-cell-element';
import { TodoListElement } from '@/components/plate-ui/todo-list-element';
import { DateElement } from '@/components/plate-ui/date-element';
import { CodeLeaf } from '@/components/plate-ui/code-leaf';
import { HighlightLeaf } from '@/components/plate-ui/highlight-leaf';
import { KbdLeaf } from '@/components/plate-ui/kbd-leaf';
import { withPlaceholders } from '@/components/plate-ui/placeholder';
import { withDraggables } from '@/components/plate-ui/with-draggables';
import {BlockContextMenu} from "@/components/plate-ui/block-context-menu";

export const useCreateEditor = () => {
  return usePlateEditor({
    plugins: [
      BlockquotePlugin,
      CodeBlockPlugin,
      ParagraphPlugin,
      HeadingPlugin,
      HorizontalRulePlugin,
      LinkPlugin.configure({
        render: {afterEditable: () => <LinkFloatingToolbar/>},
      }),
      ImagePlugin,
      ExcalidrawPlugin,
      TogglePlugin,
      ColumnPlugin,
      MediaEmbedPlugin,
      PlaceholderPlugin,
      TablePlugin,
      TodoListPlugin,
      DatePlugin,
      TocPlugin,
      CaptionPlugin.configure({
        options: {plugins: [ImagePlugin, MediaEmbedPlugin]},
      }),
      BoldPlugin,
      ItalicPlugin,
      UnderlinePlugin,
      StrikethroughPlugin,
      CodePlugin,
      SubscriptPlugin,
      SuperscriptPlugin,
      BaseFontColorPlugin,
      BaseFontBackgroundColorPlugin,
      BaseFontSizePlugin,
      HighlightPlugin,
      KbdPlugin,
      BaseAlignPlugin.configure({
        inject: {targetPlugins: ['p', 'h1', 'h2', 'h3']},
      }),
      IndentPlugin.configure({
        inject: {targetPlugins: ['p', 'h1', 'h2', 'h3']},
      }),
      IndentListPlugin.configure({
        inject: {targetPlugins: ['p', 'h1', 'h2', 'h3']},
      }),
      BaseLineHeightPlugin.configure({
        inject: {
          nodeProps: {
            defaultNodeValue: 1.5,
            validNodeValues: [1, 1.2, 1.5, 2, 3],
          },
          targetPlugins: ['p', 'h1', 'h2', 'h3'],
        },
      }),
      AutoformatPlugin.configure({
        options: {
          enableUndoOnDelete: true,
          rules: [
            // Usage: https://platejs.org/docs/autoformat
          ],
        },
      }),
      BlockSelectionPlugin.configure({
        inject: {
          excludeBelowPlugins: ['tr'],
          excludePlugins: ['table', 'code_line', 'column_group', 'column'],
        },
        options: {
          enableContextMenu: true,
        },
      }),
      BlockMenuPlugin.configure({
        render: { aboveEditable: BlockContextMenu },
      }),
      DndPlugin.configure({
        options: {
          enableScroller: true,
          onDropFiles: ({ dragItem, editor, target }) => {
            editor
            .getTransforms(PlaceholderPlugin)
            .insert.media(dragItem.files, { at: target, nextBlock: false });
          },
        },
      }),
      ExitBreakPlugin.configure({
        options: {
          rules: [
            {
              hotkey: 'mod+enter',
            },
            {
              before: true,
              hotkey: 'mod+shift+enter',
            },
            {
              hotkey: 'enter',
              level: 1,
              query: {
                allow: ['h1', 'h2', 'h3'],
                end: true,
                start: true,
              },
              relative: true,
            },
          ],
        },
      }),
      DeletePlugin,
      SoftBreakPlugin.configure({
        options: {
          rules: [
            {hotkey: 'shift+enter'},
            {
              hotkey: 'enter',
              query: {
                allow: ['code_block', 'blockquote', 'td', 'th'],
              },
            },
          ],
        },
      }),
      TabbablePlugin,
      CursorOverlayPlugin.configure({
        render: {afterEditable: () => <CursorOverlay/>},
      }),
      FixedToolbarPlugin,
      FloatingToolbarPlugin,
      NodeIdPlugin,
      ResetNodePlugin.configure({
        options: {
          rules: [
            // Usage: https://platejs.org/docs/reset-node
          ],
        },
      }),
      TrailingBlockPlugin.configure({
        options: {type: 'p'},
      }),
      BaseSlashPlugin,
    ],
    override: {
      components: withDraggables(withPlaceholders(({
        [BlockquotePlugin.key]: BlockquoteElement,
        [CodeBlockPlugin.key]: CodeBlockElement,
        [CodeLinePlugin.key]: CodeLineElement,
        [CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
        [ExcalidrawPlugin.key]: ExcalidrawElement,
        [HorizontalRulePlugin.key]: HrElement,
        [ImagePlugin.key]: ImageElement,
        [LinkPlugin.key]: LinkElement,
        [TogglePlugin.key]: ToggleElement,
        [ColumnPlugin.key]: ColumnGroupElement,
        [ColumnItemPlugin.key]: ColumnElement,
        [HEADING_KEYS.h1]: withProps(HeadingElement, {variant: 'h1'}),
        [HEADING_KEYS.h2]: withProps(HeadingElement, {variant: 'h2'}),
        [HEADING_KEYS.h3]: withProps(HeadingElement, {variant: 'h3'}),
        [HEADING_KEYS.h4]: withProps(HeadingElement, {variant: 'h4'}),
        [HEADING_KEYS.h5]: withProps(HeadingElement, {variant: 'h5'}),
        [HEADING_KEYS.h6]: withProps(HeadingElement, {variant: 'h6'}),
        [MediaEmbedPlugin.key]: MediaEmbedElement,
        [ParagraphPlugin.key]: ParagraphElement,
        [TablePlugin.key]: TableElement,
        [TableRowPlugin.key]: TableRowElement,
        [TableCellPlugin.key]: TableCellElement,
        [TableCellHeaderPlugin.key]: TableCellHeaderElement,
        [TodoListPlugin.key]: TodoListElement,
        [DatePlugin.key]: DateElement,
        [BoldPlugin.key]: withProps(PlateLeaf, {as: 'strong'}),
        [CodePlugin.key]: CodeLeaf,
        [HighlightPlugin.key]: HighlightLeaf,
        [ItalicPlugin.key]: withProps(PlateLeaf, {as: 'em'}),
        [KbdPlugin.key]: KbdLeaf,
        [StrikethroughPlugin.key]: withProps(PlateLeaf, {as: 's'}),
        [SubscriptPlugin.key]: withProps(PlateLeaf, {as: 'sub'}),
        [SuperscriptPlugin.key]: withProps(PlateLeaf, {as: 'sup'}),
        [UnderlinePlugin.key]: withProps(PlateLeaf, {as: 'u'}),
      }))),
    },
    value: [
      {
        id: "1",
        type: "p",
        children: [{text: "Hello, World!"}],
      },
      {
        id: "2",
        type: "p",
        children: [{text:"어흐흑"}],
      },
      {
        id: "3",
        type: "p",
        children: [{text:"asdf"}],
      },
      {
        id: "4",
        type: "p",
        children: [{text:"12345"}],
      },
    ],
  });
}