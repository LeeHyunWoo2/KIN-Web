import React, {useState, useEffect} from 'react';
import axios from 'axios';
import HeaderLayout from "@/components/HeaderLayout";
import { getUserProfile, updateUserProfile, linkSocialAccount, unlinkSocialAccount } from "@/services/authService";
import withAuth from "@/lib/hoc/withAuth";

// 기본 axios 인스턴스 설정
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', // API의 기본 URL 설정
  headers: {
    'Content-Type': 'application/json', // 요청 헤더에 JSON 타입 설정
  },
  withCredentials: true, // 쿠키 전송 설정을 통해 인증 쿠키를 서버에 전달할 수 있도록 함
});

 function UserInfoPage() {
  const [userInfo, setUserInfo] = useState({
    profileIcon: '',
    email: '',
    name: '',
    phone: '',
    createdAt: '',
    socialAccounts: [],
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

   // 사용자 정보 불러오기
   useEffect(() => {
     const fetchUserInfo = async () => {
       try {
         const data = await getUserProfile();
         setUserInfo(data);
         console.log(data);
       } catch (error) {
         console.error('사용자 정보를 불러오는 중 오류 발생:', error);
       }
     };
     fetchUserInfo();
   }, []);

   // 소셜 계정 연동 상태 확인 함수
   const getSocialAccountStatus = (provider) => {
     const account = userInfo.socialAccounts.find((acc) => acc.provider === provider);
     return account ? `연동됨: ${account.providerId}` : '미연동';
   };

   // 로컬 계정 여부 확인 함수
   const isLocalAccount = () => {
     return userInfo.socialAccounts.some(account => account.provider === 'local');
   };

   // 이름 업데이트 함수
   const handleNameUpdate = async () => {
     try {
       await updateUserProfile({ name: newName });
       setUserInfo((prev) => ({ ...prev, name: newName }));
       setIsEditingName(false);
       localStorage.setItem('name', newName);
     } catch (error) {
       console.error('이름 업데이트 중 오류 발생:', error);
     }
   };

   // 전화번호 업데이트 함수
   const handlePhoneUpdate = async () => {
     try {
       await updateUserProfile({ phone: newPhone });
       setUserInfo((prev) => ({ ...prev, phone: newPhone }));
       setIsEditingPhone(false);
     } catch (error) {
       console.error('전화번호 업데이트 중 오류 발생:', error);
     }
   };

   // 소셜 계정 연동 or 해제 함수
   const handleSocialAccountToggle = async (provider) => {
     try {
       if (getSocialAccountStatus(provider) === '미연동') {
         // 소셜 계정 연동 페이지로 리다이렉트
         linkSocialAccount(provider);
       } else {
         // 계정 연동 해제
         const updatedUser = await unlinkSocialAccount(provider);
         setUserInfo(updatedUser);
       }
     } catch (error) {
       console.error(`${provider} 계정 연동 처리 중 오류 발생:`, error);
     }
   };


   return (
      <div className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-4">내 정보</h2>

        {/* 계정 유형 표시 */}
        <div className="mb-4">
          <label className="block text-gray-700">계정 유형:</label>
          <p className="text-gray-600">
            {isLocalAccount() ? '이메일 계정' : '소셜 계정'}
          </p>
        </div>

        {/* 프사 */}
        <div className="mb-4">
          <img
              src={userInfo.profileIcon}
              alt="Profile Icon"
              className="w-24 h-24 rounded-full mx-auto"
          />
          <button className="mt-2 text-blue-500">프로필 사진 변경</button>
        </div>

        {/* 이메일 */}
        <div className="mb-4">
          <label className="block text-gray-700">이메일:</label>
          <p className="text-gray-600">{userInfo.email}</p>
        </div>

        {/* 이름/닉네임 */}
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
                <button onClick={() => setIsEditingName(true)}
                        className="text-blue-500">이름 변경
                </button>
              </div>
          )}
        </div>

        {/* 폰번호 */}
        <div className="mb-4">
          <label className="block text-gray-700">전화번호:</label>
          {isEditingPhone ? (
              <div>
                <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="border p-1 w-full"
                />
                <button onClick={handlePhoneUpdate}
                        className="text-blue-500 mr-2">저장
                </button>
                <button onClick={() => setIsEditingPhone(false)}
                        className="text-gray-500">취소
                </button>
              </div>
          ) : (
              <div>
                <p className="text-gray-600">{userInfo.phone}</p>
                <button onClick={() => setIsEditingPhone(true)}
                        className="text-blue-500">전화번호 변경
                </button>
              </div>
          )}
        </div>

        {/* 가입일 */}
        <div className="mb-4">
          <label className="block text-gray-700">계정 생성일:</label>
          <p className="text-gray-600">{new Date(
              userInfo.createdAt).toLocaleDateString()}</p>
        </div>

        {/* 소셜 연동 정보 */}
        <div>
          <h3 className="text-xl font-semibold mb-2">소셜 계정 연동</h3>
          {['google', 'kakao', 'naver'].map((platform) => (
              <div key={platform} className="mb-2">
                <label
                    className="block text-gray-700 capitalize">{platform}:</label>
                <p className="text-gray-600">
                  {getSocialAccountStatus(platform)}
                </p>
                <button
                    className="text-blue-500"
                    onClick={() => handleSocialAccountToggle(platform)}
                >
                  {getSocialAccountStatus(platform) === '미연동' ? '연동하기'
                      : '연동 해제'}
                </button>
              </div>
          ))}
        </div>
      </div>
  );
 };

UserInfoPage.getLayout = function getLayout(page) {
  return <HeaderLayout>{page}</HeaderLayout>
}

export default withAuth(UserInfoPage);