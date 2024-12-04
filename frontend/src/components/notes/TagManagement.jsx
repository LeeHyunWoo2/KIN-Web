import React, { useState} from "react";
import {X, Tag} from 'lucide-react';
import {
  Dialog,
  DialogContent, DialogDescription,
  DialogHeader, DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {SidebarGroupLabel, SidebarMenuButton} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Input} from "@/components/ui/input";
import {createTag, deleteTag} from "@/services/notes/tagService";
import {useAtomValue} from "jotai";
import {initializeNotesAtom, initializeTagsAtom} from "@/lib/notes/noteState";
import {tagListAtom} from "@/atoms/filterAtoms";
import {useSetAtom} from "jotai/index";

export default function TagManagerModal() {
  const [newTagName, setNewTagName] = useState("");
  const initializeTags = useSetAtom(initializeTagsAtom);
  const initializeNotes = useSetAtom(initializeNotesAtom);
  const tagList = useAtomValue(tagListAtom);

  const handleAddTag = async () => {
    try {
      if (newTagName.length < 16) {
        const tagData = {
          name:newTagName,
        }
        await createTag(tagData);
          setNewTagName("");
          await initializeTags();
      } else {
        alert('자릿수 초과');
      }

    } catch (error) {
      console.error(error.message);
    }
  }

  const handleDeleteTag = async (tagId) => {
    try {
      await deleteTag(tagId);
      await initializeTags();
      await initializeNotes();
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
      <Dialog>
        <DialogTrigger asChild>
          <SidebarMenuButton variant="ghost">
            <Tag/> 태그 관리
          </SidebarMenuButton>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="mb-4">
            <DialogTitle className="flex justify-between items-center">내 태그
               ({tagList.length}) <X/></DialogTitle>
            <DialogDescription>
              모든 노트에서 사용할 태그를 관리합니다.
            </DialogDescription>
          </DialogHeader>
          <main>
            <div className="flex flex-wrap gap-1">
              {tagList.map((tag) => (
                  <div
                      key={tag._id}
                      className="flex items-center cursor-pointer justify-center mx-0.5 px-3 py-1 bg-gray-100 text-gray-700 border border-gray-300 rounded-md text-sm whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{minWidth: "80px", maxWidth: "calc(100% - 16px)"}}
                      onClick={() => {handleDeleteTag(tag._id)}}
                  >
                    {tag.name}
                  </div>
              ))}
            </div>
          </main>
          <div className="flex justify-end mt-4">
            <Popover>
              <PopoverTrigger asChild>
                <SidebarGroupLabel>
                  <Button>태그 추가</Button>
                </SidebarGroupLabel>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-1">
                  <div className="space-y-2">
                    <h5 className="font-medium leading-none">태그 추가</h5>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-1 items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        엔터(Enter)키로 적용
                      </p>
                      <Input
                          type="text"
                          value={newTagName}
                          maxLength="15"
                          onChange={(e) => setNewTagName(e.target.value)}
                          placeholder="태그 이름 최대 15자"
                          className="col-span-2 h-8"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddTag()
                            }
                          }}
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </DialogContent>
      </Dialog>
  );
}
