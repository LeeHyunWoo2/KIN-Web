"use client";

import * as React from "react";
import {X} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {Command as CommandPrimitive} from "cmdk";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {tagListAtom} from "@/atoms/filterAtoms";
import {useAtomValue} from "jotai";
import { useSetAtom} from "jotai/index";
import {
  saveNoteChangesAtom,
  selectedNoteStateAtom
} from "@/atoms/noteStateAtom";
import {useEffect} from "react";


export default function TagSelector() {
  const inputRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState([]);
  const [inputValue, setInputValue] = React.useState("");
  const tagList = useAtomValue(tagListAtom);
  const saveNoteChanges = useSetAtom(saveNoteChangesAtom);
  const selectedNoteState = useAtomValue(selectedNoteStateAtom);

  const handleUnselect = React.useCallback((tag) => {
    setSelected((prev) => prev.filter((set) => set._id !== tag._id));
  }, []);

  useEffect(() => {
    setSelected(selectedNoteState.tags);
  }, [selectedNoteState]);

  const handleKeyDown = React.useCallback(
      (e) => {
        const input = inputRef.current;
        if (input) {
          if (e.key === "Delete" || e.key === "Backspace") {
            if (input.value === "") {
              setSelected((prev) => {
                const newSelected = [...prev];
                newSelected.pop();
                return newSelected;
              });
            }
          }
          if (e.key === "Escape") {
            input.blur();
          }
        }
      },
      []
  );

  const selectableTags = tagList.filter(
      (tag) => !selected.some((selectedTag) => selectedTag._id === tag._id)
  );

  const saveTagSet = () => {
    const updatedFields = { tags: selected};
    saveNoteChanges({
      updatedFieldsList: [{ id: selectedNoteState._id, ...updatedFields }],
    });
  }

  return (
      <Popover>
        {tagList.length > 0 ? (
        <PopoverTrigger asChild>
          <Button variant="outline">
            태그 선택
          </Button>
        </PopoverTrigger>
            ) : (
        <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm
                  font-medium pointer-events-none opacity-60 border  bg-background shadow-sm h-9 px-4 py-2">
          태그 없음
        </div>)}
        <PopoverContent className="w-auto min-w-[380px]">
          <div className="flex items-center justify-between mb-3">
            <Button className="w-1/5 border-red-300" variant="outline" onClick={() => setSelected([])}>초기화</Button>
            <Button className="w-1/5" onClick={() => saveTagSet()}>적용</Button>
          </div>
          <Command
              onKeyDown={handleKeyDown}
              className="overflow-visible bg-transparent"
          >
            <div
                className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <div className="flex flex-wrap gap-1">
                {selected.map((tag) => {
                  return (
                      <Badge key={tag._id} variant="secondary"
                             className="cursor-pointer"
                             onClick={() => handleUnselect(tag)}>
                        {tag.name}
                        <button
                            className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleUnselect(tag);
                              }
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onClick={() => handleUnselect(tag)}
                        >
                          <X className="h-3 w-3 text-muted-foreground"/>
                        </button>
                      </Badge>
                  );
                })}

                <CommandPrimitive.Input
                    ref={inputRef}
                    value={inputValue}
                    onValueChange={setInputValue}
                    onBlur={() => setOpen(false)}
                    onFocus={() => setOpen(true)}
                    placeholder="클릭 or 방향키와 Enter로 선택"
                    className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div className="relative mt-2">
              <CommandList>
                {open && selectableTags.length > 0 ? (
                    <div
                        className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                      <CommandGroup className="h-full overflow-auto">
                        {selectableTags.map((tag) => {
                          return (
                              <CommandItem
                                  key={tag._id}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  onSelect={(value) => {
                                    setInputValue("");
                                    setSelected((prev) => [...prev, tag]);
                                  }}
                                  className={"cursor-pointer"}
                              >
                                {tag.name}
                              </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </div>
                ) : null}
              </CommandList>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
  );
}