import {useRouter} from "next/router";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {ScrollArea} from "@/components/ui/scroll-area";
import {ko} from "date-fns/locale";
import {format} from "date-fns";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from "@/components/ui/context-menu";
import {useAtom, useSetAtom} from "jotai/index";
import {
  defaultNoteStateAtom,
  noteEventAtom,
  saveNoteChangesAtom,
  selectedNoteStateAtom
} from "@/atoms/noteStateAtom";
import {FileType, FileCode, ArchiveRestore, ArchiveX} from "lucide-react";

export default function NoteList({notes}) {
  const router = useRouter();
  const [, setNoteEvent] = useAtom(noteEventAtom);
  const saveNoteChanges = useSetAtom(saveNoteChangesAtom);
  const setSelectedNoteState = useSetAtom(selectedNoteStateAtom);

  const handleNoteClick = (note) => {
    // URL에 선택한 노트 ID를 추가
    if (router.query.id === note._id) {
      router.push('/notes', undefined, {shallow: true});
    } else {
      router.push(`/notes?id=${note._id}`, undefined, {shallow: true});
    }
  };

  function customFormatDistanceToNow(date) {
    const now = new Date();
    const isSameYear = now.getFullYear() === date.getFullYear();
    const daysDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      return '어제'; // "1일 전"을 "어제"로 변경
    }

    if (daysDiff > 1) {
      // 2일 전부터는 날짜 그대로 출력
      return isSameYear
          ? format(date, 'MM월 dd일', {locale: ko}) // 같은 해라면 월-일
          : format(date, 'yyyy년 MM월 dd일', {locale: ko}); // 다른 해라면 년-월-일
    }

    const result = formatDistanceToNow(date, {addSuffix: true, locale: ko});
    return result.replace('약 ', ''); // "약" 제거
  }

  // Content 데이터 정제 함수
  const extractContentText = (contents) => {
    if (!contents || !Array.isArray(contents)) {
      return "";
    }
    return contents
    .map((content) => {
      // 각 객체의 children 배열에서 text 값만 추출해 합치기
      if (content.children && Array.isArray(content.children)) {
        return content.children.map((child) => child.text || "").join("");
      }
      return "";
    })
    .join(" "); // 섹션 간 텍스트는 공백으로 이어붙임
  };

  const handlePermanentDelete = (note) => {
    if (note.is_trashed) {
      setNoteEvent({
        type: 'DELETE',
        payload: [note._id],
      });
      router.push('/notes?view=trash', undefined, {shallow: true});
    } else if (!note.is_trashed) {
      const updatedFields = {is_trashed: true};
      saveNoteChanges({
        updatedFieldsList: [{id: note._id, ...updatedFields}],
      });
      setSelectedNoteState(defaultNoteStateAtom);
      router.push(`/notes`, undefined, {shallow: true}); // 휴지통으로 이동 후
    }
    setTimeout(() => {
      setNoteEvent(null);
    }, 0);
  };

  const restoreNote = (note) => {
    saveNoteChanges({
      updatedFieldsList: [{id: note._id, is_trashed: false}],
    })
    setSelectedNoteState(defaultNoteStateAtom);
    router.push(`/notes`, undefined, { shallow: true }); // 휴지통으로 이동 후
  }

  return (
      <ScrollArea className="h-screen">
        <div className="flex flex-col gap-2 p-4 pt-0">
          {notes
          .sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1
              : 0)) // is_pinned를 기준으로 정렬
          .map((note) => (
              <ContextMenu
                  key={note._id}
              >
                <ContextMenuTrigger>
                  <div className="border rounded-lg">
                  <button
                      className={cn(
                          "relative flex flex-col w-full items-start gap-2 p-3 text-left text-sm transition-all hover:bg-accent min-h-[116px] overflow-hidden",
                          router.query.id === note._id && "bg-muted" // URL의 ID와 매칭되면 스타일 적용
                      )}
                      onClick={() => handleNoteClick(
                          note)} // 노트 클릭 시 URL에 ID 추가
                  >
                    <div className="flex w-full flex-col gap-1">
                      <div className="flex items-center">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold">
                            {/*{note.mode === 'text' ? <FileType size={18} /> : <FileCode size={18} />}*/}
                            {note.title}
                          </div>
                          {note.is_pinned && (<span
                              className="flex h-2 w-2 rounded-full bg-blue-500"/>)}
                        </div>
                      </div>
                    </div>
                    <div className="line-clamp-2 text-xs text-muted-foreground">
                      {note.mode === 'editor' ? extractContentText(note.content)
                          : note.content}
                    </div>
                    <div
                        className={cn(
                            "absolute bottom-2 right-3 text-xs",
                            router.query.id === note._id
                                ? "text-foreground"
                                : "text-muted-foreground"
                        )}
                    >
                      {customFormatDistanceToNow(new Date(note.created_at), {
                        addSuffix: true,
                        locale: ko,
                      })}
                    </div>
                    <div className="absolute bottom-1 left-3 text-xs font-medium">
                      {note.category.name}
                    </div>
                  </button>
                  {note.tags.length ? (
                      <div
                          className="mt-auto flex flex-wrap w-full border-t p-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          {note.tags.map((tag) => (
                              <Badge className="cursor-pointer hover:bg-gray-700 hover:shadow hover:text-primary-foreground"
                                     key={tag._id} variant="secondary2">
                                {tag.name}
                              </Badge>
                          ))}
                        </div>
                      </div>
                  ) : null}
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  {note.is_trashed ? (
                      <ContextMenuItem onClick={() => restoreNote(note)}><ArchiveRestore />복원하기</ContextMenuItem>
                  ) : null}
                  <ContextMenuItem className="text-red-500 font-medium" onClick={() => handlePermanentDelete(note)}>
                    {note.is_trashed ?
                        <>
                          <ArchiveX /> {'영구삭제'}
                        </> : '휴지통으로'}
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
          ))}
        </div>
      </ScrollArea>
  );
}