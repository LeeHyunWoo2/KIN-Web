import React, {useEffect} from 'react';
import {Search} from "lucide-react";
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
  noteListAtom,
  selectedNoteStateAtom
} from "@/atoms/noteStateAtom";
import {initializeNotesAtom} from "@/lib/notes/noteState";

export default function NoteContainer({ defaultLayout = [240, 440, 655] }) {
  const router = useRouter();
  const { id, view } = router.query; // URL에서 id와 view 가져옴
  const [notes] = useAtom(noteListAtom);
  const [, initializeNotes] = useAtom(initializeNotesAtom);
  const [selectedNoteState, setSelectedNoteState] = useAtom(selectedNoteStateAtom);

  useEffect(() => {
    initializeNotes(); // 노트 데이터 초기화
  }, [initializeNotes]);

  useEffect(() => {
    if (id) {
      // 선택된 노트의 통합 상태를 설정 (노트 id를 기준)
      const selectedNote = notes.find((note) => note._id === id);
      if (selectedNote) {
        setSelectedNoteState(prev => ({ prev, ...selectedNote }));
      }
    }
  }, [id, setSelectedNoteState]);

  // view가 trash일 경우 휴지통 필터 적용
  const filteredNotes = view === 'trash'
      ? notes.filter((note) => note.is_trashed) // 휴지통 필터
      : notes.filter((note) => !note.is_trashed); // 일반 필터

  return (
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup direction="horizontal" className="h-full max-h-[800px] items-stretch">
          <ResizablePanel defaultSize={defaultLayout[0]} minSize={27}>
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Notes</h1>
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
          <ResizablePanel defaultSize={defaultLayout[2]}>
            { id && (
            <NoteDisplay  />
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
        <Separator/>
      </TooltipProvider>
  );
}
