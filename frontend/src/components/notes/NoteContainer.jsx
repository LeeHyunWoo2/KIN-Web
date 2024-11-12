import React, { useEffect } from 'react';
import { Search } from "lucide-react";
import { useRouter } from 'next/router';
import NoteDisplay from './NoteDisplay';
import NoteList from "@/components/notes/NoteList";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import {Tabs, TabsContent} from "@/components/ui/tabs";
import {Separator} from "@/components/ui/separator";
import {TooltipProvider} from "@/components/ui/tooltip";
import {Input} from "@/components/ui/input";
import { useAtom } from 'jotai';
import {noteListAtom, selectedNoteAtom} from "@/atoms/noteStateAtom";
import {initializeNotesAtom} from "@/lib/notes/noteState";

export default function NoteContainer({
  defaultLayout = [240, 440, 655]
}) {
  const router = useRouter();
  const { id } = router.query; // URL에서 id 가져옴
  const [notes] = useAtom(noteListAtom);
  const [, setSelectedNote] = useAtom(selectedNoteAtom);
  const [, initializeNotes] = useAtom(initializeNotesAtom);

  useEffect(() => {
    initializeNotes(); // 노트 데이터 초기화
  }, [initializeNotes]);

  useEffect(() => {
    if (id) {
      setSelectedNote(id);
    }
  }, [id, setSelectedNote]);

  const selectedNote = notes.find((note) => note._id === id);

  return (


  <TooltipProvider delayDuration={0}>
    <ResizablePanelGroup
        direction="horizontal"
        className="h-full max-h-[800px] items-stretch"
    >
      <ResizablePanel defaultSize={defaultLayout[0]} minSize={27}>
        <Tabs defaultValue="all">

          <div className="flex items-center px-4 py-2">
            <h1 className="text-xl font-bold">Inbox</h1>
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

          <TabsContent value="all" className="m-0">
            <NoteList notes={notes}/>
          </TabsContent>
{/*          <TabsContent value="is_pinned" className="m-0">
            <NoteList items={noteList.filter((item) => !item.is_pinned)}/>
          </TabsContent> 이 부분은 언젠가 리스트 전환이나 여러가지로 응용 가능할거같아서 지우지 않고 주석처리함*/}

        </Tabs>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[2]}>
        <NoteDisplay note={selectedNote} />
      </ResizablePanel>
    </ResizablePanelGroup>
  </TooltipProvider>
  );
}