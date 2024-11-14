import {useRouter} from "next/router";
import {useAtom} from 'jotai';
import {
  selectedNoteAtom,
  noteTitleAtom,
  noteContentAtom, noteCountAtom
} from "@/atoms/noteStateAtom";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {ScrollArea} from "@/components/ui/scroll-area";
import {useEffect} from "react";

export default function NoteList({notes}) {
  const router = useRouter();
  const [selectedNote, setSelectedNote] = useAtom(selectedNoteAtom); // 선택된 노트 설정
  const [title] = useAtom(noteTitleAtom); // 실시간 리스트 반영을 위한 atom 구독
  const [content] = useAtom(noteContentAtom);
  const [, setNoteCount] = useAtom(noteCountAtom);

  const handleNoteClick = (note) => {
    // URL에 선택한 노트 ID를 추가
    if (!note.is_trashed) {
      router.push(`/notes?id=${note._id}`, undefined, {shallow: true});
    } else {
      router.push(`/notes?id=${note._id}&view=trash`, undefined, {shallow: true});
    }
  };

  useEffect(() => {
    const activeCount = notes.filter(note => !note.is_trashed).length;
    const trashedCount = notes.filter(note => note.is_trashed).length;
    setNoteCount({ active: activeCount, trashed: trashedCount });
  }, [notes]);

  return (
      <ScrollArea className="h-screen">
        <div className="flex flex-col gap-2 p-4 pt-0">
          {notes.map((note) => (
              <button
                  key={note._id}
                  className={cn(
                      "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent min-h-[116px]",
                      router.query.id === note._id && "bg-muted" // URL의 ID와 매칭되면 스타일 적용
                  )}
                  onClick={() => handleNoteClick(note)} // 노트 클릭 시 URL에 ID 추가
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{note._id === selectedNote ? title : note.title}</div> {/*선택된 노트는 제목 실시간 반영*/}
                    </div>
                    <div
                        className={cn(
                            "ml-auto text-xs",
                            router.query.id === note._id
                                ? "text-foreground"
                                : "text-muted-foreground"
                        )}
                    >
                      {formatDistanceToNow(new Date(note.created_at), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
                <div className="line-clamp-2 text-xs text-muted-foreground">
                  {note._id === selectedNote ? content.substring(0, 300) : note.content.substring(0, 300)}
                </div>
                {note.tags.length ? (
                    <div className="flex items-center gap-2">
                      {note.tags.map((label) => (
                          <Badge key={label}
                                 variant={getBadgeVariantFromLabel(label)}>
                            {label}
                          </Badge>
                      ))}
                    </div>
                ) : null}
              </button>
          ))}
        </div>
      </ScrollArea>
  );
}

function getBadgeVariantFromLabel(label) {
  if (["work"].includes(label.toLowerCase())) {
    return "default";
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "secondary";
}
