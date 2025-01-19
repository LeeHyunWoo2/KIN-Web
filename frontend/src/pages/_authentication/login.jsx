import Link from "next/link";
import HeaderLayout from "@/components/HeaderLayout";
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import SocialLogin from "@/components/auth/SocialLogin";
import {loginUser, logoutUser} from "@/services/user/authService";
import {useEffect, useState} from "react";
import {router} from "next/client";
import {toast} from "sonner";
import {Checkbox} from "@/components/ui/checkbox";
import ForgotComponent from "@/components/auth/ForgotComponent"
import * as React from "react";
import {useAtomValue} from "jotai";
import {authAtom} from "@/atoms/userState";
import {Card, CardContent} from "@/components/ui/card";
import {Loader2} from "lucide-react";

export default function Dashboard() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isForgotComponentOpen, setIsForgotComponentOpen] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const auth = useAtomValue(authAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);

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

  const handleLogin = async (event, id, password) => {
    event.preventDefault();

    if (!id || !password) {
      toast.error('아이디 혹은 비밀번호를 입력해주세요');
    } else {
      const credentials = {id, password, rememberMe};
      const tokens = await loginUser(credentials);
      if (tokens) {
        setIsLoginLoading(true);
        setTimeout(() => {
          setIsLoginLoading(false); // 로딩 상태 해제
        }, 5000);
        // 로그인 성공 시 loginSuccess로 리다이렉트
        await router.push("/loginSuccess");
      }
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
                  <div>
                    <Button
                        variant="outline"
                        className="w-[47%] m-1"
                        onClick={(e) => handleLogin(e, 'test', 'Test123456!')}
                    >
                      테스트 일반 로그인
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
                <div className="mt-4 text-center text-sm">
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

Dashboard.getLayout = function getLayout(page) {
  return <HeaderLayout>{page}</HeaderLayout>
}
