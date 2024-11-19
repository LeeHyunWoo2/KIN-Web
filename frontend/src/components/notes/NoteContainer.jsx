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
import {TooltipProvider} from "@/components/ui/tooltip";
import {Input} from "@/components/ui/input";
import {useAtom} from 'jotai';
import {
  noteCountAtom,
  noteListAtom,
  selectedNoteStateAtom
} from "@/atoms/noteStateAtom";
import {
  initializeCategoriesAtom,
  initializeNotesAtom
} from "@/lib/notes/noteState";
import {Button} from "@/components/ui/button";
import {checkAndSyncOnFirstLoad} from "@/services/user/syncService";

export default function NoteContainer({ defaultLayout }) {
  const router = useRouter();
  const { id, view } = router.query; // URL에서 id와 view 가져옴
  const [notes] = useAtom(noteListAtom);
  const [, initializeNotes] = useAtom(initializeNotesAtom);
  const [, initializeCategories] = useAtom(initializeCategoriesAtom);
  const [, setSelectedNoteState] = useAtom(selectedNoteStateAtom);
  const [, setNoteCount] = useAtom(noteCountAtom);
  const [onReload, setOnReload] = useState(false);

  // 로딩 상태 관리
  const [currentNote, setCurrentNote] = useState(null); // 현재 표시 중인 노트
  const [layout, setLayout] = useState(() => {
    // 로컬스토리지에서 값을 가져오고, 없으면 기본값 설정
    const savedLayout = localStorage.getItem("note-layout");
    return savedLayout ? JSON.parse(savedLayout) : defaultLayout || [20, 80];
  });

  // 로컬스토리지에서 레이아웃 초기값 불러옴
  useEffect(() => {
    const savedLayout = localStorage.getItem("note-layout");
    if (savedLayout) {
      setLayout(JSON.parse(savedLayout));
    }
  }, []);

  const handleOnReload = async () => {
    setOnReload(true);
    await checkAndSyncOnFirstLoad(true); // 동기화 로직 호출
    setTimeout(() => {
      setOnReload(false);
    }, 1500);
  }

  // 레이아웃 변경 시 저장
  const handleLayoutChange = (sizes) => {
    setLayout(sizes);
    localStorage.setItem("note-layout", JSON.stringify(sizes));
  };

  useEffect(() => {
    initializeNotes(); // 노트 데이터 초기화
    initializeCategories(); // 카테고리 데이터 초기화
  }, [initializeNotes, initializeCategories]);

  useEffect(() => {
    const activeCount = notes.filter(note => !note.is_trashed).length;
    const trashedCount = notes.filter(note => note.is_trashed).length;
    setNoteCount({ active: activeCount, trashed: trashedCount });
  }, [notes]);

  useEffect(() => {
    if (id) {
      const selectedNote = notes.find((note) => note._id === id);
      if (selectedNote) {
        // 전역 상태 업데이트
        setSelectedNoteState((prev) => ({ ...prev, ...selectedNote }));
        // 화면에 표시될 데이터 변경 -> 렌더링이 데이터보다 먼저 작동해서 화면 깜빡이던거 방지됨
        setCurrentNote(selectedNote);
      }
    }
  }, [id, notes, setSelectedNoteState]);


  // view가 trash일 경우 휴지통 필터 적용
  const filteredNotes = view === 'trash'
      ? notes.filter((note) => note.is_trashed) // 휴지통 필터
      : notes.filter((note) => !note.is_trashed); // 일반 필터

  return (
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup direction="horizontal" className="h-full max-h-[840px] items-stretch" onLayout={handleLayoutChange}>
          <ResizablePanel defaultSize={layout[0]} minSize={10} className="flex flex-col">
            <div className="flex items-center px-4 py-2  justify-between">
              <h1 className="text-xl font-bold cursor-pointer" onClick={() => handleLayoutChange([20, 80])}>Notes</h1>
              { !onReload ? (
              <Button variant="outline"  className="flex flex-1 min-w-[77px] max-w-fit" onClick={handleOnReload}>Reload</Button>
            ) : (
              <Button variant="outline"  className="flex flex-1 min-w-[77px] max-w-fit" disabled>
                <Loader2 className="animate-spin" />
              </Button>
              )}
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <NoteList notes={filteredNotes} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={layout[1]}>
            {/* 로딩 중에도 기존 상태 유지 */}
            {currentNote && (
                <NoteDisplay note={currentNote} />
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
        <Separator/>
      </TooltipProvider>
  );
}
