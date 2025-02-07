import {useAtom} from "jotai";
import {
  emailAtom,
  verifyAtom,
  isEmailSentAtom,
  messageAtom,
  emailVerifiedAtom,
  countAtom,
  isTimedOutAtom,
  isSendingAtom,
  idAtom,
  idPageAtom,
} from "@/atoms/forgotAtoms";
import {
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Check, Loader2, MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import apiClient from "@/lib/apiClient";
import { getUserProfileByInput } from "@/services/user/authAPIService";
import {EmailSchema, ValidationSchemas} from "@/lib/validationSchemas";


export default function ForgotId({setId}) {
  const [page, setPage] = useAtom(idPageAtom); // 아이디 찾기 페이지 상태
  const [email, setEmail] = useAtom(emailAtom); // 이메일 상태
  const [verify, setVerify] = useAtom(verifyAtom); // 인증 여부 상태
  const [isEmailSent, setIsEmailSent] = useAtom(isEmailSentAtom); // 이메일 전송 여부
  const [message, setMessage] = useAtom(messageAtom); // 메시지 상태
  const [emailVerified, setEmailVerified] = useAtom(emailVerifiedAtom); // 이메일 인증 여부
  const [isSending, setIsSending] = useAtom(isSendingAtom); // 이메일 전송 중 상태
  const [count, setCount] = useAtom(countAtom); // 인증 타이머 카운트
  const [isTimedOut, setIsTimedOut] = useAtom(isTimedOutAtom); // 인증 시간 초과 여부
  const [userId, setUserId] = useAtom(idAtom); // 찾은 아이디 설정

  // 이메일 인증 전송 함수
  const sendVerificationEmail = async (email) => {
    setIsSending(true);
    try {
      const response = await apiClient.post("/email", {
        email,
      });
      setIsEmailSent(true);
      setCount(300); // 타이머 시작 (5분)
      setMessage(response.data.message || "이메일을 전송했습니다. 확인해주세요.");
    } catch (error) {
      setMessage(error.response?.data?.message || "이메일 전송에 실패했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  // emailVerified가 true가 되면 사용자 정보 가져오기
  const fetchUserId = async () => {
    if (email === "") {
      setMessage("이메일을 입력해주세요.")
      return;
    }

    const validation = EmailSchema.safeParse({email:email});
    if (!validation.success) {
      setMessage(validation.error.errors[0].message);
      return;
    }

    try {
      const InputData = {
        input: email,
        inputType: "email",
      }

      const user = await getUserProfileByInput(InputData);

      if (user.signal === "user_not_found") {
        setMessage("해당 이메일로 가입된 아이디가 없습니다.");
      }

      if (user.accountType === "SNS") {
        setMessage("SNS 계정은 해당 플랫폼을 통해 id를 찾을 수 있습니다.")
      } else if (user.accountType === "Local") {
        setVerify(true);
        await sendVerificationEmail(user.email);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    // 이메일 인증이 완료됐을 경우, 사용자 아이디를 가져옴
    const intervalId = setInterval(() => {
      const isVerified = localStorage.getItem("emailVerified");
      if (isVerified === "true") {
        setEmailVerified(true);
        localStorage.removeItem("emailVerified");
        clearInterval(intervalId);
        showUserId();
        setMessage("");
        setPage(1);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isEmailSent]);


  // fetchUserId() 에서 바로 id도 가져올 수 있지만, 보안상 개별 요청으로 분리
  const showUserId = async () => {
    const inputData = {
      input: email,
      inputType: "email",
      fetchUserId: true,
    }
    const fetchedData = await getUserProfileByInput(inputData);
    setUserId(fetchedData.id);
  }


  useEffect(() => {
    // 타이머 작동
    const timer = setInterval(() => {
      setCount((prev) => Math.max(prev - 1, 0));
    }, 1000);

    if (count === 0) {
      clearInterval(timer);
      setIsTimedOut(true); // 시간이 초과되면 실패 메시지 표시
    }
    return () => clearInterval(timer);
  }, [count]);


  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
  };


  return (
      <>
        <AlertDialogHeader>
          <div className="text-sm p-1 text-muted-foreground overflow-hidden">
            <motion.div
                key={page}
                initial={page === 0 ? false : { x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
              {page === 0 && (
                  <>
                    <p className="text-sm">
                      가입 당시 사용한 이메일을 입력해주세요.
                      <br />
                      입력한 이메일로 인증 메일을 보냅니다.
                    </p>
                    <Input
                        className="mt-2"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {verify && (
                        <div
                            className="w-fit inline-flex items-center justify-center gap-2 border border-input bg-background shadow-sm h-9 px-4 py-2 my-2"
                            style={{
                              color: emailVerified ? "#00d326" : "inherit",
                            }}
                        >
                          {emailVerified ? (
                              <>
                                <Check /> 인증 완료
                              </>
                          ) : isSending ? (
                              <>
                                <Loader2 className="animate-spin" />
                                이메일 전송 중...
                              </>
                          ) : (
                              <>
                                <MailOpen /> 이메일 인증 대기중
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
                      {isEmailSent && !emailVerified && <span>{formatTime(count)}</span>}
                    </div>
                  </>
              )}
              {page === 1 && (
                  <>
                    <p>아이디 찾기 완료!</p>
                    <p className="text-lg font-bold text-muted-foreground">
                      {email}로 가입된 아이디는 다음과 같습니다:
                    </p>
                    <p className="text-xl font-bold text-primary">{userId}</p>
                  </>
              )}
            </motion.div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="absolute bottom-0 left-0 w-full p-5">
              <>
              {page === 0 && (
                <AlertDialogCancel>
                  취소
                </AlertDialogCancel>
              )}
                {page === 0 ? (
                <Button onClick={fetchUserId}>아이디 찾기</Button>
                ):(
                 <AlertDialogCancel
                     className="bg-primary text-primary-foreground shadow hover:bg-primary/90"
                     onClick={() => {setId(userId)}}
                 >{userId} 로 로그인</AlertDialogCancel>
                )}
              </>
        </AlertDialogFooter>
      </>
  );
}