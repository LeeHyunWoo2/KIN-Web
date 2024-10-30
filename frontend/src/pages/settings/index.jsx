import { useState } from 'react'; // 상태 관리를 위한 useState 추가
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/components/settings/profile-form";
import { AccountForm } from "@/components/settings/account-form";
import { AppearanceForm } from "@/components/settings/appearance-form";
import { DisplayForm } from "@/components/settings/display-form";
import { NotificationsForm } from "@/components/settings/notifications-form";
import SettingsLayout from "@/layouts/settings/SettingsLayout";

const settingsItems = [
  {
    key: "account", // 고유 키
    title: "Account",
    content: "Update your account settings. Set your preferred language and timezone."
  },
  {
    key: "profile",
    title: "Profile",
    content: "This is how others will see you on the site."
  },
  {
    key: "appearance",
    title: "Appearance",
    content: "Customize the appearance of the app. Automatically switch between day and night themes."
  },
  {
    key: "notifications",
    title: "Notifications",
    content: "Configure how you receive notifications."
  },
  {
    key: "display",
    title: "Display",
    content: "Turn items on or off to control what's displayed in the app."
  },
];

// 폼 컴포넌트를 선택할 함수
const formComponentMap = {
  account: AccountForm,
  profile: ProfileForm,
  appearance: AppearanceForm,
  notifications: NotificationsForm,
  display: DisplayForm,
};

export default function SettingsProfilePage() {
  // 기본 상태를 'profile'로 설정 (초기 화면에 Profile 표시)
  const [currentSection, setCurrentSection] = useState("profile");

  // 현재 섹션에 맞는 헤더 텍스트와 컴포넌트 선택
  const currentSectionData = settingsItems.find(section => section.key === currentSection);
  const CurrentFormComponent = formComponentMap[currentSection]; // 선택된 폼 컴포넌트
  return (
        <SettingsLayout
          items={settingsItems}
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
          >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">{currentSectionData?.title}</h3> {/* 제목 출력 */}
            <p className="text-sm text-muted-foreground">
              {currentSectionData?.content} {/* 내용 텍스트 출력 */}
            </p>
          </div>
          <Separator />
          {/* 동적으로 선택된 폼 컴포넌트 렌더링 */}
          {CurrentFormComponent && <CurrentFormComponent />}
        </div>
      </SettingsLayout>
  );
}
