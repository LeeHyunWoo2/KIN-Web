import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {useState} from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

export default function ChangeToLocalAccount() {
  const [page, setPage] = useState(0);

  const handleNext = () => {
    setPage((prev) => prev + 1);
  };
  const handlePrev = () => {
    setPage((prev) => prev - 1);
  };

  return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">일반 계정 전환</Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="sm:max-w-[455px]">
          <AlertDialogHeader>
            <AlertDialogTitle>일반 계정 전환 (추후 개발 예정)</AlertDialogTitle>
            <AlertDialogDescription>
              {page === 0 && ('이메일 중복 확인을 진행 합니다.')}
              {page === 1 && ('생성하실 일반 계정 정보를 입력해주세요.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {page === 0 && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    이메일
                  </Label>
                  <Input id="name" placeholder="email@example.com"
                         className="col-span-3"/>
                </div>

              </div>
          )}
          {page === 1 && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    아이디
                  </Label>
                  <Input id="name" className="col-span-3"/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pw" className="text-right">
                    비밀번호
                  </Label>
                  <Input id="pw" type="password" className="col-span-3"
                         placeholder="대소문자특수문자1개 포함 8자이상어쩌고"/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pwCheck" className="text-right">
                    비밀번호 확인
                  </Label>
                  <Input id="pwCheck" type="password" className="col-span-3"/>
                </div>
              </div>
          )}
          {page === 2 && (
              <div className="grid gap-4 py-4">
                진행할까요?
              </div>
          )}

          <AlertDialogFooter>
            <div className="flex flex-1">
            <AlertDialogCancel>취소</AlertDialogCancel>
            </div>
            {page !== 0 && (
                <Button className="flex" variant="outline"
                        onClick={handlePrev}>이전</Button>
            )}
            {page !== 2 && (
                <Button className="flex" onClick={handleNext}>다음</Button>
            )}
            {page === 2 && (
            <Button type="submit">전환</Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  )
}
