'use client'

import Link from "next/link";
import {Checkbox} from "@/components/ui/checkbox"
import {cn} from "@/lib/utils";
import {Button, buttonVariants} from "@/components/ui/button";
import HeaderLayout from "@/components/HeaderLayout";
import {Label} from "@/components/ui/label";
import {Icons} from "@/components/icons";
import * as React from "react";
import {useEffect, useState} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {Input} from "@/components/ui/input";
import {registerUser} from '@/services/user/authService'
import {useRouter} from "next/router";
import {ScrollArea} from "@/components/ui/scroll-area";
import {motion} from "framer-motion";
import Recaptcha from "@/components/Recaptcha";
import apiClient from "@/lib/apiClient";
import { MailOpen, Check } from "lucide-react"
import { page1Schema, page2Schema } from "@/lib/validationSchemas";


export default function AuthenticationPage() {
  const router = useRouter(); // next.js 의 useRouter 사용. use client 에서만 작동함
  const [page, setPage] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [message, setMessage] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [count, setCount] = useState();

  const handleNext = () => {
    setPage((prev) => prev + 1);
  };
  const handlePrev = () => {
    setPage((prev) => prev - 1);
  };

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    termsAgreed: false,
    marketingConsent: false,
  });

  // 필수 필드들이 모두 채워졌는지 확인하는 함수
  const isFormValid = () => {
    const {id, name, email, password, passwordConfirm, termsAgreed} = formData;
    if (page === 1) {
      return termsAgreed;
    } else if (page === 2) {
      return (
          id &&
          name &&
          email &&
          password &&
          passwordConfirm &&
          password === passwordConfirm
      );
    }
  };

  const [recaptchaToken, setRecaptchaToken] = useState("");
  const handleCaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const handleSendVerificationEmail = async () => {
    try {
      const response = await apiClient.post("/email/send-verification-email", {email});
      setIsEmailSent(true);
      setCount(300);
      setMessage(response.data.message || "이메일이 전송되었습니다. 확인해주세요.");
    } catch (error) {
      setMessage(error.response?.data?.message || "이메일 전송에 실패했습니다.");
    }
  };

  const [errorMessage, setErrorMessage] = useState('');

  // formData가 변경될 때마다 유효성 검사를 수행하고 버튼 상태 업데이트
  useEffect(() => {
    setIsButtonDisabled(!isFormValid());
  }, [formData, page]);

  // 모든 필드를 처리하는 handleChange 함수
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "email") {
      setEmail(value); // 이메일 상태 업데이트
    }
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value, // 체크박스와 일반 필드 처리
    });
  };

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count => count - 1);
    }, 1000);
    if (count === 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [count]);


  // 이메일 인증 주기적으로 체크
  useEffect(() => {
    const intervalId = setInterval(() => {
      const isVerified = localStorage.getItem("emailVerified");
      if (isVerified === "true") {
        setEmailVerified(true); // 상태 업데이트
        localStorage.removeItem("emailVerified"); // 로컬스토리지 정리
        clearInterval(intervalId); // 인터벌 중지
      }
    }, 1000);
    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 정리
  }, []);



  const handleSubmit = async () => {
    try {
      const response = await apiClient.post('/auth/verify-recaptcha', {
        token: recaptchaToken,
      });
      if (response.status === 200) {
        // 리캡차 성공 시 회원가입 요청
        formData.email = email;
        await registerUser(formData);
        router.push('/login');
      } else {
        setErrorMessage('리캡차 인증 실패');
      }
    } catch (error) {
      setErrorMessage('회원가입 실패');
    }
  };

  return (
      <>
        <div
            className="container relative hidden h-[calc(100vh-64px)] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
          <Link
              href="/login"
              className={cn(
                  buttonVariants({variant: "ghost"}),
                  "absolute right-4 top-4 md:right-8 md:top-8",
              )}
          >
            Login
          </Link>
          <div
              className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div className="absolute inset-0 bg-zinc-900"/>
            <div
                className="relative z-20 flex items-center text-lg font-medium">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-6 w-6"
              >
                <path
                    d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>
              </svg>
              KINote
            </div>
          </div>
          <div className="lg:p-8">

            {/*회원가입 첫 페이지*/}

            {page === 0 && (
                <div
                    className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                  <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                      Create an account
                    </h1>
                    <p className="white text-sm text-muted-foreground">
                      Enter your email below to create your account
                    </p>
                  </div>
                  <div className={cn("grid gap-6")}>
                    <div className="grid gap-2">
                      <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="email">
                          Email
                        </Label>
                      </div>
                      <Button onClick={handleNext}>
                        Sign In with Email
                      </Button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t"/>
                      </div>
                      <div
                          className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
                      </div>
                    </div>
                    <Button variant="outline" type="button">
                      <Icons.gitHub className="mr-2 h-4 w-4"/>
                      GitHub
                    </Button>
                  </div>
                  <p className="px-8 text-center text-sm text-muted-foreground">
                    By clicking continue, you agree to our{" "}
                    <Link
                        href="#"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                        href="/privacy-policy"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
            )}

            <motion.div
                key={page}
                initial={{ y: 7, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -7, opacity: 0 }}
                transition={{ duration: 0.2 }}
            >

              {page === 1 && (
                  <Card className="max-w-sm mx-auto">
                    <CardHeader>
                      <CardTitle className="text-xl">Sign Up</CardTitle>
                      <CardDescription>
                        Enter your information to create an account
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 mb-4">
                        <div
                            className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow min-h-fit">
                          <ScrollArea className="h-48 w-full text-sm">
                            Keep Idea Note 이하 KIN 은 귀하의 개인정보에 관심이 없으며 기타등등.....<br/><br/>
                            김수한무 거북이와 두루미 삼천갑자 동방삭 치치카포 사리사리센타 워리워리 세브리깡 무두셀라
                            구름이
                            허리케인에 담벼락 담벼락에 서생원 서생원에 고양이 고양이엔 바둑이 바둑이는 돌돌이
                        <br/><br/>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis
                            nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat. Duis aute irure dolor in
                            reprehenderit in voluptate velit esse cillum dolore
                            eu
                            fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia
                            deserunt mollit anim id est laborum.
                          </ScrollArea>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        <div
                            className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                          <Checkbox
                              name="termsAgreed"
                              checked={formData.termsAgreed}
                              onCheckedChange={(value) =>
                                  setFormData({...formData, termsAgreed: value})
                              }
                          />
                          <div className="space-y-1 leading-none">
                            <Label>필수 약관 동의</Label><br/>
                            <Label
                                className="text-[0.8rem] text-muted-foreground">
                              필수 약관을 동의하셔야 가입이 가능합니다.
                            </Label>
                          </div>
                        </div>
                        <div
                            className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                          <Checkbox
                              name="marketingConsent"
                              checked={formData.marketingConsent}
                              onCheckedChange={(value) =>
                                  setFormData(
                                      {...formData, marketingConsent: value})
                              }
                          />
                          <div className="space-y-1 leading-none">
                            <Label>동의 (선택)</Label><br/>
                            <Label
                                className="text-[0.8rem] text-muted-foreground">
                              선택 체크 내용
                            </Label>
                          </div>
                        </div>
                        <Recaptcha onVerify={handleCaptchaChange}/>
                        <Button
                            type="button"
                            className="w-full"
                            disabled={!recaptchaToken || isButtonDisabled}
                            onClick={handleNext}
                        >
                          다음 단계
                        </Button>
                        <Button variant="outline" className="w-full"
                                onClick={handlePrev}>
                          이전으로
                        </Button>
                      </div>
                      <div className="mt-4 text-sm text-center">
                        Already have an account?{" "}
                        <Link href="/login" className="underline">
                          Login
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
              )}


              {page === 2 && (
                  <Card className="max-w-sm mx-auto">
                    <CardHeader>
                      <CardTitle className="text-xl">Sign Up</CardTitle>
                      <CardDescription>
                        Enter your information to create an account
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="id">ID</Label>
                          <Input
                              type="text"
                              name="id"
                              value={formData.id}
                              onChange={handleChange}
                              placeholder="kln123"
                              required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="Nickname">Name or Nickname</Label>
                          <Input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="John Doe"
                              required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                              type="email"
                              id="email"
                              name="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="example@example.com"
                              readOnly={emailVerified === true}
                              required
                          />
                          <Button
                              variant="outline"
                              onClick={handleSendVerificationEmail}
                              className="w-full"
                              disabled={!email || emailVerified === true}
                              style={{
                                color: emailVerified ? '#00d326' : 'inherit',
                                opacity: emailVerified ? 1 : undefined,
                                cursor: emailVerified ? 'default' : 'pointer',
                          }}
                          >
                            {emailVerified === false ? <><MailOpen/> 이메일 인증하기</> :<> <Check/> 인증 완료</>}
                          </Button>
                          {isEmailSent && !emailVerified &&<p className="text-green-500">{message}</p>}
                          {!isEmailSent && message && <p className="text-red-500">{message}</p>}
                          {isEmailSent && !emailVerified && <span>{formatTime(count)}</span>}
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="password">비밀번호</Label>
                          <Input
                              id="password"
                              name="password"
                              type="password"
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="8자 이상 영어 대소문자, 숫자, 특수문자"
                              required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
                          <Input
                              id="passwordConfirm"
                              name="passwordConfirm"
                              type="password"
                              value={formData.passwordConfirm}
                              onChange={handleChange}
                              placeholder="password"
                              required
                          />
                        </div>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button className="w-full">가입하기</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>회원가입을
                                진행하시겠습니까?</AlertDialogTitle>
                              <AlertDialogDescription>
                                입력된 정보로 회원가입을 완료합니다.<br/>
                                마이페이지에서 회원정보 수정이 가능합니다.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <Button onClick={handleSubmit}>Continue</Button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Button variant="outline" className="w-full"
                                onClick={handlePrev}>
                          이전으로
                        </Button>
                      </div>
                      <div className="mt-4 text-sm text-center">
                        Already have an account?{" "}
                        <Link href="/login" className="underline">
                          Login
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
              )}
            </motion.div>
          </div>
        </div>
      </>
  );
}

AuthenticationPage.getLayout = function getLayout(page) {
  return <HeaderLayout>{page}</HeaderLayout>
}