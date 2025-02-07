"use client"

import React, {useEffect, useState} from 'react';
import {useAtomValue, useSetAtom} from 'jotai';
import {
  categoryListAtom,
  categoryTreeAtom,
  selectedCategoryAtom,
  selectedCategoryNameAtom
} from '@/atoms/filterAtoms';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {
  ChevronRight,
  CopyPlus,
  Dot,
  ListPlus,
  MoreHorizontal,
  SquarePen,
  Trash2
} from "lucide-react";
import {Input} from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import {
  buildCategoryTree,
  calculateCategoryDepth
} from "@/lib/notes/categoryUtils";
import {
  createCategory,
  deleteCategory,
  updateCategory
} from "@/services/notes/categoryAPIService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {useAtom} from "jotai/index";
import {
  initializeCategoriesAtom,
  initializeNotesAtom
} from "@/lib/notes/noteState";
import {
  defaultNoteStateAtom,
  selectedNoteStateAtom
} from "@/atoms/noteStateAtom";
import {useRouter} from "next/router";

function CategoryItem({category}) {
  const router = useRouter();
  const categories = useAtomValue(categoryListAtom); // 카테고리 구조 상태
  const [, initializeNotes] = useAtom(initializeNotesAtom);
  const [, initializeCategories] = useAtom(initializeCategoriesAtom);
  const setSelectedCategory = useSetAtom(selectedCategoryAtom);
  const setSelectedCategoryName = useSetAtom(selectedCategoryNameAtom);
  const setSelectedNoteState = useSetAtom(selectedNoteStateAtom);
  const [isOpen, setIsOpen] = useState(false);

  const handleCategorySelect = (categoryId, categoryName) => {
    setSelectedCategory(categoryId); // 선택된 카테고리를 전역 상태에 저장
    setSelectedCategoryName(categoryName);
  };

  const [isAddCategoryPopoverOpen, setIsAddCategoryPopoverOpen] = useState(
      false);
  const [isRenameCategoryPopoverOpen, setIsRenameCategoryPopoverOpen] = useState(
      false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [renamedCategoryName, setRenamedCategoryName] = useState('');

  // 마우스 위치 상태
  const [popoverPosition, setPopoverPosition] = useState({x: 0, y: 0});

  const handlePopoverOpen = (type) => (event) => {
    const rect = event.currentTarget.getBoundingClientRect(); // 클릭된 버튼의 위치
    if (type === 'add'){
      setPopoverPosition({x: rect.left, y: rect.bottom}); // 버튼 기준으로 Popover 위치 설정
    setIsAddCategoryPopoverOpen(true);
    } else if (type === 'rename'){
      setPopoverPosition({x: rect.left, y: rect.bottom});
      setIsRenameCategoryPopoverOpen(true);
    }
  };

  const handleAddSubCategory = async (parentId) => {
    try {
      // 1. 깊이 제한 확인
      const currentDepth = calculateCategoryDepth(parentId, categories);
      if (currentDepth > 3) {
        alert('카테고리는 최대 3단계까지만 추가할 수 있습니다.');
        return;
      }

      // 2. 새 카테고리 생성
      const newCategoryData = {
        name: newCategoryName,
        parent_id: parentId,
      };
      await createCategory(newCategoryData);

      // 3. 상태 업데이트
      setNewCategoryName(''); // 입력 필드 초기화
      await initializeCategories();
      setIsAddCategoryPopoverOpen(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleRenameCategory = async () => {
    const updateCategoryData = {
      name: renamedCategoryName,
      parent_id: category.parent_id,
    }
    await updateCategory(category._id, updateCategoryData);
    setRenamedCategoryName('');
    await initializeCategories();
    setIsRenameCategoryPopoverOpen(false); // 팝오버 닫기
  };

  const hasChildren = category.children && category.children.length > 0;
  // className={hasChildren ? "main-style" : "sub-style"} 이런식으로 사용 예정
  
// 삭제
  const handleDeleteCategory = async (categoryId) => {
    try {
      // 서버와 IndexedDB에서 삭제
      await deleteCategory(categoryId, categories);

      setSelectedNoteState(defaultNoteStateAtom);
      await router.push(`/notes`, undefined, {shallow: true});
      // 노트와 카테고리 상태 초기화
      await initializeNotes();
      await initializeCategories();
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 문제가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (isRenameCategoryPopoverOpen) {
      setRenamedCategoryName(category.name);
    }
  }, [isRenameCategoryPopoverOpen]);

  return (
      <Collapsible
          asChild
          key={category._id}
          className="group/collapsible"
          onOpenChange={setIsOpen}
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={category.name}  onClick={() => handleCategorySelect(category._id, category.name)}>
              {hasChildren ? (
                  <ChevronRight
                      className={`transition-transform duration-200 ${isOpen
                          ? "rotate-90" : ""}`}/>
              ) : (<Dot/>)}
              <span>{category.name}</span>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          {hasChildren && (
              <CollapsibleContent>
                <SidebarMenuSub>
                  {category.children.map((category) => (
                      <CategoryItem key={category._id}
                                    category={category}/>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction showOnHover>
                <MoreHorizontal/>
                <span className="sr-only">More</span>
              </SidebarMenuAction>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-48 rounded-lg"
                side="bottom"
                align="end"
            >
              {/* 하위 카테고리 추가 */}
              <DropdownMenuItem
                  onMouseDown={handlePopoverOpen('add')} // 마우스 위치 설정
              >
                <CopyPlus className="text-muted-foreground"/>
                <span>하위 카테고리 추가</span>
              </DropdownMenuItem>

              {/* 이름 변경 */}
              <DropdownMenuItem
                  onMouseDown={handlePopoverOpen('rename')}
              >
                <SquarePen className="text-muted-foreground"/>
                <span>이름 변경</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator/>
              <DropdownMenuItem  onClick={() => handleDeleteCategory(category._id)}>
                <Trash2 className="text-muted-foreground"/>
                <span className="text-red-500">카테고리 삭제</span>
              </DropdownMenuItem>
            </DropdownMenuContent>

            {/* 하위 카테고리 추가 팝오버 */}
            <Popover open={isAddCategoryPopoverOpen}
                     onOpenChange={setIsAddCategoryPopoverOpen}>
              <PopoverTrigger asChild>
                <span className="hidden"/>
              </PopoverTrigger>
              <PopoverContent
                  className="w-80"
                  style={{
                    position: 'absolute',
                    top: `${popoverPosition.y}px`,
                    left: `${popoverPosition.x}px`,
                  }}
                  onFocusOutside={(event) => {
                    event.preventDefault();
                  }}
              >
                <div className="grid gap-1">
                  <div className="space-y-2">
                    <h5 className="font-medium leading-none">하위 카테고리 추가</h5>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-1 items-center gap-2">
                      <p className="text-sm text-muted-foreground">엔터(Enter)키로
                        적용</p>
                      <Input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="카테고리 이름"
                          className="col-span-2 h-8"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && isAddCategoryPopoverOpen) {
                              handleAddSubCategory(category._id);
                            }
                          }}
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* 이름 변경 팝오버 */}
            <Popover open={isRenameCategoryPopoverOpen}
                     onOpenChange={(open) => {
                       setIsRenameCategoryPopoverOpen(open);
                       setRenamedCategoryName(category.name);
                     }}>
              <PopoverTrigger asChild>
                <span className="hidden"/>
              </PopoverTrigger>
              <PopoverContent
                  className="w-80"
                  style={{
                    position: 'absolute',
                    top: `${popoverPosition.y}px`,
                    left: `${popoverPosition.x}px`,
                  }}
                  onFocusOutside={(event) => {
                    event.preventDefault();
                  }}
              >
                <div className="grid gap-1">
                  <div className="space-y-2">
                    <h5 className="font-medium leading-none">이름 변경</h5>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-1 items-center gap-2">
                      <p className="text-sm text-muted-foreground">엔터(Enter)키로
                        적용</p>
                      <Input
                          type="text"
                          value={renamedCategoryName}
                          onChange={(e) => setRenamedCategoryName(
                              e.target.value)}
                          placeholder="새 이름 입력"
                          className="col-span-2 h-8"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && isRenameCategoryPopoverOpen) {
                              handleRenameCategory();
                            }
                          }}
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </DropdownMenu>
        </SidebarMenuItem>
      </Collapsible>
  );
}

export default function CategorySidebar() {
  const categories = useAtomValue(categoryListAtom); // 카테고리 구조 상태
  const [newCategoryName, setNewCategoryName] = useState("");
  const [, initializeCategories] = useAtom(initializeCategoriesAtom);
  const [categoryTree, setCategoryTree] = useAtom(categoryTreeAtom);

  useEffect(() => {
    setCategoryTree(buildCategoryTree(categories));
  }, [categories]);

  const handleAddCategory = async (parentId) => {
    try {
      // 1. 깊이 제한 확인
      const currentDepth = calculateCategoryDepth(parentId, categories);
      if (currentDepth > 3) {
        alert('카테고리는 최대 3단계까지만 추가할 수 있습니다.');
        return;
      }

      // 2. 새 카테고리 생성
      const newCategoryData = {
        name: newCategoryName,
        parent_id: parentId || null, // 상위 카테고리가 없으면 null
      };
      await createCategory(newCategoryData);

      // 3. 상태 업데이트
      setNewCategoryName(''); // 입력 필드 초기화
      await initializeCategories();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
      <>
        <SidebarContent>
          <SidebarGroup>
            <div className="flex justify-between">
              <SidebarGroupLabel>카테고리</SidebarGroupLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <SidebarGroupLabel>
                    <div className="step3">
                      <button
                          className="rounded-md p-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                        <ListPlus className="max-w-5"/>
                      </button>
                    </div>
                  </SidebarGroupLabel>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-1">
                      <div className="space-y-2">
                        <h5 className="font-medium leading-none">최상위 카테고리
                          추가</h5>
                      </div>
                      <div className="grid gap-2">
                        <div className="grid grid-cols-1 items-center gap-2">
                          <p className="text-sm text-muted-foreground">
                            엔터(Enter)키로 적용
                          </p>
                          <Input
                              type="text"
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(
                                  e.target.value)}
                              placeholder="카테고리 이름"
                              className="col-span-2 h-8"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddCategory()
                                }
                              }}
                          />
                        </div>
                      </div>
                    </div>
                </PopoverContent>
              </Popover>
            </div>
            <SidebarMenu>
              {categoryTree.map((category) => (
                  <CategoryItem key={category._id} category={category}/>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </>
  );
}