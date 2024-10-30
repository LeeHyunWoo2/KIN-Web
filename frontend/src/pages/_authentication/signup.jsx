'use client'

import Link from "next/link";
import Image from "next/image";
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
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {Input} from "@/components/ui/input";
import {registerUser} from '@/services/authService'
import { z } from 'zod';
import {useRouter} from "next/router";
import {toast} from "@/hooks/use-toast";


const schema = z.object({
  email: z.string().email(),
    password: z.string().min(6),
})



export default function AuthenticationPage() {
  const router = useRouter(); // next.js 의 useRouter 사용. use client 에서만 작동함
  const [page, setPage] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const handleNext = () => setPage((prevPage) => prevPage + 1);
  const handlePrev = () => setPage((prevPage) => prevPage - 1);

  const [formData, setFormData] = useState({
    name:'',
    email: '',
    password: '',
    passwordConfirm:'',
    termsAgreed: false,
    phone:'',
    marketingConsent: false,
  });


  // 필수 필드들이 모두 채워졌는지 확인하는 함수
  const isFormValid = () => {
    const { name, email, password, passwordConfirm, termsAgreed } = formData;
    return (
        name &&
        email &&
        password &&
        passwordConfirm &&
        password === passwordConfirm &&
        termsAgreed
    );
  };


  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // formData가 변경될 때마다 유효성 검사를 수행하고 버튼 상태 업데이트
  useEffect(() => {
    setIsButtonDisabled(!isFormValid());
  }, [formData]);


  // 모든 필드를 처리하는 handleChange 함수
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value, // 체크박스와 일반 필드 처리
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await registerUser(formData);
      setSuccessMessage(response.message);
      setErrorMessage('');
      toast({
        title: '회원가입 성공',
        description: '회원가입이 성공적으로 완료되었습니다.',
      });
      router.push('/login')
    } catch (error) {
      setErrorMessage(error.response?.data?.message || '회원가입 실패');
      setSuccessMessage('');
    }
  };

  return (
      <>
        <div className="md:hidden">
          <Image
              src="/examples/authentication-light.png"
              width={1280}
              height={843}
              alt="Authentication"
              className="block dark:hidden"
          />
          <Image
              src="/examples/authentication-dark.png"
              width={1280}
              height={843}
              alt="Authentication"
              className="hidden dark:block"
          />
        </div>
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

            <div className="relative z-20 mt-auto">
              <blockquote className="space-y-2">
              <p className="text-lg">
                  &ldquo;대충 검은 화면에 큰따옴표로 아무 말이나 적으면 명언 같아 보인다.&rdquo;
                </p>
                <footer className="text-sm">현우</footer>
              </blockquote>
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
                    href="#"
                    className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
            )}

            {/*회원가입 두번째 페이지*/}

            {page === 1 && (
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
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="email@example.com"
                            required
                        />
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
                      <div
                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                        <Checkbox
                            name="termsAgreed"
                            checked={formData.termsAgreed}
                            onCheckedChange={(value) =>
                                setFormData({ ...formData, termsAgreed: value })
                            }
                        />
                        <div className="space-y-1 leading-none">
                          <Label>필수 약관 동의</Label><br/>
                          <Label
                              className="text-[0.8rem] text-muted-foreground">
                            대충 필수 약관 내용
                          </Label>
                        </div>
                      </div>
                      <Button
                          type="button"
                          className="w-full"
                          disabled={isButtonDisabled}
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

            {page === 2&& (
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
                        <Label htmlFor="phone">전화번호 (선택)</Label>
                        <Input
                            type="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="010-1234-5678"
                            required
                        />
                      </div>
                      <div
                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                        <Checkbox
                            name="marketingConsent"
                            checked={formData.marketingConsent}
                            onCheckedChange={(value) =>
                                setFormData({ ...formData, marketingConsent: value })
                            }
                        />
                        <div className="space-y-1 leading-none">
                          <Label>마케팅 동의 (선택)</Label><br/>
                          <Label
                              className="text-[0.8rem] text-muted-foreground">
                            마케팅같은거안하는데그냥선택체크하나만들고싶었음
                          </Label>
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="w-full">가입하기</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>회원가입을 진행하시겠습니까? (현재 가입 불가)</AlertDialogTitle>
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
          </div>
        </div>
      </>
  );
}

AuthenticationPage.getLayout = function getLayout(page) {
  return <HeaderLayout>{page}</HeaderLayout>
}