import React, {useState, useEffect} from 'react';
import HeaderLayout from "@/components/HeaderLayout";
import {
  getUserProfile,
  updateUserProfile,
  linkSocialAccount,
  unlinkSocialAccount, deleteUserProfile
} from "@/services/user/authService";
import withAuth from "@/lib/hoc/withAuth";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import ChangeToLocalAccount from "@/components/userinfo/changeToLocalAccount";
import {useRouter} from "next/router";
import {toast} from "sonner";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

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
      <div
          className="p-6 m-10 border bg-white rounded-lg shadow-md max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-4">내 정보</h2>

        <div className="mb-4">
          <label className="block text-gray-700">계정 유형:</label>
          <p className="text-gray-600">
            {isLocalAccount() ? '이메일 계정' : '소셜 계정'}
          </p>
          {isLocalAccount() ? '' : <ChangeToLocalAccount/>}
        </div>

        <div className="mb-4">
          <img
              src={userInfo.profileIcon}
              alt="Profile Icon"
              className="w-24 h-24 rounded-full mx-auto"
          />
          <button className="mt-2 text-blue-500">프로필 사진 변경</button>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">이메일:</label>
          <p className="text-gray-600">{userInfo.email}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">이름:</label>
          {isEditingName ? (
              <div>
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="border p-1 w-full"
                />
                <button onClick={handleNameUpdate}
                        className="text-blue-500 mr-2">저장
                </button>
                <button onClick={() => setIsEditingName(false)}
                        className="text-gray-500">취소
                </button>
              </div>
          ) : (
              <div>
                <p className="text-gray-600">{userInfo.name}</p>
                <button onClick={() => {
                  setNewName(userInfo.name);
                  setIsEditingName(true);
                }}
                        className="text-blue-500">이름 변경
                </button>
              </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">계정 생성일:</label>
          <p className="text-gray-600">{new Date(
              userInfo.createdAt).toLocaleDateString()}</p>
        </div>


        <div className="flex flex-col items-center gap-4 mt-10">
          {["google", "kakao", "naver"].map((provider) => {
            const isLinked = getSocialAccountStatus(provider) !== "미연동";
            const socialStatus = getSocialAccountStatus(provider);

            return (
                <Card key={provider}
                      className="w-[350px] flex flex-col space-y-1.5">
                  <CardContent className="flex justify-between p-3">
                    <div className="flex">
                      <Image src={providerIconPath(provider)} priority={true}
                             alt={`${provider} logo`} className="mr-3"
                             width={36} height={36}/>

                      <h3 className="font-semibold  flex items-center min-w-10">
                        {provider === "google" ? "구글" : provider === "kakao"
                            ? "카카오" : "네이버"}
                      </h3>
                    </div>
                    {socialStatus === "미연동" ? <div
                            className=" inline-flex items-center rounded-full border px-3 text-sm font-semibold border-transparent bg-red-100 text-red-500">미연동</div>
                        : <div
                            className=" inline-flex items-center rounded-full border px-3 text-sm font-semibold border-transparent bg-blue-100 text-blue-500">연결됨</div>}
                    {isLinked ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                                disabled={isLocalAccount() === false}>연동 해제
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{`${provider} 계정을 연동 해제하시겠습니까?`}</AlertDialogTitle>
                              <AlertDialogDescription>
                                이 계정을 연동 해제하면 더 이상 {provider}를 통해 로그인할 수 없습니다.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <Button onClick={() => handleSocialAccountToggle(
                                  provider)}>연동 해제</Button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                                className={isLocalAccount() ? "opacity-100"
                                    : "opacity-50"}
                                onClick={isLocalAccount()
                                    ? () => handleSocialAccountToggle(provider)
                                    : null}>연동하기</Button>
                          </TooltipTrigger>
                          <TooltipContent>추가 연동은 일반계정에서 가능합니다.</TooltipContent>
                        </Tooltip>
                    )}
                  </CardContent>
                </Card>
            );
          })}
        </div>
        <div className="flex justify-end mt-10">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">회원탈퇴</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>회원 탈퇴를 진행 하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  탈퇴 시 모든 정보가 삭제되며, 복구가 불가능 합니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                    className="bg-blue-500 text-white">Cancel</AlertDialogCancel>
                <Button variant="secondary" onClick={deleteUserProfile}>탈퇴
                  진행</Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
  );
}

UserInfoPage.getLayout = function getLayout(page) {
  return <HeaderLayout>{page}</HeaderLayout>;
}

export default withAuth(UserInfoPage);