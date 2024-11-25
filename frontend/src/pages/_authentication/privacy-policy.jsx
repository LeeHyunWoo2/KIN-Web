import HeaderLayout from "@/components/HeaderLayout";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import * as React from "react";
import {Label} from "@/components/ui/label";

export default function PrivacyPolicy() {
  return (
      <Card className="max-w-xl mx-auto mt-5">
        <CardHeader>
          <CardTitle className="text-2xl">Keep Idea Note - 개인정보처리방침</CardTitle>
        </CardHeader>
        <CardContent className="p-10 -mt-10">
          <Label className="text-[20px]">1. 수집하는 개인정보 항목</Label><br/>
          - 이메일 주소<br/>
          - 닉네임

          <br/><br/><Label className="text-[20px]"> 2. 개인정보의 수집 및 이용 목적</Label><br/>
          - KeepIdeaNote 서비스 로그인 및 사용자 인증<br/>
          - 서비스 제공 및 사용자 편의성 향상

          <br/><br/><Label className="text-[20px]">3. 개인정보의 보유 및 이용 기간</Label><br/>
          - 회원 탈퇴 시 즉시 삭제<br/>
          - 관련 법령에 따라 일정 기간 보존이 필요한 경우 해당 기간 동안 보관

          <br/><br/><Label className="text-[20px]">4. 개인정보의 제3자 제공</Label><br/>
          - 수집된 개인정보는 제3자에게 제공되지 않습니다.

          <br/><br/><Label className="text-[20px]">5. 개인정보 처리 위탁</Label><br/>
          - 개인정보 처리를 제3자에게 위탁하지 않습니다.

          <br/><br/><Label className="text-[20px]">6. 이용자의 권리 및 행사 방법</Label><br/>
          - 이용자는 언제든지 개인정보 열람, 정정, 삭제를 요청할 수 있습니다.<br/>
          - 요청 방법: 이메일 (triaxis159@email.com)

          <br/><br/><Label className="text-[20px]">7. 개인정보 보호책임자</Label><br/>
          - 이름: 이현우<br/>
          - 연락처: 010-8849-5745<br/>
          - 이메일: triaxis159@email.com<br/>
        </CardContent>
      </Card>
  )
}
PrivacyPolicy.getLayout = function getLayout(page) {
  return <HeaderLayout>{page}</HeaderLayout>
}