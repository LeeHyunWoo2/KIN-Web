import * as React from "react";
import {X, Tags} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Command, CommandGroup, CommandItem, CommandList} from "@/components/ui/command";
import {Command as CommandPrimitive} from "cmdk";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {
  tagListAtom,
  selectedTagsAtom,
  filterModeAtom
} from "@/atoms/filterAtoms";
import {useAtom, useAtomValue} from "jotai";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";

export const TagFilter = () => {
  const inputRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const tagList = useAtomValue(tagListAtom); // 전체 태그 리스트
  const [selectedTags, setSelectedTags] = useAtom(selectedTagsAtom); // 선택된 태그들을 Jotai로 관리
  const [filterMode, setFilterMode] = useAtom(filterModeAtom);

  const handleUnselect = (tag) => {
    setSelectedTags((prev) => prev.filter(selected => selected._id !== tag._id));
  };

  const selectableTags = tagList.filter(
      (tag) => !selectedTags.some((selectedTag) => selectedTag._id === tag._id)
  );

  const handleSelectTag = (tag) => {
    setSelectedTags((prev) => [...prev, tag]); // 선택된 태그 업데이트
    setInputValue(''); // 입력값 초기화
  };

  const handleKeyDown = (e) => {
    const input = inputRef.current;
    if (input) {
      // 백스페이스로 마지막 선택 태그 삭제
      if ((e.key === 'Delete' || e.key === 'Backspace') && input.value === '') {
        setSelectedTags((prev) => {
          const newSelected = [...prev];
          newSelected.pop(); // 마지막 선택된 태그 제거
          return newSelected;
        });
      }
      if (e.key === 'Escape') {
        input.blur();
      }
    }
  };

  return (
      <Popover>
        {tagList.length > 0 ? (
        <PopoverTrigger asChild>
          <Button 
              variant="outline"
              style={{
                backgroundColor: selectedTags.length > 0 ? "#e0f2fe" : "transparent",
                borderColor: selectedTags.length > 0 ? "#7dd3fc" : "inherit",
                color: selectedTags.length > 0 ? "#2563eb" : "inherit",
                boxShadow: selectedTags.length > 0 ? "0 0 6px #7dd3fc" : "none",
              }}
          ><Tags/>필터</Button>
        </PopoverTrigger>
        ) : (
            <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm
                  font-medium pointer-events-none opacity-60 border  bg-background shadow-sm h-9 px-4 py-2">
              태그 없음
            </div>)}
        <PopoverContent className="w-auto min-w-[380px] border-zinc-300 border-2" side="right" align="start">
          <div className="flex items-center justify-between mb-3">

            <RadioGroup
                value={filterMode ? 'and' : 'or'}
                onValueChange={(value) => setFilterMode(value === 'and')}
                defaultValue="and"
                className="flex"
            >
              <label
                  htmlFor="r1"
                  className="flex items-center gap-2 px-2 py-1 border rounded-md font-medium text-sm cursor-pointer hover:bg-gray-100"
              >
                <RadioGroupItem value="and" id="r1"/>
                <span>AND</span>
              </label>
              <label
                  htmlFor="r2"
                  className="flex items-center gap-2 px-2 py-1 border rounded-md font-medium text-sm cursor-pointer hover:bg-gray-100"
              >
                <RadioGroupItem value="or" id="r2"/>
                <span>OR</span>
              </label>
            </RadioGroup>
            <Button className="w-1/5 border-red-300" variant="outline"
                    onClick={() => setSelectedTags([])}>초기화</Button>
          </div>
          <Command
              className="overflow-visible bg-transparent"
              onKeyDown={handleKeyDown}
          >
            <div
                className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <div className="flex flex-wrap gap-1">
                {selectedTags.map((tag) => (
                    <Badge key={tag._id} variant="secondary" className="cursor-pointer" onClick={() => handleUnselect(tag)}>
                      {tag.name}
                      <button
                          className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onClick={() => handleUnselect(tag)}
                      >
                        <X className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </Badge>
                ))}
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
                {open && selectableTags.length > 0 && (
                    <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                      <CommandGroup className="h-full overflow-auto">
                        {selectableTags.map((tag) => (
                            <CommandItem
                                key={tag._id}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                onSelect={() => handleSelectTag(tag)}
                                className="cursor-pointer"
                            >
                              {tag.name}
                            </CommandItem>
                        ))}
                      </CommandGroup>
                    </div>
                )}
              </CommandList>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
  );
};