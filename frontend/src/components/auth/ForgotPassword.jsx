import {
  AlertDialog, AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import apiClient from "@/lib/apiClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [verify, setVerify] = useState(false);

  const handleSubmit = async () => {
    try {
      const user = await apiClient.get(
          "/user/profile/findUserByEmail/" + email);
      if (user.status === 200) {
        setVerify(true);
        // 이메일 보내는 로직 실행
        // TODO: 응답에 따른 화면 피드백 추가 (회원가입재탕)
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
      <>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
                className="ml-auto inline-block text-sm underline"
                tabIndex={-1}
            >
              비밀번호 찾기
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>비밀번호 찾기</AlertDialogTitle>
              <AlertDialogDescription>
                가입 당시의 이메일을 입력해주세요<br/>
                {verify === true && (
                    <>유저 정보 확인 완료</>
                )}
                <Input
                    className="mt-2"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setVerify(false)}>Cancel</AlertDialogCancel>
              <Button onClick={handleSubmit}>Continue</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
  )
}