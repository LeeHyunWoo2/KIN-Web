import React from 'react';
import {useAtom, useAtomValue, useSetAtom} from 'jotai';
import {
  isTrashedAtom,
  searchTermAtom,
} from '@/atoms/filterAtoms';
import {SidebarMenuBadge, SidebarMenuButton} from "@/components/ui/sidebar";
import {Inbox, Trash2, Undo2} from "lucide-react";
import {noteCountAtom} from "@/atoms/noteStateAtom";
import {resetFiltersAtom} from "@/lib/notes/filterNotes";
import {Input} from "@/components/ui/input";
import {TagFilter} from "@/components/notes/TagFilter";

// 전체보기
const ListView = () => {
  const resetFilters = useSetAtom(resetFiltersAtom);
  const noteCount = useAtomValue(noteCountAtom);

  return (
      <SidebarMenuButton onClick={resetFilters}>
        <Inbox/><span>전체 보기</span><SidebarMenuBadge className="text-sm"> {noteCount.active} </SidebarMenuBadge>
      </SidebarMenuButton>
  );
};

// 휴지통
const TrashFilter = () => {
  const [isTrashed, setIsTrashed] = useAtom(isTrashedAtom);
  const noteCount = useAtomValue(noteCountAtom);

  return (
      <SidebarMenuButton className="inline-flex items-center w-full rounded-md font-medium transition-colors outline-none" onClick={() => setIsTrashed(prev => !prev)}>
        {
          isTrashed ? (
                  <>
                    <Undo2/><span>돌아가기</span>
                  </>
              )
              : (
                  <>
                    <Trash2/><span>휴지통</span><SidebarMenuBadge className="text-sm"> {noteCount.trashed} </SidebarMenuBadge>
                  </>
              )
        }
      </SidebarMenuButton>
  );
};

// 검색
const SearchFilter = () => {
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);

  return (
      <div className="flex items-center gap-2">
      <Input
          type="text"
          className="pl-8"
          value={searchTerm}
          placeholder="제목으로 검색"
          onChange={(e) => setSearchTerm(e.target.value)}
      />
        <TagFilter/>
      </div>
  );
};

export {ListView, TrashFilter, SearchFilter}; // 구조 분해 할당 방식