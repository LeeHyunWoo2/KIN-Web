import React, {useCallback, useEffect, useState} from 'react';
import {useAtom, useAtomValue, useSetAtom} from 'jotai';
import {
  defaultNoteStateAtom,
  noteEventAtom,
  saveNoteChangesAtom,
  selectedNoteStateAtom, selectedNoteUploadFilesAtom
} from '@/atoms/noteStateAtom';
import debounce from 'lodash/debounce';
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {
  ArchiveX,
  Star,
  StarOff,
  Undo2,
  Tags,
  Trash2
} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {useRouter} from "next/router";
import {categoryTreeAtom, selectedTagsAtom} from "@/atoms/filterAtoms";
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
import TagSelector from './TagSelector'
import {Badge} from "@/components/ui/badge";
import PlateEditor from "@/components/notes/editor/plate-editor";
import CheckAnimation from "@/components/ui/Check";
import {Spinner} from "@/components/plate-ui/spinner";

const produce = require("immer").produce;

export default function NoteDisplay() {
  const router = useRouter();
  const [, setNoteEvent] = useAtom(noteEventAtom); // 이벤트 전송용 아톰
  const [selectedNoteState, setSelectedNoteState] = useAtom(
      selectedNoteStateAtom);
  const [categoryTree] = useAtom(categoryTreeAtom);
  const setSelectedTag = useSetAtom(selectedTagsAtom);

  // 노트의 초기 로딩 여부 확인
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 변경사항을 체크하는 플래그 (자동저장 및 저장중 이탈방지 작동 여부)
  const [isNotSaved, setIsNotSaved] = useState(false);

  // 서버 저장 호출용 페이로드 (변경사항만 따로 저장하는 용도, 디바운스 O)
  const [localPayload, setLocalPayload] = useState({});

  // 제목, 내용 이외 변경사항 저장용 (디바운스 X)
  const saveNoteChanges = useSetAtom(saveNoteChangesAtom);
  const uploadedFiles = useAtomValue(selectedNoteUploadFilesAtom);

  //  자동 저장 함수 (디바운스)
  const saveChanges = useCallback(
      debounce(() => {
        if (selectedNoteState && isNotSaved) {
          setNoteEvent({
            type: 'UPDATE', // UPDATE 이벤트 발생
            payload: [{ // 배열 형태로 전달
              id: selectedNoteState._id,
              ...localPayload,
              uploadedFiles: uploadedFiles,
              mode: selectedNoteState.mode,
            }],
          });
          setIsNotSaved(false);
          setLocalPayload({}); // 저장 후 로컬 상태 초기화
          setTimeout(() => {
            setNoteEvent(null);
          }, 0);
        }
      }, 1500),
      [localPayload, setNoteEvent, isNotSaved, uploadedFiles]
  );

  useEffect(() => {
    // 노트의 id가 변경됨을 감지하면 초기로드 플래그를 true로 변경함
    setIsInitialLoad(true);
  }, [selectedNoteState._id])

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

// PlateEditor의 변경사항을 처리
  const handleValueChange = (newContent) => {
    // 현재 선택된 노트의 content 업데이트
    setSelectedNoteState((prev) => ({
      ...prev,
      content: newContent, // JSON 데이터를 content에 그대로 저장
    }));
    // localPayload 업데이트
    setLocalPayload((prevPayload) => ({
      ...prevPayload,
      content: newContent, // 서버에 전송할 변경 내용
    }));
    setIsInitialLoad(false);
    setIsNotSaved(true);     // 변경사항 플래그 설정
  };


  const handleCategorySelect = (category) => {
    if (category._id !== selectedNoteState.category._id) {
      const setCategory = {category: {_id: category._id, name: category.name}};
      saveNoteChanges({
        updatedFieldsList: [{id: selectedNoteState._id, ...setCategory}],
      })
    }
  };

  const CategoryMenuItems = ({ categories }) => {
    return categories.map((category) => {
      if (category.children && category.children.length > 0) {
        // 하위 카테고리가 있을 경우
        return (
            <MenubarSub key={category._id}>
              <MenubarSubTrigger
                  className={category._id === selectedNoteState.category._id ? "opacity-50" : "opacity-100"}
                  onClick={() => handleCategorySelect(category)}
              >{category.name}</MenubarSubTrigger>
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

  const pinTheNote = () => {
    const isCurrentlyPinned = selectedNoteState.is_pinned;
    const updatedFields = { is_pinned: !isCurrentlyPinned }; // 상태 반전
    saveNoteChanges({
      updatedFieldsList: [{ id: selectedNoteState._id, ...updatedFields }],
    });
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

  // 이탈 방지용 경고 설정
  useEffect(() => {
    if (isNotSaved) {  // 변경 사항이 저장되지 않은 경우 경고
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = '';
      };

      const onRouteChangeStart = () => {
        if (isNotSaved) {
          const confirmationMessage = "저장되지 않은 변경 사항이 있습니다. 계속하시겠습니까?";
          if (!window.confirm(confirmationMessage)) {
            router.events.emit('routeChangeError');
            throw ("라우팅 취소됨 (오류가 아니라 정상작동 입니다.)");
          } else {
            setLocalPayload({}); // 로컬 페이로드를 초기화해야 다른 노트에 저장사항이 덮어씌워지지 않음
            setIsNotSaved(false);
          }
        }
      };

      // 브라우저 이탈 방지
      window.addEventListener('beforeunload', handleBeforeUnload);

      // URL 변경 시 경고
      router.events.on('routeChangeStart', onRouteChangeStart);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        router.events.off('routeChangeStart', onRouteChangeStart);
      };
    }
  }, [isNotSaved, router.events]);

  return (
      <div className="flex flex-col h-full">
        <div className="flex p-1 mt-1">
          <div className="flex items-center ml-2 gap-2">
            {categoryTree.length ? (
                <Menubar>
                  <MenubarMenu>
                    <MenubarTrigger
                        className="cursor-pointer">{selectedNoteState.category._id
                        ? selectedNoteState.category.name
                        : "카테고리 선택"}</MenubarTrigger>
                    <MenubarContent>
                      <CategoryMenuItems categories={categoryTree}/>
                      {selectedNoteState.category._id &&
                          <MenubarItem className="text-red-500" onClick={() => {
                            handleCategorySelect({_id: null, name: null})
                          }}>
                            카테고리 초기화
                          </MenubarItem>
                      }
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
            ) : (
                <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm
                  font-medium pointer-events-none opacity-60 border  bg-background shadow-sm h-9 px-4 py-2">
                  카테고리 없음
                </div>
            )}
          </div>
          <Separator orientation="vertical" className="mx-3 "/>
          <TagSelector/>
          <Separator orientation="vertical" className="mx-3 "/>
          <div className="flex items-center gap-1">
          <Tags className="mr-1" size={24}/>
            {selectedNoteState.tags.length !== 0 && (
                <>
                  {selectedNoteState.tags.map((tag) =>
                      <Badge key={tag._id} variant="secondary2"
                             className="mr-2 text-sm cursor-pointer"
                             onClick={() => setSelectedTag([tag])}
                      > {tag.name}</Badge>
                  )}
                </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {!isInitialLoad && (isNotSaved ? (
            <Spinner className="size-5" />
            ):(
            <CheckAnimation/>
            ))}
            <Separator orientation="vertical" className="mx-3 h-6"/>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={pinTheNote}
                        disabled={selectedNoteState.is_trashed}>
                  {!selectedNoteState.is_pinned ? (
                      <Star className="h-4 w-4"/>
                  ) : (
                      <StarOff/>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{!selectedNoteState.is_pinned ? '즐겨찾기'
                  : '즐겨찾기 해제'}</TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="mx-3 h-6"/>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon"
                        disabled={selectedNoteState.is_trashed === false}
                        onClick={handlePermanentDelete}>
                  <ArchiveX className="h-4 w-4"/>
                  <span className="sr-only">Move to junk</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>영구삭제</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon"
                        disabled={selectedNoteState.is_pinned === true}
                        onClick={moveToTrash}>
                  {!selectedNoteState.is_trashed === true ? (
                      <Trash2 className="h-4 w-4"/>) : (
                      <Undo2/>)}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{!selectedNoteState.is_trashed ? '휴지통으로 이동' : '복구하기'}</TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="mx-1 h-6"/>
          </div>
        </div>
        <input
            value={selectedNoteState.title}
            onChange={handleTitleChange} // 뭔가 바뀌면 호출
            className="w-auto px-3 py-1 border rounded-md shadow-sm outline-none text-xl font-semibold mt-1 mx-3"
        />
        <div className="flex flex-col flex-1 p-3 relative">
          <div className="absolute h-full p-3 left-0 right-0 bottom-0"
               data-registry="plate">
            {selectedNoteState.mode === "editor" ? (
                <PlateEditor onChange={handleValueChange}/>
            ) : (
                <textarea
                    className="w-full h-full p-3 border rounded-md shadow-sm outline-none resize-none"
                    value={selectedNoteState.content}
                    onChange={(e) => handleValueChange(e.target.value)}
                />
            )}
          </div>
        </div>
      </div>
  );
}