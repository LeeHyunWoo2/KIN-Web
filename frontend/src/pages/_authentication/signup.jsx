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
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import {Input} from "@/components/ui/input";
import {
  getUserProfileByInput,
  registerUser
} from '@/services/user/authAPIService'
import {ScrollArea} from "@/components/ui/scroll-area";
import {motion} from "framer-motion";
import apiClient from "@/lib/apiClient";
import {Check, Loader2, MailOpen} from "lucide-react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import PrivacyPolicy from "@/pages/_authentication/privacy-policy";
import {
  EmailSchema,
  IdSchema,
  ValidationSchemas
} from "@/lib/validationSchemas";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {PolicyContentKR} from "@/components/auth/PolicyContent";
import { Turnstile } from "next-turnstile";
import {toast} from "sonner";


export default function AuthenticationPage() {
  const [page, setPage] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [message, setMessage] = useState({id: "", email: ""});
  const [idVerified, setIdVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isSending, setIsSending] = useState(false); // 이메일 전송 중 상태
  const [count, setCount] = useState();
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [isOverlayActive, setIsOverlayActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [isTestAccount, setIsTestAccount] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");


  useEffect(() => {
    const currentEmail = localStorage.getItem("currentEmail");
    if (currentEmail) {
      localStorage.removeItem("currentEmail");
    }
  }, []);

  const handleNext = () => {
    setPage((prev) => prev + 1);
  };
  const handlePrev = () => {
    setPage((prev) => prev - 1);
  };

  const handleSocialLogin = (provider) => {
    // 통합된 소셜 로그인 URL 생성
    const url = `${process.env.NEXT_PUBLIC_API_URL}/social/${provider}`;

    if (url) {
      window.location.href = url; // 소셜 로그인 URL로 리다이렉트
    }
  };

  const [formData, setFormData] = useState({
    id: '',
    idVerified: false,
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    termsAgreed: false,
    marketingConsent: false,
  });

  // 필수 필드들이 모두 채워졌는지 확인하는 함수
  const isFormValid = () => {
    const {
      id,
      idVerified,
      name,
      email,
      password,
      passwordConfirm,
      termsAgreed
    } = formData;
    if (page === 1) {
      return termsAgreed;
    } else if (page === 2) {
      return (
          id &&
          idVerified &&
          name &&
          email &&
          password &&
          passwordConfirm &&
          password === passwordConfirm
      );
    }
  };

  // 유효성 검사 함수
  const validateForm = (formData) => {
    const {success, error} = ValidationSchemas.safeParse(formData);
    if (success) {
      return {isValid: true, errors: {}};
    }
    // 에러 메시지를 필드별로 정리
    const errors = error.issues.reduce((acc, issue) => {
      acc[issue.path[0]] = issue.message;
      return acc;
    }, {});
    return {isValid: false, errors};
  };

  // 아이디 중복 확인
  const checkDuplicateId = async () => {
    const validation = IdSchema.safeParse(formData.id);
    if (!validation.success) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        idVerified: undefined,
        id: validation.error.errors[0].message
      }));
      setMessage({id: ""})
      return;
    }

    const inputData = {
      input: formData.id,
      inputType: "id",
    }

    const response = await getUserProfileByInput(inputData);
    if (response.signal === 'user_not_found') {
      setIdVerified(true);
      setErrors((prevErrors) => ({
        ...prevErrors,
        id: undefined,
        idVerified: undefined
      }));
      setMessage({id: "사용 가능한 아이디 입니다."})
    } else {
      setIdVerified(false);
      setErrors((prevErrors) => ({...prevErrors, id: undefined}));
      setMessage({id: "이미 존재하는 아이디 입니다."})
    }
  }

  // 이메일 중복 확인
  const checkDuplicateEmail = async () => {
    // 이메일 전송 재요청은 30초가 지난 이후부터 가능
    if (count && 270 < count) {
      setMessage({email: "잠시 후 요청해주세요. (4:30 부터 가능)"})
      return
    }

    // 유효성 검증 수행
    const validation = EmailSchema.safeParse({email: email});
    if (!validation.success) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        emailVerified: undefined,
        email: validation.error.errors[0].message
      }));
      return;
    }

    setErrors((prevErrors) => ({...prevErrors, email: undefined}));

    const inputData = {
      input: email,
      inputType: "email",
    }

    const response = await getUserProfileByInput(inputData);
    if (response.signal === 'user_not_found') {
      await handleSendVerificationEmail();
    } else {
      setIsEmailSent(false);
      return setMessage({email: "이미 가입된 이메일 입니다."});
    }
  }

  const handleSendVerificationEmail = async () => {
    setIsSending(true); // 전송 중 상태 활성화
    try {
      const response = await apiClient.post("/email", {
        email,
      });
      localStorage.setItem("currentEmail", email);
      setIsEmailSent(true);
      setCount(300);
      setMessage({email: response.data.message || "이메일이 전송되었습니다. 확인해주세요."});
    } catch (error) {
      setIsEmailSent(false);
      setMessage({email: error.response?.data?.message || "이메일 전송에 실패했습니다."});
    } finally {
      setIsSending(false); // 전송 완료 후 상태 초기화
    }
  };

  // formData가 변경될 때마다 유효성 검사를 수행하고 버튼 상태 업데이트
  useEffect(() => {
    setIsButtonDisabled(!isFormValid());
  }, [formData, page]);

  // 모든 필드를 처리하는 handleChange 함수
  const handleChange = (e) => {
    const {name, value, type, checked} = e.target;
    const updatedValue = type === "checkbox" ? checked : value;
    if (name === "email") {
      setEmail(value); // 이메일 상태 업데이트 (이메일인증)
    }
    // 데이터 업데이트
    setFormData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
  };

  const handleOpenAlertDialog = (e) => {
    e.preventDefault();

    const finalFormData = {
      ...formData,
      emailVerified: emailVerified,
      idVerified: idVerified
    };

    // 유효성 검증 수행
    const {isValid, errors: validationErrors} = validateForm(finalFormData);

    // 오류 메시지 상태 업데이트
    setErrors(validationErrors);

    if (!isValid) {
      return;
    }
    // 유효성 검사를 통과한 경우 Dialog 출력
    setIsOverlayActive(true);
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
      setIsTimedOut(true);
    }
    return () => clearInterval(timer);
  }, [count]);

  // 이메일 인증 주기적으로 체크
  useEffect(() => {
    const intervalId = setInterval(() => {
      const certStatus = JSON.parse(localStorage.getItem("emailVerifiedData"));
      if (certStatus === null) {
        return;
      }
      if (certStatus.emailVerified === true && certStatus.email === email) {
        setEmailVerified(true); // 상태 업데이트
        localStorage.removeItem("emailVerifiedData"); // 로컬스토리지 정리
        localStorage.removeItem("currentEmail")
        clearInterval(intervalId); // 인터벌 중지
      }
    }, 1000);
    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 정리
  }, [email]);

  useEffect(() => {
    if(page === 0){
      setFormData({
        id: '',
        idVerified: false,
        name: '',
        email: '',
        emailVerified: false,
        password: '',
        passwordConfirm: '',
        termsAgreed: false,
        marketingConsent: false,
      })
      setIsTestAccount(false)
      setIdVerified(false)
      setEmailVerified(false)
      setMessage({id: '', email: ''})
      setErrors({id: '', email: ''})
      setEmail('')
    }
  }, [page]);

  const handleSubmit = async () => {
    try {
      if (!turnstileToken) {
        toast.error("보안 인증을 완료해주세요.");
        return;
      }
        formData.email = email;
        const registerData = { ...formData, turnstileToken };
        await registerUser(registerData);
        window.location.href = `/login?success=${encodeURIComponent(
            `회원가입 완료! ${formData.name} 님 환영합니다`)}`;
    } catch (error) {
      // setErrorMessage('회원가입 실패');
    }
  };

  return (
      <>
        <div
            className="container relative h-[calc(100vh-64px)] flex-col items-center justify-center grid max-w-none grid-cols-[1fr_3fr_1fr] px-0">
          <div
              className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div className="absolute inset-0 bg-zinc-900"/>
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
                        일반 계정 회원가입
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
                    <Button variant="outline" type="button"
                            className="[&_svg]:size-[18px]"
                            onClick={() => handleSocialLogin('google')}>
                      <Icons.google className="mr-2 h-4 w-4"/>
                      Continue with Google
                    </Button>
                    <Button variant="outline" type="button"
                            className="[&_svg]:size-[20px]"
                            onClick={() => handleSocialLogin('kakao')}>
                      <Icons.kakao className="mr-2 h-4 w-4"/>
                      &nbsp;&nbsp;Continue with Kakao
                    </Button>
                    <Button variant="outline" type="button"
                            className="[&_svg]:size-[20px]"
                            onClick={() => handleSocialLogin('naver')}>
                      <Icons.naver className="mr-2 h-4 w-4"/>
                      Continue with Naver
                    </Button>
                  </div>
                  <p className="px-8 text-center text-sm text-muted-foreground">
                    By clicking continue, you agree to our{" "}
                    <span
                        className="underline underline-offset-4 hover:text-primary cursor-pointer"
                    >
                      Terms of Service
                    </span>{" "}
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
                initial={{y: 7, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                exit={{y: -7, opacity: 0}}
                transition={{duration: 0.2}}
            >

              {page === 1 && (
                  <Card className="max-w-sm mx-auto">
                    <CardHeader>
                      <CardTitle className="text-xl">Sign Up
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3 font-semibold transition-colors ml-5"
                                 style={{
                                   opacity: isTestAccount ? 0.5 : 1,
                                 }}
                                 onClick={() => {
                                   if(isTestAccount) return;
                                   setFormData({
                                         id: 'testinput',
                                         idVerified: true,
                                         name: '테스트맨',
                                         email: 'testman@example.com',
                                         emailVerified: true,
                                         password: 'Qweasd!23',
                                         passwordConfirm: 'Qweasd!23',
                                         termsAgreed: true,
                                         marketingConsent: false,
                                       },
                                       setEmail('testman@example.com'),
                                       setPage(2),
                                       setEmailVerified(true),
                                       setIdVerified(true),
                                       setIsTestAccount(true))
                                 }
                            }>테스트 버튼</div>
                          </TooltipTrigger>
                          {!isTestAccount && (
                          <TooltipContent>
                            <p className="text-sm">
                              누르면 즉시 회원가입 테스트 직전까지 셋팅됩니다.
                            </p>
                          </TooltipContent>
                          )}
                        </Tooltip>
                      </CardTitle>
                      <CardDescription>
                        Enter your information to create an account
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 mb-4">
                        <div
                            className="flex rounded-md border p-4 shadow">
                          <ScrollArea className="h-48 w-full text-sm">
                            <span
                                className="font-semibold leading-none tracking-tight text-xl">Keep Idea Note - 개인정보처리방침</span>
                            <div className="mt-6">
                            <PolicyContentKR/>
                            </div>
                          </ScrollArea>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <div className="flex justify-end">
                              <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-3 font-semibold transition-colors w-1/3 h-8">
                                크게 보기
                              </div>
                            </div>
                          </AlertDialogTrigger>
                          <AlertDialogTitle/>
                          <AlertDialogContent>
                            <ScrollArea className="max-h-[80vh] w-full text-sm">
                              <PrivacyPolicy/>
                            </ScrollArea>
                          </AlertDialogContent>
                          <AlertDialogDescription/>
                        </AlertDialog>
                      </div>

                      <div className="grid gap-4">
                        <div
                            className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow cursor-pointer"
                            onClick={() => {
                              if(isTestAccount) return;
                              setFormData((formData) => ({
                                ...formData,
                                termsAgreed: !formData.termsAgreed
                              }))
                            }
                        }
                        >
                          <Checkbox
                              name="termsAgreed"
                              checked={formData.termsAgreed}
                              onCheckedChange={(value) =>
                                  setFormData({...formData, termsAgreed: value})
                              }
                              onClick={(e) => e.stopPropagation()}
                              disabled={isTestAccount}
                          />
                          <div className="space-y-1 leading-none">
                            <Label className="cursor-pointer">필수 약관
                              동의</Label><br/>
                            <Label
                                className="text-[0.8rem] text-muted-foreground cursor-pointer">
                              필수 약관을 동의하셔야 가입이 가능합니다.
                            </Label>
                          </div>
                        </div>
                        <div
                            className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow cursor-pointer"
                            onClick={() => {
                              if(isTestAccount) return;
                              setFormData((formData) => ({
                                ...formData,
                                marketingConsent: !formData.marketingConsent
                              }))
                            }
                        }
                        >
                          <Checkbox
                              name="marketingConsent"
                              checked={formData.marketingConsent}
                              onCheckedChange={(value) =>
                                  setFormData(
                                      {...formData, marketingConsent: value})
                              }
                              onClick={(e) => e.stopPropagation()}
                              disabled={isTestAccount}
                          />
                          <div className="space-y-1 leading-none">
                            <Label className="cursor-pointer">동의
                              (선택)</Label><br/>
                            <Label
                                className="text-[0.8rem] text-muted-foreground cursor-pointer">
                              선택 체크 내용
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
                          <div className="flex items-center gap-1">
                            <div className="flex-[2.5]">
                              <Input
                                  type="text"
                                  name="id"
                                  value={formData.id}
                                  onChange={handleChange}
                                  placeholder="example123"
                                  readOnly={isTestAccount}
                                  disabled={isTestAccount}
                                  maxLength={20}
                                  required
                              />
                            </div>
                            <div className="flex">
                              <Button
                                  variant="outline"
                                  className="w-full"
                                  onClick={checkDuplicateId}
                                  disabled={!formData.id || idVerified === true}
                              >
                                중복확인
                              </Button>
                            </div>
                          </div>
                          {message.id && <p
                              className={`text-sm mt-1 ${idVerified
                                  ? 'text-green-500'
                                  : 'text-red-500'}`}>{message.id}</p>}
                          {errors.id && <p
                              className="text-red-500 text-sm mt-1">{errors.id}</p>}
                          {errors.idVerified && <p
                              className="text-red-500 text-sm mt-1">{errors.idVerified}</p>}
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="Nickname">Name or Nickname</Label>
                          <Input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="John Doe"
                              readOnly={isTestAccount}
                              disabled={isTestAccount}
                              maxLength={20}
                              required
                          />
                          {errors.name && <p
                              className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
                              disabled={isTestAccount}
                              maxLength={320}
                              required
                          />
                          {errors.email && <p
                              className="text-red-500 text-sm mt-1">{errors.email}</p>}
                          {errors.emailVerified && <p
                              className="text-red-500 text-sm mt-1">{errors.emailVerified}</p>}
                          <Button
                              variant="outline"
                              onClick={checkDuplicateEmail}
                              className="w-full"
                              disabled={!email || emailVerified === true
                                  || isSending}
                              style={{
                                color: emailVerified ? '#00d326' : 'inherit',
                                opacity: emailVerified ? 1 : undefined,
                                cursor: emailVerified ? 'default' : 'pointer',
                              }}
                          >
                            {emailVerified ? (
                                <>
                                  <Check/> 인증 완료
                                </>
                            ) : isSending ? (
                                <>
                                  <Loader2 className="animate-spin"/>이메일 전송 중...
                                </>
                            ) : (
                                <>
                                  <MailOpen/> 이메일 인증하기
                                </>
                            )}
                          </Button>
                          <div className="text-sm text-muted-foreground">
                            {isEmailSent && !emailVerified && count !== 0 && (
                                <p className="text-green-500">{message.email}</p>
                            )}
                            {!isEmailSent && message.email && (
                                <p className="text-red-500">{message.email}</p>
                            )}
                            {isTimedOut && count === 0 && (
                                <p className="text-red-500">시간 초과. 다시
                                  시도해주세요.</p>
                            )}
                            {isEmailSent && !emailVerified && <span>{formatTime(
                                count)}</span>}
                          </div>
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
                              readOnly={isTestAccount}
                              disabled={isTestAccount}
                              maxLength={20}
                              required
                          />
                          {errors.password && <p
                              className="text-red-500 text-sm mt-1">{errors.password}</p>}
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
                              readOnly={isTestAccount}
                              disabled={isTestAccount}
                              maxLength={20}
                              required
                          />
                          {errors.passwordConfirm && <p
                              className="text-red-500 text-sm mt-1">{errors.passwordConfirm}</p>}
                        </div>
                        
                        <AlertDialog
                            open={isOverlayActive}
                            onOpenChange={(isOverlayActive) => {
                              if (isOverlayActive) {
                                setIsOverlayActive(true);
                              } else {
                                setIsOverlayActive(false);
                              }
                            }}
                        >
                          <AlertDialogTrigger asChild>
                            <Button className="w-full"
                                    onClick={handleOpenAlertDialog}>가입하기</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent
                              onInteractOutside={(e) => {
                                e.preventDefault();
                              }}
                          >
                            <AlertDialogHeader>
                              <AlertDialogTitle>회원가입을
                                진행하시겠습니까?</AlertDialogTitle>
                              <AlertDialogDescription>
                                입력된 정보로 회원가입을 완료합니다.<br/>
                                마이페이지에서 회원정보 수정이 가능합니다.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <Turnstile
                                sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                                size="flexible"
                                onSuccess={(token) => setTurnstileToken(token)}
                            />
                            <AlertDialogFooter>
                              <AlertDialogCancel>취소</AlertDialogCancel>
{/*                              <DialogPrimitive.Close>
                                <div className="inline-flex items-center justify-center gap-2
                                 whitespace-nowrap rounded-md text-sm font-medium
                                  transition-colors [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0
                                  bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 px-4 py-2">
                                  Cancel
                                </div>
                              </DialogPrimitive.Close>*/}
                              <Button disabled={!turnstileToken}
                                      onClick={handleSubmit}>Continue</Button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Button variant="outline" className="w-full"
                                onClick={handlePrev}>
                          이전으로
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
              )}
            </motion.div>
          </div>
          <div
              className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div className="absolute inset-0 bg-zinc-900">
              <Link
                  href="/login"
                  className={cn(
                      buttonVariants({variant: "ghost"}),
                      "absolute right-4 top-4 md:right-8 md:top-8",
                  )}
              >
                로그인
              </Link>
            </div>
          </div>
        </div>
      </>
  );
}

AuthenticationPage.getLayout = function getLayout(page) {
  return <HeaderLayout>{page}</HeaderLayout>
}