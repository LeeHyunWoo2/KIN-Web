import React, {useState, useEffect, useCallback} from 'react';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {useAtom, useSetAtom} from 'jotai';
import {
  noteTitleAtom,
  noteContentAtom,
  noteEventAtom, saveNoteChangesAtom
} from '@/atoms/noteStateAtom';
import debounce from 'lodash/debounce';
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {
  Archive,
  ArchiveX,
  Forward, MoreVertical,
  Reply,
  ReplyAll,
  Trash2
} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function NoteDisplay({note}) {
  const [, setNoteEvent] = useAtom(noteEventAtom); // 이벤트 전송용 아톰

  const [title, setTitle] = useAtom(noteTitleAtom);
  const [content, setContent] = useAtom(noteContentAtom);

  // 노트의 초기 로딩 여부 확인
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  // 변경사항 플래그 (서로 반대시점을 체크하는건데 하나로 두 로직 작동시켜보니까 안되서 만듦)
  const [isNotSaved, setIsNotSaved] = useState(false);
  // 서버 저장 호출용 임시 페이로드 (최신상태 반영이 잘 안되어 추가)
  const [localPayload, setLocalPayload] = useState({});
  // 제목, 내용 이외 변경사항 저장용
  const saveNoteChanges = useSetAtom(saveNoteChangesAtom);

  useEffect(() => {
    // 선택된 노트가 변경될 때 필드 값도 업데이트
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setIsInitialLoad(true); // 처음 로딩 시에는 true
      setIsNotSaved(false);
    }
  }, [note, setTitle, setContent]);

  //  자동 저장 함수 (디바운스)
  const saveChanges = useCallback(debounce(() => {
    if (note && !isInitialLoad && isNotSaved) {  // 초기 로딩이 아닐 때만 저장
      setNoteEvent({
        type: 'UPDATE', // UPDATE 이벤트 발생
        targetId: note._id,
        payload: localPayload,
      });
      setIsNotSaved(false);
      setLocalPayload({}); // 저장 후 로컬 상태 초기화
    }
  }, 2000), [localPayload, setNoteEvent, isInitialLoad, isNotSaved]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setLocalPayload(prevPayload => ({ ...prevPayload, title: newTitle }));
    setIsInitialLoad(false); // 변경사항이 생기면 false
    setIsNotSaved(true);
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    setLocalPayload(prevPayload => ({ ...prevPayload, content: newContent }));
    setIsInitialLoad(false);
    setIsNotSaved(true);
  };

  const moveToTrash = () => {
    if (note._id) {
      saveNoteChanges({noteId: note._id, updatedFields:{is_trashed: true}});
    }
  };

  useEffect(() => {
    saveChanges();
    return () => saveChanges.cancel();
  }, [localPayload, saveChanges]);


  // 페이지 이탈 방지용 경고 설정
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isNotSaved) { // 변경 사항이 저장되지 않은 경우 경고
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isNotSaved]);


  if (!note) {
    return <div className="p-8 text-center text-muted-foreground">선택된 노트가
      없습니다.</div>;
  }

  return (
      <div className="flex flex-col h-full">
        <div className="flex items-center p-1">
          <div className="flex items-center gap-2">
            {/* Archive Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!note}>
                  <Archive className="h-4 w-4"/>
                  <span className="sr-only">Archive</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Archive</TooltipContent>
            </Tooltip>

            {/* Move to Junk Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!note}>
                  <ArchiveX className="h-4 w-4"/>
                  <span className="sr-only">Move to junk</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Move to junk</TooltipContent>
            </Tooltip>

            {/* Trash Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!note}  onClick={moveToTrash}>
                  <Trash2 className="h-4 w-4"/>
                  <span className="sr-only">Move to trash</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Move to trash</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-6"/>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Reply Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!note}>
                  <Reply className="h-4 w-4"/>
                  <span className="sr-only">Reply</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reply</TooltipContent>
            </Tooltip>

            {/* Reply All Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!note}>
                  <ReplyAll className="h-4 w-4"/>
                  <span className="sr-only">Reply all</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reply all</TooltipContent>
            </Tooltip>

            {/* Forward Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!note}>
                  <Forward className="h-4 w-4"/>
                  <span className="sr-only">Forward</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Forward</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="mx-2 h-6"/>

          {/* More Options Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!note}>
                <MoreVertical className="h-4 w-4"/>
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark as unread</DropdownMenuItem>
              <DropdownMenuItem>Star thread</DropdownMenuItem>
              <DropdownMenuItem>Add label</DropdownMenuItem>
              <DropdownMenuItem>Mute thread</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator/>
        <Input
            value={title}
            onChange={handleTitleChange} // 뭔가 바뀌면 호출
            className="mb-4 text-xl font-semibold"
        />
        <Textarea
            value={content}
            onChange={handleContentChange}
            className="flex-1"
        />
        {/*추후 카테고리와 태그 설정 추가할것*/}
      </div>
  );
}