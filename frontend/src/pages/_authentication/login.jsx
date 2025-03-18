import Link from "next/link";
import HeaderLayout from "@/components/HeaderLayout";
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import SocialLogin from "@/components/auth/SocialLogin";
import {loginUser, logoutUser} from "@/services/user/authAPIService";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {Checkbox} from "@/components/ui/checkbox";
import ForgotComponent from "@/components/auth/ForgotComponent"
import * as React from "react";
import {useAtomValue} from "jotai";
import {authAtom} from "@/atoms/userState";
import {Card, CardContent} from "@/components/ui/card";
import {Loader2} from "lucide-react";
import {useRouter} from "next/router";
import {
  AlertDialog, AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import tempTutoImg from "../../../public/images/tempTutorial.png"
import Image from "next/image";
import Turnstile from "react-turnstile";


export default function LoginPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isForgotComponentOpen, setIsForgotComponentOpen] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const auth = useAtomValue(authAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [incorrectValue , setIncorrectValue] = useState(false);
  const [showTestGuide, setShowTestGuide] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  useEffect(() => {
    // auth 상태 확인 후 로딩 종료
    if (auth !== undefined) {
      setIsLoading(false);
    }
    if (auth) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      setUserInfo(userInfo);
    }
  }, [auth]);

  useEffect(() => {
    const {error, success} = router.query;
    if (error) {
      toast.error(decodeURIComponent(error));
      // 토스트 보여주고나서 URL에서 쿼리 제거
      router.replace("/login", undefined, {shallow: true});
    } else if (router.query.success) {
      toast.success(decodeURIComponent(success));
      router.replace("/login", undefined, {shallow: true});
    }
  }, [router.query]);

  if (isLoading) {
    return null;
  }

  const handleKeyDown = (event) => {
    if (event.getModifierState("CapsLock")) {
      setIsCapsLockOn(true);
    } else {
      setIsCapsLockOn(false);
    }
  };

  const handleLogin = async (event, id, password, isTestLogin = false) => {
    event.preventDefault();

    if (!id || !password) {
      toast.error('아이디 혹은 비밀번호를 입력해주세요');
      setIncorrectValue(false);
      return;
    }
    if (!turnstileToken) {
      toast.error("원활한 로그인을 위해 보안 인증을 완료해주세요.");
      return;
    }
      setIsLoginLoading(true);
      setTimeout(() => {
        setIsLoginLoading(false); // 로딩 상태 해제
      }, 5000);
    const credentials = {id, password, turnstileToken, rememberMe};
    const tokens = await loginUser(credentials);
    if (tokens) {
      // 로그인 성공 시 상태 초기화하고 리다이렉트
      setId("");
      setPassword("");
      await router.push("/loginSuccess");
    } else {
      if(isTestLogin){
        setShowTestGuide(true);
      }
      // TODO: 백엔드에서 인증 실패하면 무조건 다시입력 안내가 나오는데, turnsitle 케이스도 추가하기
      setIncorrectValue(true);
      setIsLoginLoading(false);
    }
  };

  return (
      <div
          className="w-full lg:grid lg:min-h-[600px] lg:grid-cols xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">
          {auth ? (
              <Card>
                <CardContent className="p-20">
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center mb-4">
                      <img
                          src={userInfo.profileIcon}
                          alt="profileIcon"
                          className="w-20 h-20 rounded-full mr-4"
                      />
                      <p>{userInfo.name} 님 반갑습니다.</p>
                    </div>
                    <Link href="/notes" className="h-10 w-full my-4">
                      <Button variant="outline" className="h-10 w-full rounded-md">
                        노트로 이동
                      </Button>
                    </Link>
                    <Button variant="outline" className="h-8 w-full text-red-500"
                    onClick={()=> logoutUser()}>로그아웃</Button>
                  </div>
                </CardContent>
              </Card>
          ) : (
              <div
                  className={`mx-auto grid w-[350px] gap-6 relative ${
                      isLoginLoading ? "opacity-50 pointer-events-none" : ""
                  }`}
              >
                {isLoginLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                      <Loader2 className="animate-spin" /> {/* 로딩 아이콘 */}
                    </div>
                )}
                <div className="grid gap-2 text-center">
                  <h1 className="text-3xl font-bold">로그인</h1>
                </div>
                <div className="grid gap-4" onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isForgotComponentOpen) {
                    handleLogin(e, id, password);
                  }
                }}>
                  <div className="grid gap-2">
                    <Label htmlFor="id">아이디</Label>
                    <Input
                        id="id"
                        type="text"
                        placeholder="Enter your id"
                        required
                        value={id}
                        onChange={(e) => setId(e.target.value)} // 상태 업데이트
                        autoComplete="off"
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">비밀번호</Label>
                      <ForgotComponent
                          setIsForgotComponentOpen={setIsForgotComponentOpen}
                          setId={setId}
                      />
                    </div>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter your Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // 상태 업데이트
                        onKeyDown={handleKeyDown}
                        onBlur={() => setIsCapsLockOn(false)}
                    />
                    {isCapsLockOn && (
                        <span
                            className="text-red-500 text-sm text-muted-foreground">Caps Lock 이 활성화 되어있습니다!</span>
                    )}
                    {incorrectValue && (
                        <span
                            className="text-red-500 text-sm text-muted-foreground">아이디 혹은 비밀번호를 다시 입력해주세요.</span>
                    )}
                  </div>
                  <div className="flex ml-auto">
                    <label
                        htmlFor="rememberMe"
                        className="text-[14px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      로그인 기억하기&nbsp;&nbsp;
                    </label>
                    <Checkbox id="rememberMe"
                              checked={rememberMe}
                              onCheckedChange={(e) => setRememberMe(e)}
                        /*radix의 상태변경 기능 활용(시간날때 회원가입쪽도 수정하기)*/
                    />
                  </div>
                  <Button type="submit" className="w-full"
                          onClick={(e) => handleLogin(e, id, password)}
                  >
                    로그인
                  </Button>
                  <Turnstile
                      sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                      size="flexible"
                      refreshExpired="auto"
                      onSuccess={(token) => setTurnstileToken(token)}
                  />
                  <div>
                    {showTestGuide && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <div
                                className="relative inline-flex w-full my-1 h-9 active:scale-[98%] transistion overflow-hidden rounded-lg p-[2px] focus:outline-none"
                            >
                              <div
                                  className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#93c5fd_0%,#6366f1_50%,#93c5fd_50%,#6366f1_100%)]"
                              />
                              <div
                                  className="inline-flex items-center justify-center gap-2
                             whitespace-nowrap rounded-md text-sm backdrop-blur-0
                              bg-background shadow-sm hover:bg-accent hover:text-accent-foreground
                               h-full px-4 py-2 transition-colors w-full mb-3 font-medium cursor-pointer">
                                ✔️ 테스트 유저이신가요?
                              </div>
                            </div>
                          </AlertDialogTrigger>
                          <AlertDialogTitle/>
                          <AlertDialogContent
                              className="flex flex-col items-center justify-center gap-4 min-h-[630px]">
                            <Image src={tempTutoImg} alt="tempTutoImg"
                                   width={300} height={200}
                                   className="border-2 border-black/50 rounded-md"/>
                            <span
                                className="text-base font-semibold my-2 text-center">
                             ▶️ 다음으로 → 회원가입 → 테스트 버튼<br/>
                             순서로 눌러주시면 즉시 테스트 계정이 생성됩니다!
                            </span>
                            <Button className="w-full"
                                    onClick={() => router.push('/signup',
                                        undefined, {shallow: true})}>▶️
                              다음으로</Button>
                            <AlertDialogCancel
                                className="w-full border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">취소</AlertDialogCancel>
                          </AlertDialogContent>
                          <AlertDialogDescription/>
                        </AlertDialog>
                    )}
                    <Button
                        variant="outline"
                        className={`w-[47%] m-1 ${showTestGuide ? ''
                            : 'border-2 border-green-500'}`}
                        onClick={(e) => handleLogin(e, 'testinput', 'Qweasd!23',
                            true)}
                    >
                      테스트 로그인
                    </Button>
                    <Button
                        variant="outline"
                        className="w-[47%] m-1"
                        onClick={(e) => handleLogin(e, 'testadmin',
                            'Admin123456!')}
                    >
                      테스트 관리자 로그인
                    </Button>
                  </div>
                  <SocialLogin/>
                </div>
                <div className="text-center text-sm">
                  <span className="select-none"
                        onClick={(e) => handleLogin(e, 'test',
                            'Test123456!')}>&nbsp;</span>
                  아직 계정이 없으시다면 {" "}
                  <Link href="/signup" className="underline">
                    회원 가입
                  </Link>
                </div>
              </div>
          )}
        </div>
      </div>
  )
}

LoginPage.getLayout = function getLayout(page) {
  return <HeaderLayout>{page}</HeaderLayout>
}
