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
import {ValidationSchemas} from "@/lib/validationSchemas";
import {
  changePassword,
  getUserProfileByEmail
} from "@/services/user/authService";
import {motion} from "framer-motion";

export default function ForgotPassword({setIsForgotPasswordOpen, isCapsLockOn, setIsCapsLockOn}) {
  const [page, setPage] = useState(0);
  const [email, setEmail] = useState("");
  const [verify, setVerify] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [message, setMessage] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [count, setCount] = useState();
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const resetState = () => {
    setTimeout(() => {
      setEmail("");
      setVerify(false);
      setIsEmailSent(false);
      setMessage("");
      setEmailVerified(false);
      setIsSending(false);
      setCount(undefined);
      setIsTimedOut(false);
      setNewPassword("");
      setNewPasswordConfirm("");
      localStorage.removeItem("emailVerified");
    }, 500); // 바로 리셋하면 창이 초기화 되면서 닫혀서 딜레이 추가
  };

  const handleKeyDown = (event) => {
    if (event.getModifierState("CapsLock")) {
      setIsCapsLockOn(true);
    } else {
      setIsCapsLockOn(false);
    }
  };

  const emailSchema = ValidationSchemas.pick({
    email: true,
  })

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
      const user = await getUserProfileByEmail(email);
      if (user.accountType === "SNS") {
        setMessage(
            "SNS 계정은 비밀번호 설정이 불가능합니다.\n내 정보 -> 일반 계정 전환을 통해 비밀번호를 추가 할 수 있습니다.")
      } else if (user.accountType === "Local") {
        setVerify(true);
        await SendVerificationEmail();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleNewPasswordSubmit = async () => {
    const passwordValidation = ValidationSchemas.shape.password.safeParse(
        newPassword);
    if (newPasswordConfirm === "") {
      setMessage("비밀번호 확인란을 입력해주세요.");
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setMessage("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (!passwordValidation.success) {
      setMessage(passwordValidation.error.errors[0].message);
      return;
    }
    const response = await changePassword(newPassword, email);
    setMessage(response.message);
    if (response.commit) {
      resetState();
      setPage(2);
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
        setMessage("");
        setPage(1);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isEmailSent]);

  return (
      <AlertDialog
          onOpenChange={(open) => {
            setIsForgotPasswordOpen(open)
            if (!open) {
              resetState();
            }
          }
          } // 모달 상태 업데이트
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
            <AlertDialogDescription/>
            <div className="text-sm text-muted-foreground overflow-hidden">
              <motion.div
                  key={page}
                  initial={page === 0 ? false : {x: 50, opacity: 0}}
                  animate={{x: 0, opacity: 1}}
                  exit={{x: -50, opacity: 0}}
                  transition={{duration: 0.3}}
              >
                {page === 0 && (
                    <>
                      가입 당시의 이메일을 입력해주세요
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
                      />
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
                      <div className="text-sm text-muted-foreground mt-2">
                        {isEmailSent && !emailVerified && count !== 0 && (
                            <p className="text-green-500">{message}</p>
                        )}
                        {!isEmailSent && message && (
                            <p className="text-red-500 whitespace-pre-wrap">{message}</p>
                        )}
                        {isTimedOut && count === 0 && (
                            <p className="text-red-500">시간 초과. 다시 시도해주세요.</p>
                        )}
                        {isEmailSent && !emailVerified && <span>{formatTime(
                            count)}</span>}
                      </div>
                    </>
                )}

                {page === 1 && (
                    <>
                      변경할 비밀번호를 입력해주세요.
                      <Input
                          className="mt-4 mb-2"
                          type="password"
                          placeholder="새 비밀번호"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" &&
                                document.activeElement.tagName === "INPUT") {
                              handleNewPasswordSubmit();
                            }
                            handleKeyDown(e);
                          }}
                          onBlur={()=>setIsCapsLockOn(false)}
                      />
                      <Input
                          className="mt-2"
                          type="password"
                          placeholder="새 비밀번호 확인"
                          value={newPasswordConfirm}
                          onChange={(e) => setNewPasswordConfirm(
                              e.target.value)}
                          onKeyDown={(e) => {
                            if (
                                e.key === "Enter" &&
                                document.activeElement.tagName === "INPUT"
                            ) {
                              handleNewPasswordSubmit();
                            }
                            handleKeyDown(e);
                          }}
                          onBlur={()=>setIsCapsLockOn(false)}
                      />
                      {isCapsLockOn && (
                          <span className="text-red-500 text-sm text-muted-foreground">Caps Lock 이 활성화 되어있습니다!</span>
                      )}
                      <div className="text-sm text-muted-foreground mt-2">
                        {message && (
                            <p className="text-red-500">{message}</p>
                        )}
                      </div>
                    </>
                )}
                {page === 2 && (
                    <>
                      비밀번호 변경이 완료되었습니다!
                    </>
                )}
              </motion.div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {page !== 2 && (
                <>
                  <AlertDialogCancel
                    onClick={() => {
                      const interval = setInterval(() => {
                        setPage(0);
                        clearInterval(interval);
                      }, 500);
                    }}
                >취소</AlertDialogCancel>
                  <Button
                    onClick={page === 0 ? handleSubmit :
                        page === 1 ? handleNewPasswordSubmit
                            : undefined}>다음</Button>
                </>
            )}
            {page === 2 && (
                <AlertDialogCancel
                    className="bg-primary text-primary-foreground shadow hover:bg-primary/90"
                    onClick={() => {
                      const interval = setInterval(() => {
                        setPage(0);
                        clearInterval(interval);
                      }, 500);
                    }}
                >닫기</AlertDialogCancel>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  );
}