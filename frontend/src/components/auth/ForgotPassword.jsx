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
import {useEffect, useState} from "react";
import apiClient from "@/lib/apiClient";
import {Check, Loader2, MailOpen} from "lucide-react";
import {z} from "zod";

export default function ForgotPassword({setIsForgotPasswordOpen}) {
  const [page, setPage] = useState(0);
  const [email, setEmail] = useState("");
  const [verify, setVerify] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [message, setMessage] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [count, setCount] = useState();
  const [isTimedOut, setIsTimedOut] = useState(false);

  const resetState = () => {
    setEmail("");
    setVerify(false);
    setIsEmailSent(false);
    setMessage("");
    setEmailVerified(false);
    setIsSending(false);
    setCount(undefined);
  };

  const emailSchema = z.object({
    email: z.string().email("올바른 이메일 형식이 아닙니다."),
  });

  const handleSubmit = async () => {
    if (email === "") {
      setMessage("이메일을 입력해주세요.")
      return;
    }

    const validation = emailSchema.safeParse({email});
    if (!validation.success) {
      setMessage(validation.error.errors[0].message);
      return;
    }

    try {
      const user = await apiClient.get(
          "/user/profile/findUserByEmail/" + email
      );
      if (user.status === 200) {
        setVerify(true);
        await SendVerificationEmail();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const SendVerificationEmail = async () => {
    setIsSending(true);
    try {
      const response = await apiClient.post("/email/send-verification-email", {
        email,
      });
      setIsEmailSent(true);
      setCount(300);
      setMessage(response.data.message || "이메일이 전송되었습니다. 확인해주세요.");
    } catch (error) {
      setMessage(error.response?.data?.message || "이메일 전송에 실패했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((count) => count - 1);
    }, 1000);
    if (count === 0) {
      clearInterval(timer);
      setIsTimedOut(true);
    }
    return () => clearInterval(timer);
  }, [count]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const isVerified = localStorage.getItem("emailVerified");
      if (isVerified === "true") {
        setEmailVerified(true);
        localStorage.removeItem("emailVerified");
        clearInterval(intervalId);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
      <AlertDialog
          onOpenChange={(open) => setIsForgotPasswordOpen(open)} // 모달 상태 업데이트
      >
        <AlertDialogTrigger asChild>
          <button className="ml-auto inline-block text-sm underline"
                  tabIndex={-1}>
            비밀번호 찾기
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>비밀번호 찾기</AlertDialogTitle>
            <AlertDialogDescription>
              가입 당시의 이메일을 입력해주세요
              <br/>
              <Input
                  className="mt-2"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                        e.key === "Enter" &&
                        document.activeElement.tagName === "INPUT"
                    ) {
                      handleSubmit();
                    }
                  }}
                  required
              />
            </AlertDialogDescription>
            {verify === true && (
                <div
                    className="w-fit inline-flex items-center justify-center gap-2
                whitespace-nowrap rounded-md text-sm font-medium transition-colors
                  [&_svg]:size-4 [&_svg]:shrink-0 border border-input
                 bg-background shadow-sm h-9 px-4 py-2 my-2"
                    style={{
                      color: emailVerified ? "#00d326" : "inherit",
                      opacity: emailVerified ? 1 : undefined,
                    }}
                >
                  {emailVerified ? (
                      <>
                        <Check/> 인증 완료
                      </>
                  ) : isSending ? (
                      <>
                        <Loader2 className="animate-spin"/>
                        이메일 전송 중...
                      </>
                  ) : (
                      <>
                        <MailOpen/> 이메일 인증 대기중
                      </>
                  )}
                </div>
            )}
            <div className="text-sm text-muted-foreground">
              {isEmailSent && !emailVerified && count !== 0 && (
                  <p className="text-green-500">{message}</p>
              )}
              {!isEmailSent && message && (
                  <p className="text-red-500">{message}</p>
              )}
              {isTimedOut && count === 0 && (
                  <p className="text-red-500">시간 초과. 다시 시도해주세요.</p>
              )}
              {isEmailSent && !emailVerified && <span>{formatTime(count)}</span>}
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
                onClick={() => resetState()}>Cancel</AlertDialogCancel>
            <Button onClick={handleSubmit}>Continue</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  );
}