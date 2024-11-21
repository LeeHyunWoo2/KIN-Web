import React, {useCallback, useEffect, useState} from 'react';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {useAtom, useSetAtom} from 'jotai';
import {
  defaultNoteStateAtom,
  noteEventAtom,
  saveNoteChangesAtom,
  selectedNoteStateAtom
} from '@/atoms/noteStateAtom';
import debounce from 'lodash/debounce';
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {
  ArchiveX,
  Forward,
  MoreVertical,
  Reply,
  ReplyAll,
  Trash2
} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {useRouter} from "next/router";
import {categoryTreeAtom} from "@/atoms/filterAtoms";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger
} from "@/components/ui/menubar";

const produce = require("immer").produce;

export default function NoteDisplay() {
  const router = useRouter();
  const [, setNoteEvent] = useAtom(noteEventAtom); // 이벤트 전송용 아톰
  const [selectedNoteState, setSelectedNoteState] = useAtom(
      selectedNoteStateAtom);
  const [categoryTree] = useAtom(categoryTreeAtom);

  // 노트의 초기 로딩 여부 확인 (노트 누르자마자 자동저장 시작하는거 방지)
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  // 변경사항을 체크하는 플래그 (자동저장 및 탈주방지 작동 여부)
  const [isNotSaved, setIsNotSaved] = useState(false);
  // 서버 저장 호출용 페이로드 (변경사항만 따로 저장하는 용도, 디바운스 O)
  const [localPayload, setLocalPayload] = useState({});
  // 제목, 내용 이외 변경사항 저장용 (디바운스 X)
  const saveNoteChanges = useSetAtom(saveNoteChangesAtom);

  //  자동 저장 함수 (디바운스)
  const saveChanges = useCallback(
      debounce(() => {
        if (selectedNoteState && !isInitialLoad && isNotSaved) { // 초기 로딩이 아닐 때만 저장
          setNoteEvent({
            type: 'UPDATE', // UPDATE 이벤트 발생
            payload: [{ // 배열 형태로 전달
              id: selectedNoteState._id,
              ...localPayload,
            }],
          });
          setIsNotSaved(false);
          setLocalPayload({}); // 저장 후 로컬 상태 초기화
        }
      }, 1500),
      [localPayload, setNoteEvent, isInitialLoad, isNotSaved]
  );

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setSelectedNoteState((prev) => produce(prev, (draft) => {
      draft.title = newTitle;
    }));
    setLocalPayload((prevPayload) =>
        produce(prevPayload, (draft) => {
          draft.title = newTitle;
        })
    );
    setIsInitialLoad(false);
    setIsNotSaved(true);
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setSelectedNoteState((prev) => produce(prev, (draft) => {
      draft.content = newContent;
    }));
    setLocalPayload((prevPayload) =>
        produce(prevPayload, (draft) => {
          draft.content = newContent;
        })
    );
    setIsInitialLoad(false);
    setIsNotSaved(true);
  };

  const handleCategorySelect = (category) => {
    const setCategory = {category: { _id: category._id, name:category.name }};
    saveNoteChanges({
      updatedFieldsList: [{ id: selectedNoteState._id, ...setCategory}],
    })
  };

  const CategoryMenuItems = ({ categories }) => {
    return categories.map((category) => {
      if (category.children && category.children.length > 0) {
        // 하위 카테고리가 있을 경우
        return (
            <MenubarSub key={category._id} onClick={() => handleCategorySelect(category._id)}>
              <MenubarSubTrigger>{category.name}</MenubarSubTrigger>
              <MenubarSubContent>
                <CategoryMenuItems categories={category.children} />
              </MenubarSubContent>
            </MenubarSub>
        );
      }
      // 하위 카테고리가 없을 경우
      return <MenubarItem key={category._id} onClick={() => handleCategorySelect(category)}>{category.name}</MenubarItem>;
    });
  };


  const moveToTrash = () => {
    const isCurrentlyTrashed = selectedNoteState.is_trashed;
    const updatedFields = { is_trashed: !isCurrentlyTrashed }; // 상태 반전

    saveNoteChanges({
      updatedFieldsList: [{ id: selectedNoteState._id, ...updatedFields }],
    });

    setSelectedNoteState(defaultNoteStateAtom);

      router.push(`/notes`, undefined, { shallow: true }); // 휴지통으로 이동 후

  };


  const handlePermanentDelete = () => {
    if (selectedNoteState.is_trashed) {
      setNoteEvent({
        type: 'DELETE',
        payload: [selectedNoteState._id],
      });
      router.push('/notes?view=trash', undefined, { shallow: true });
    }
  };

  useEffect(() => {
    saveChanges();
    return () => saveChanges.cancel();
  }, [saveChanges]);

  // 페이지 이탈 방지용 경고 설정
  useEffect(() => {
    if (isNotSaved) {  // 변경 사항이 저장되지 않은 경우 경고
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = '';
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload',
          handleBeforeUnload);
    }
  }, [isNotSaved]);

  if (!selectedNoteState) {
    return <div className="p-8 text-center text-muted-foreground">선택된 노트가
      없습니다.</div>;
  }

  return (
      <div className="flex flex-col h-full">
        <div className="flex items-center p-1">
          <div className="flex items-center gap-2">
            {/* Archive Button */}
{/*            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon"
                        disabled={!selectedNoteState}>
                  <Archive className="h-4 w-4"/>
                  <span className="sr-only">Archive</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Archive</TooltipContent>
            </Tooltip>*/}

            {/* Move to Junk Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={selectedNoteState.is_trashed === false} onClick={handlePermanentDelete}>
                  <ArchiveX className="h-4 w-4"/>
                  <span className="sr-only">Move to junk</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>영구삭제</TooltipContent>
            </Tooltip>

            {/* Trash Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon"
                        disabled={!selectedNoteState} onClick={moveToTrash}>
                  <Trash2 className="h-4 w-4"/>
                  <span className="sr-only">Move to trash</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>휴지통으로 이동</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-6"/>
          </div>

          <div className="ml-auto flex items-center gap-2">

            {categoryTree.length ? (
                <Menubar>
                  <MenubarMenu>
                    <MenubarTrigger className="cursor-pointer">{selectedNoteState.category._id ? selectedNoteState.category.name : "카테고리 선택"}</MenubarTrigger>
                    <MenubarContent>
                      <CategoryMenuItems categories={categoryTree} />
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
            ) : ('')}

            {/* Reply Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon"
                        disabled={!selectedNoteState}>
                  <Reply className="h-4 w-4"/>
                  <span className="sr-only">Reply</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reply</TooltipContent>
            </Tooltip>

            {/* Reply All Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon"
                        disabled={!selectedNoteState}>
                  <ReplyAll className="h-4 w-4"/>
                  <span className="sr-only">Reply all</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reply all</TooltipContent>
            </Tooltip>

            {/* Forward Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon"
                        disabled={!selectedNoteState}>
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
              <Button variant="ghost" size="icon" disabled={!selectedNoteState}>
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
            value={selectedNoteState.title}
            onChange={handleTitleChange} // 뭔가 바뀌면 호출
            className="mb-4 text-xl font-semibold"
        />
        <Textarea
            value={selectedNoteState.content}
            onChange={handleContentChange}
            className="flex-1"
        />
        {/*추후 카테고리와 태그 설정 추가할것*/}
      </div>
  );
}