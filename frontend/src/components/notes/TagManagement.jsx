import React, { useState} from "react";
import {Tag} from 'lucide-react';
import {SidebarGroupLabel, SidebarMenuButton} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Input} from "@/components/ui/input";
import {createTag, deleteTag} from "@/services/notes/tagService";
import {useAtomValue} from "jotai";
import {initializeNotesAtom, initializeTagsAtom} from "@/lib/notes/noteState";
import {tagListAtom} from "@/atoms/filterAtoms";
import {useSetAtom} from "jotai/index";
import {noteListAtom} from "@/atoms/noteStateAtom";
import {
  AlertDialog, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {motion} from "framer-motion";

export default function TagManagerModal() {
  const [newTagName, setNewTagName] = useState("");
  const initializeTags = useSetAtom(initializeTagsAtom);
  const initializeNotes = useSetAtom(initializeNotesAtom);
  const tagList = useAtomValue(tagListAtom);
  const noteList = useAtomValue(noteListAtom);
  const [targetTagId, setTargetTagId] = useState(null);
  const [page, setPage] = useState(0);

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

  const checkTagUsage = (tagId) => {
    const notesWithTag = noteList.filter(note =>
        note.tags.some(tag => tag._id === tagId)
    );
    if (notesWithTag.length > 0) {
      setTargetTagId(tagId);
      setPage(1);
    }
  }

  const confirmDeleteTag = async () => {
    try {
      await deleteTag(targetTagId);
      await initializeTags();
      await initializeNotes();
      setPage(0);
      setTargetTagId(null);
    } catch (error) {
      console.error(error.message);
    }
  }

  // TODO : dialog 컴포넌트 ForgotPassword에 있는것처럼 변경하기

  return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <SidebarMenuButton variant="ghost">
            <Tag/> 태그 관리
          </SidebarMenuButton>
        </AlertDialogTrigger>
          <AlertDialogContent className="overflow-hidden">
        <motion.div
            key={page}
            initial={page === 0 ? false : {x: 50, opacity: 0}}
            animate={{x: 0, opacity: 1}}
            exit={{x: -50, opacity: 0}}
            transition={{duration: 0.2}}
        >
          {page === 0 && (
              <>
                <AlertDialogHeader className="mb-4">
                  <AlertDialogTitle
                      className="flex justify-between items-center">내 태그
                    ({tagList.length})</AlertDialogTitle>
                  <AlertDialogDescription>
                    모든 노트에서 사용할 태그를 관리합니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                  <div className="flex flex-wrap gap-1">
                    {tagList.map((tag) => (
                        <div
                            key={tag._id}
                            className="flex items-center cursor-pointer justify-center mx-0.5 px-3 py-1 bg-gray-100 text-gray-700 border border-gray-300 rounded-md text-sm whitespace-nowrap overflow-hidden text-ellipsis"
                            style={{
                              minWidth: "80px",
                              maxWidth: "calc(100% - 16px)"
                            }}
                            onClick={() => {
                              checkTagUsage(tag._id)
                            }}
                        >
                          {tag.name}
                        </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <AlertDialogCancel>닫기</AlertDialogCancel>
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
              </>
          )}
          {page === 1 && (
              <>
                <AlertDialogHeader>
                  <AlertDialogTitle>태그 삭제</AlertDialogTitle>
                  <AlertDialogDescription>
                    이 태그를 삭제하면 관련된 모든 노트에서 해당 태그가 제거됩니다.<br/>
                    삭제를 진행하시겠습니까?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Button onClick={confirmDeleteTag} variant="destructive">삭제
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                    setPage(0)
                    setTargetTagId(null)
                  }}>취소
                  </Button>
                </AlertDialogFooter>
                </>
          )}
        </motion.div>
        </AlertDialogContent>
      </AlertDialog>
);
}