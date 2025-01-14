'use client'

import React, {useEffect, useState} from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog, AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from 'lucide-react'
import Image from "next/image"
import HeaderLayout from "@/components/HeaderLayout";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {useRouter} from "next/router";
import {
  deleteUserProfile,
  getUserProfile,
  linkSocialAccount, unlinkSocialAccount,
  updateUserProfile
} from "@/services/user/authService";
import {toast} from "sonner";
import withAuth from "@/lib/hoc/withAuth";
import ChangeToLocalAccount from "@/components/userinfo/changeToLocalAccount";

function UserInfoPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    profileIcon: '',
    email: '',
    name: '',
    createdAt: '',
    socialAccounts: [],
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('/placeholder.svg'); // 현재 프로필 사진
  const [inputUrl, setInputUrl] = useState(''); // URL 입력값
  const [previewUrl, setPreviewUrl] = useState(''); // 성공적으로 검증된 URL (미리보기용)
  const [isApplyDisabled, setIsApplyDisabled] = useState(true); // 적용 버튼 활성화 여부
  const [errorText, setErrorText] = useState(''); // 오류 메시지 표시용
  const [modalOpen, setModalOpen] = useState(false);

  const resetModalState = () => {
    setModalOpen(false);
    setInputUrl('');
    setPreviewUrl('');
    setIsApplyDisabled(true);
    setErrorText('');
  }

  // 사용자 정보 불러오기 함수
  const fetchUserInfo = async () => {
    try {
      const data = await getUserProfile();
      setUserInfo(data.user);
    } catch (error) {
    } finally {
      setIsLoading(false); // 마지막엔 무조건 로딩 완료
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const {error} = router.query;
    if (error) {
      toast.error(decodeURIComponent(error));
      // 토스트 보여주고나서 URL에서 쿼리 제거
      router.replace("/userinfo", undefined, {shallow: true});
    }
  }, [router.query]);

  // 유효성 검사 및 미리보기 로직
  const handleUrlCheck = () => {
    setErrorText(''); // 기존 경고 텍스트 초기화
    if (!inputUrl) {
      setErrorText('URL을 입력해주세요.');
      return;
    }
    const img = new window.Image();
    img.onload = () => {
      setPreviewUrl(inputUrl); // 미리보기 URL 설정
      setIsApplyDisabled(false); // 적용 버튼 활성화
      setErrorText(''); // 오류 텍스트 제거
    };
    img.onerror = () => {
      setErrorText('유효하지 않은 이미지 URL입니다. 다시 확인해주세요.');
      setIsApplyDisabled(true); // 적용 버튼 비활성화
    };
    img.src = inputUrl;
  };

  // 소셜 계정 연동 상태 확인 함수
  const getSocialAccountStatus = (provider) => {
    const account = userInfo.socialAccounts.find(
        (acc) => acc.provider === provider);
    return account ? '연동됨' : '미연동';
  };

  const providerIconPath = (provider) => {
    return `/images/loginlogo/${provider}-login.png`;
  }

  const isLocalAccount = () => {
    return userInfo.socialAccounts.some(
        account => account.provider === 'local');
  };

  // 이름 업데이트 함수
  const handleNameUpdate = async () => {
    try {
      if (userInfo.name !== newName) {
        await updateUserProfile({name: newName});
        setUserInfo((prev) => ({...prev, name: newName}));
      }
      setIsEditingName(false);
    } catch (error) {
    }
  };

  const handleProfileIconUpdate = async () => {
    try{
      if(userInfo.profileIcon !== inputUrl){
        await updateUserProfile({profileIcon : inputUrl});
        resetModalState();
      }
    } catch (error) {}
  }

  // 소셜 계정 연동 or 해제 함수
  const handleSocialAccountToggle = async (provider) => {
    try {
      if (getSocialAccountStatus(provider) === "미연동") {
        // 연동하기 클릭 시 즉시 연동 로직 호출
        await linkSocialAccount(provider);
      } else {
        // 연동 해제일 때 모달 표시
        const updatedUser = await unlinkSocialAccount(provider);
        setUserInfo(updatedUser.user);
        setIsLoading(true); // 로딩 상태로 전환
        await fetchUserInfo(); // 업데이트 후 데이터 새로 가져오기
      }
    } catch (error) {
    }
  }

  if (isLoading) {
    return null;
  }

  return (
      <div className="container grid items-center max-h-[80vh] h-screen max-w-5xl mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">내 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex">
              <div className="flex-1 space-y-8 pr-6">
                <div className="flex flex-col items-center space-y-4">
                  <img
                      src={userInfo.profileIcon}
                      alt="프로필 아이콘"
                      className="w-24 h-24 rounded-full mx-auto"
                  />
                <AlertDialog
                    onOpenChange={(open) => {
                      setModalOpen(open)
                      if (!open) {
                        resetModalState();
                      }
                    }
                    }
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      프로필 사진 변경
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>프로필 사진 변경</AlertDialogTitle>
                      <AlertDialogDescription>
                        새로운 프로필 사진의 URL을 입력해주세요.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex justify-center">
                        {!previewUrl ?(
                        <img
                            src={userInfo.profileIcon}
                            alt="프로필 이미지"
                            className="w-24 h-24 rounded-full mx-auto"
                        />
                        ) : (
                            <img
                                src={previewUrl}
                                alt="미리보기"
                                className="w-24 h-24 rounded-full mx-auto"
                            />
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <Input
                            id="profileUrl"
                            type="text"
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            placeholder="이미지 URL을 입력하세요"
                        />
                        <Button size="sm" onClick={handleUrlCheck}>
                          확인
                        </Button>
                      {errorText && <p className="absolute text-sm text-red-500 ml-1" style={{marginTop: "70px"}}>{errorText}</p>}
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <Button
                          onClick={handleProfileIconUpdate}
                          disabled={isApplyDisabled}
                      >
                        적용
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="space-y-2">
                    <Label>계정 유형</Label>
                      <div className="flex items-center space-x-2">
                        {isLocalAccount() ? (
                            <>
                              <span className="text-muted-foreground">이메일 계정</span>
                              <Badge variant="secondary">기본</Badge>
                            </>
                        ) : (
                            <>
                              <span className="text-muted-foreground">소셜 계정</span>
                              <Badge variant="outline">소셜</Badge>
                              {isLocalAccount() ? '' : <ChangeToLocalAccount/>}
                            </>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 mr-4">
                      <Label>계정 생성일</Label>
                      <div className="text-muted-foreground">
                        {new Date(userInfo.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>이메일</Label>
                    <div className="text-muted-foreground">{userInfo.email}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>이름</Label>
                    <div className="flex items-center space-x-2">
                      <div className="relative max-w-[200px]">
                        <Input
                            value={isEditingName ? newName : userInfo.name}
                            onChange={(e) => setNewName(e.target.value)}
                            readOnly={!isEditingName}
                            className={isEditingName ? "" : "text-muted-foreground bg-gray-50 focus-visible:ring-0"}
                        />
                        {!isEditingName && (
                            <>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                      onClick={() => {
                                        setIsEditingName(true)
                                        setNewName(userInfo.name)
                                      }}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground transition-colors duration-200 hover:bg-zinc-200 rounded-sm p-1"
                                  >
                                    <Pencil className="h-4 w-4"/>
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="text-[13px] mb-2">
                                  닉네임 변경
                                </TooltipContent>
                              </Tooltip>
                            </>
                        )}
                      </div>
                      {isEditingName && (
                          <>
                            <Button onClick={handleNameUpdate} size="sm">
                              적용
                            </Button>
                            <Button variant="outline" onClick={() => setIsEditingName(false)} size="sm">
                              취소
                            </Button>
                          </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-px bg-border"/>

              <div className="flex-1 space-y-8 pl-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">소셜 계정 연동</h3>

                  <div className="flex flex-col items-center gap-4 mt-10">
                    {["google", "kakao", "naver"].map((provider) => {
                      const isLinked = getSocialAccountStatus(provider)
                          !== "미연동";
                      const socialStatus = getSocialAccountStatus(provider);

                      return (
                          <Card key={provider}
                                className="w-[400px] flex flex-col">
                            <CardContent className="flex justify-between p-3">
                              <div className="flex items-center">
                                <Image src={providerIconPath(provider)}
                                       priority={true}
                                       alt={`${provider} logo`} className="mr-3"
                                       width={30} height={30}/>

                                <h3 className="font-semibold  flex items-center min-w-10">
                                  {provider === "google" ? "구글" : provider
                                  === "kakao"
                                      ? "카카오" : "네이버"}
                                </h3>
                              </div>
                              <div className="flex items-center space-x-4">
                                {socialStatus === "미연동" ? <div
                                        className=" inline-flex items-center min-h-7 rounded-full border px-3 text-sm font-semibold border-transparent bg-red-100 text-red-500">미연동</div>
                                    : <div
                                        className=" inline-flex items-center rounded-full border px-3 text-sm font-semibold border-transparent bg-blue-100 text-blue-500">연결됨</div>}
                                {isLinked ? (
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                            disabled={isLocalAccount()
                                                === false}>연동
                                          해제
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>{`${provider} 계정을 연동 해제하시겠습니까?`}</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            이 계정을 연동 해제하면 더 이상 {provider}를 통해
                                            로그인할
                                            수 없습니다.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <Button
                                              onClick={() => handleSocialAccountToggle(
                                                  provider)}>연동 해제</Button>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                ) : (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                            className={isLocalAccount()
                                                ? "opacity-100"
                                                : "opacity-50"}
                                            onClick={isLocalAccount()
                                                ? () => handleSocialAccountToggle(
                                                    provider)
                                                : null}>연동하기</Button>
                                      </TooltipTrigger>
                                      {!isLocalAccount() && (
                                          <TooltipContent>추가 연동은 일반계정에서
                                            가능합니다.</TooltipContent>)}
                                    </Tooltip>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-end pt-16">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                          className="bg-background text-destructive shadow-none hover:text-accent hover:bg-destructive">회원탈퇴</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>회원 탈퇴를 진행하시겠습니까?</AlertDialogTitle>
                        <AlertDialogDescription>
                          탈퇴 시 모든 정보가 삭제되며, 복구가 불가능합니다.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                            className="bg-blue-500 text-white">취소</AlertDialogCancel>
                        <Button variant="secondary" onClick={deleteUserProfile}>탈퇴
                          진행</Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}

UserInfoPage.getLayout = function getLayout(page) {
  return <HeaderLayout>{page}</HeaderLayout>;
}
export default withAuth(UserInfoPage);