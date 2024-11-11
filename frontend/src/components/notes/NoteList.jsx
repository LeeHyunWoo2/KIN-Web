import { useRouter } from "next/router";
import { useAtom } from 'jotai';
import {selectedNoteAtom} from "@/atoms/noteStateAtom";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function NoteList({ notes }) {
  const router = useRouter();
  const [, setSelectedNote] = useAtom(selectedNoteAtom); // 선택된 노트 설정

  const handleNoteClick = (id) => {
    setSelectedNote(id);
    // URL에 선택한 노트 ID를 추가
    router.push(`/notes?id=${id}`, undefined, { shallow: true });
  };

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
                  onClick={() => handleNoteClick(note._id)} // 노트 클릭 시 URL에 ID 추가
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{note.title}</div>
                      {note.is_pinned && (<span className="flex h-2 w-2 rounded-full bg-blue-600" />)}
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
                  {note.content.substring(0, 300)}
                </div>
                {note.tags.length ? (
                    <div className="flex items-center gap-2">
                      {note.tags.map((label) => (
                          <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
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
