import {useAtom, useSetAtom} from "jotai";
import {
  idAtom,
  emailAtom,
  isEmailSentAtom,
  messageAtom,
  newPasswordAtom,
  newPasswordConfirmAtom,
  pwPageAtom,
  resetStateAtom,
  verifyAtom,
  emailVerifiedAtom,
  countAtom,
  isTimedOutAtom,
  isSendingAtom,
} from "@/atoms/forgotAtoms";
import {
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader
} from "@/components/ui/alert-dialog";
import {motion} from "framer-motion";
import {Input} from "@/components/ui/input";
import {Check, Loader2, MailOpen} from "lucide-react";
import {Button} from "@/components/ui/button";
import apiClient  from "@/lib/apiClient";
import {
  changePassword,
  getUserProfileByInput
} from "@/services/user/authAPIService";
import {PasswordSchema, ValidationSchemas} from "@/lib/validationSchemas";
import {useEffect, useState} from "react";


export default function ForgotPassword() {
  const [page, setPage] = useAtom(pwPageAtom);
  const [id, setId] = useAtom(idAtom);
  const [email, setEmail] = useAtom(emailAtom);
  const [verify, setVerify] = useAtom(verifyAtom);
  const [isEmailSent, setIsEmailSent] = useAtom(isEmailSentAtom);
  const [message, setMessage] = useAtom(messageAtom);
  const [emailVerified, setEmailVerified] = useAtom(emailVerifiedAtom);
  const [isSending, setIsSending] = useAtom(isSendingAtom);
  const [count, setCount] = useAtom(countAtom)
  const [isTimedOut, setIsTimedOut] = useAtom(isTimedOutAtom);
  const [newPassword, setNewPassword] = useAtom(newPasswordAtom);
  const [newPasswordConfirm, setNewPasswordConfirm] = useAtom(newPasswordConfirmAtom);
  const resetState = useSetAtom(resetStateAtom); // 상태 초기화를 위한 atom
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);


  const handleKeyDown = (event) => {
    if (event.getModifierState("CapsLock")) {
      setIsCapsLockOn(true);
    } else {
      setIsCapsLockOn(false);
    }
  };

  const handleSubmit = async () => {
    if (id === "") {
      setMessage("아이디를 입력해주세요.")
      return;
    }

    try {
      const InputData = {
        input: id,
        inputType: "id",
      }

      const user = await getUserProfileByInput(InputData);

      if (user.signal === "user_not_found") {
        setMessage("가입되지 않은 아이디 입니다.");
      }

      if (user.accountType === "SNS") {
        setMessage("SNS 계정은 비밀번호 설정이 불가능합니다.\n내 정보 -> 일반 계정 전환을 통해 비밀번호를 추가 할 수 있습니다.")
      } else if (user.accountType === "Local") {
        setVerify(true);
        await SendVerificationEmail(user.email);
      }

    } catch (e) {
      console.log(e);
    }
  };

  const SendVerificationEmail = async (email) => {
    setIsSending(true);
    setEmail(email);
    try {
      const response = await apiClient.post("/email", {
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

  const handleNewPasswordSubmit = async () => {
    const passwordValidation = PasswordSchema.safeParse(newPassword);
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
      const isVerified = JSON.parse(localStorage.getItem("emailVerifiedData"));
      if (isVerified === null) {
        return;
      }
      if (isVerified.emailVerified === true) {
        setEmailVerified(true);
        localStorage.removeItem("emailVerifiedData");
        clearInterval(intervalId);
        setMessage("");
        setPage(1);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
      <>
        <AlertDialogHeader>
          <div className="text-sm p-1 text-muted-foreground overflow-hidden">
            <motion.div
                key={page}
                initial={page === 0 ? false : {x: 50, opacity: 0}}
                animate={{x: 0, opacity: 1}}
                exit={{x: -50, opacity: 0}}
                transition={{duration: 0.3}}
            >
              {page === 0 && (
                  <>
                    <p className="text-sm">가입 당시 아이디를 입력해주세요.<br/> 해당 아이디의 이메일로 인증 메일을 발송합니다.</p>
                    <Input
                        className="mt-2"
                        type="text"
                        placeholder="Enter Your id"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
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
                    <div className="text-sm min-h-8 text-muted-foreground mt-2">
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
        <AlertDialogFooter className="absolute bottom-0 left-0 w-full p-5">
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
      </>
  );
}