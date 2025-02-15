import React, {useEffect, useState} from 'react';
import {Loader2, Search} from "lucide-react";
import {useRouter} from 'next/router';
import NoteDisplay from './NoteDisplay';
import NoteList from "@/components/notes/NoteList";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import {Separator} from "@/components/ui/separator";
import {useAtom, useAtomValue, useSetAtom} from 'jotai';
import {
  defaultNoteStateAtom,
  noteCountAtom, noteEventAtom,
  noteListAtom,
  selectedNoteStateAtom, selectedNoteUploadFilesAtom
} from "@/atoms/noteStateAtom";
import {
  initializeCategoriesAtom,
  initializeNotesAtom, initializeTagsAtom
} from "@/lib/notes/noteState";
import {Button} from "@/components/ui/button";
import {checkAndSyncOnFirstLoad} from "@/services/user/syncAPIService";
import {filteredNotesAtom} from "@/lib/notes/filterNotes";
import {
  isTrashedAtom,
  selectedCategoryNameAtom
} from "@/atoms/filterAtoms";
import {SearchFilter} from "@/components/notes/FilterComponents";

export default function NoteContainer({ defaultLayout }) {
  const router = useRouter();
  const { id } = router.query; // URL에서 id와 view 가져옴
  const notes = useAtomValue(noteListAtom);
  const  initializeNotes = useSetAtom(initializeNotesAtom);
  const  initializeCategories = useSetAtom(initializeCategoriesAtom);
  const  initializeTags = useSetAtom(initializeTagsAtom);
  const [selectedNoteState, setSelectedNoteState] = useAtom(selectedNoteStateAtom);
  const setNoteCount = useSetAtom(noteCountAtom);
  const [onReload, setOnReload] = useState(false);
  const filteredNotes = useAtomValue(filteredNotesAtom);
  const isTrashed = useAtomValue(isTrashedAtom);
  const category = useAtomValue(selectedCategoryNameAtom);
  const setSelectedNoteUploadFiles = useSetAtom(selectedNoteUploadFilesAtom);
  const [, setNoteEvent] = useAtom(noteEventAtom);

  // 로딩 상태 관리
  const [layout, setLayout] = useState(() => {
    // 로컬스토리지에서 값을 가져오고, 없으면 기본값 설정
    const savedLayout = localStorage.getItem("note-layout");
    return savedLayout ? JSON.parse(savedLayout) : defaultLayout || [23, 80];
  });

  // 로컬스토리지에서 레이아웃 초기값 불러옴
  useEffect(() => {
    const savedLayout = localStorage.getItem("note-layout");
    if (savedLayout) {
      setLayout(JSON.parse(savedLayout));
    }
    handleOnReload(); // 동기화도 그김에 한번 해줌
  }, []); // 빈배열 -> 컴포넌트 마운트 시 실행

  const handleOnReload = async () => {
    setOnReload(true);

    await checkAndSyncOnFirstLoad(true); // 동기화 로직 호출
    await initializeNotes(); // 노트 데이터 초기화
    await initializeCategories(); // 카테고리 데이터 초기화
    await initializeTags();
    setTimeout(() => {
      setOnReload(false);
    }, 1500);
  }

  // 레이아웃 변경 시 저장
  const handleLayoutChange = (sizes) => {
    setLayout(sizes);
    localStorage.setItem("note-layout", JSON.stringify(sizes));
  };

  const getListTitle = () => {
    if (isTrashed) {
      return '휴지통';
    }
    if (category) {
      return category;
    }
    return '전체보기';
  };

  const clearTrash = () => {
    const targetTrash = notes.filter(note => note.is_trashed).map(note => note._id);
    setNoteEvent({
      type: 'DELETE',
      payload: targetTrash,
    });
    router.push('/notes?view=trash', undefined, { shallow: true });
    // 라우팅 했다가 되돌아왔을때 중복실행을 막기 위해 noteEventAtom 상태 초기화
    setTimeout(() => {
      setNoteEvent(null);
    }, 0);
  }

  useEffect(() => {
    const activeCount = notes.filter(note => !note.is_trashed).length;
    const trashedCount = notes.filter(note => note.is_trashed).length;
    setNoteCount({ active: activeCount, trashed: trashedCount });
  }, [notes]);

  useEffect(() => {
    // 노트를 선택할 경우 작동
    if (id) {
      if(!notes.length) return; // 노트가 준비된다음 실행
      const selectedNote = notes.find((note) => note._id === id);
      if (selectedNote) {
        // 선택된 노트를 전역 상태로 설정
        setSelectedNoteState((prev) => ({ ...prev, ...selectedNote }));
        // 화면에 표시될 데이터 변경 -> 렌더링이 데이터보다 먼저 작동해서 화면 깜빡이던거 방지됨
        setSelectedNoteUploadFiles(selectedNote.uploadedFiles || []);
      } else {
        // 없는 글 이거나, 본인의 글이 아니면 url을 기본상태로 돌려놓음
        router.push('/notes', undefined, {shallow: true});
      }
    } else {
      setSelectedNoteState(defaultNoteStateAtom);
      setSelectedNoteUploadFiles([]);
    }
  }, [id, notes, setSelectedNoteState, setSelectedNoteUploadFiles]);



  return (
        <ResizablePanelGroup direction="horizontal" className="h-full max-h-[calc(100vh-48px)]  items-stretch" onLayout={handleLayoutChange}>
          <ResizablePanel defaultSize={layout[0]} minSize={10} className="flex flex-col">
            <div className="flex items-center px-4 py-2  justify-between">
              <h1 className="text-xl font-bold cursor-pointer" onClick={() => handleLayoutChange([23, 80])}>
                {getListTitle()}
              </h1>
              {!isTrashed ? (
                  !onReload ? (
                      <Button variant="outline"
                              className="flex flex-1 min-w-[77px] max-w-fit"
                              onClick={handleOnReload}>Reload</Button>
                  ) : (
                      <Button variant="outline"
                              className="flex flex-1 min-w-[77px] max-w-fit"
                              disabled>
                        <Loader2 className="animate-spin"/>
                      </Button>
                  )
              ) : (
                  <>
                  <Button variant="outline"
                          className="flex flex-1 min-w-[77px] max-w-fit"
                  onClick={clearTrash}>
                    휴지통 비우기
                  </Button>
                  </>
              )
              }
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <SearchFilter/>
                </div>
              </form>
            </div>
            <NoteList notes={filteredNotes} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={layout[1]}>
            {/* 로딩 중에도 기존 상태 유지 */}
            {selectedNoteState._id ? (
                <NoteDisplay/>
            ) : (
                <div className="p-8 text-center text-muted-foreground">선택된 노트가
                  없습니다.</div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
  );
}