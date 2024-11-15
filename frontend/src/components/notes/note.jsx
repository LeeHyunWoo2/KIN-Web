import React, {useState} from "react";
import {Search} from "lucide-react";
import {NoteDisplay} from "./note-display";
import {NoteList} from "./note-list";
import {notes as initialNotes} from "@/lib/notes/data";
import {Separator} from "@/components/ui/separator";
import {Input} from "@/components/ui/input";
import {Tabs, TabsContent} from "@/components/ui/tabs";
import {TooltipProvider} from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {router} from "next/client";

export default function Note({
  notes = initialNotes,
  defaultLayout = [240, 440, 655],
}) {
  const [noteList, setNoteList] = useState(notes); // 노트 리스트 상태

  // 선택된 노트 정보 가져오기
  const selectedNote = noteList.find((item) => item.id === router.query.id);

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
                <NoteList items={noteList}/>
              </TabsContent>
              <TabsContent value="is_pinned" className="m-0">
                <NoteList items={noteList.filter((item) => !item.is_pinned)}/>
              </TabsContent>

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