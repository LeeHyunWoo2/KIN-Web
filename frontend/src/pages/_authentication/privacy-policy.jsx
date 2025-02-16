import HeaderLayout from "@/components/HeaderLayout";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import * as React from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

export default function PrivacyPolicy() {
  return (
      <Tabs defaultValue="kr" className="max-w-2xl mx-auto mt-5 mb-5" >
          <TabsList className="grid w-full grid-cols-2 min-h-10 mb-5">
            <TabsTrigger value="kr" className="min-h-fit text-[16px] font-bold">한국어</TabsTrigger>
            <TabsTrigger value="eng" className="min-h-fit text-[16px] font-bold">English</TabsTrigger>
          </TabsList>
        <Card>
          <TabsContent value="kr">
            <CardHeader>
              <CardTitle className="text-2xl">Keep Idea Note -
                개인정보처리방침</CardTitle>
            </CardHeader>
            <CardContent className="p-10 -mt-10">
              <section className="mb-6">
                <h2 className="text-lg font-bold mb-2">1. 수집하는 개인정보 항목</h2>
                <ul className="list-disc list-inside">
                  <li>필수 항목: 이메일 주소, 닉네임</li>
                  <li>선택 항목: 프로필 사진</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-lg font-bold mb-2">2. 개인정보의 수집 및 이용 목적</h2>
                <ul className="list-disc list-inside">
                  <li>회원 관리: Keep Idea Note 서비스 로그인 및 사용자 인증</li>
                  <li>서비스 제공: 메모 및 노트 관리 서비스 제공</li>
                  <li>서비스 개선: 사용자 편의성 향상</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-lg font-bold mb-2">3. 개인정보의 보유 및 이용 기간</h2>
                <ul className="list-disc list-inside">
                  <li>모든 정보는 회원 탈퇴 시 즉시 삭제됩니다.</li>
{/*                  <li>관련 법령에서 정한 기간 동안 보존이 필요한 경우 해당 법령에 따라 보관</li>
                  <li>예: 전자상거래 등에서의 소비자 보호에 관한 법률에 따른 경우, 최대 5년 보관</li>*/}
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-lg font-bold mb-2">4. 개인정보의 제3자 제공</h2>
                <p>수집된 개인정보는 원칙적으로 제3자에게 제공되지 않습니다.</p>
                <p>다만, 법령에 따라 요청이 있는 경우에 한해 제공될 수 있습니다.</p>
              </section>

              <section className="mb-6">
                <h2 className="text-lg font-bold mb-2">5. 개인정보 처리 위탁</h2>
                <p>Keep Idea Note는 개인정보 처리를 제3자에게 위탁하지 않습니다.</p>
              </section>

              <section className="mb-6">
                <h2 className="text-lg font-bold mb-2">6. 이용자의 권리 및 행사 방법</h2>
                <ul className="list-disc list-inside">
                  <li>이용자는 언제든지 개인정보 열람, 정정, 삭제를 요청할 수 있습니다.</li>
                  <li>요청 방법: 이메일 <a href="mailto:triaxis159@email.com"
                                    className="text-blue-500 underline">triaxis159@email.com</a> 로
                    문의
                  </li>
                  <li>Keep Idea Note는 요청에 지체 없이 응답하며 필요한 조치를 신속히 이행합니다.</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-lg font-bold mb-2">7. 쿠키 및 기타 기술의 사용</h2>
                <p>Keep Idea Note는 광고를 게재하지 않으며, 사용자 데이터를 분석하거나 광고 목적으로 쿠키를 사용하지
                  않습니다.</p>
              </section>

              <section className="mb-6">
                <h2 className="text-lg font-bold mb-2">8. 개인정보 보호책임자</h2>
                <ul className="list-none">
                  <li><strong>이름:</strong> &nbsp;이현우</li>
                  <li><strong>연락처:</strong> &nbsp;010-8849-5745</li>
                  <li><strong>이메일:</strong> <a
                      href="mailto:triaxis159@email.com"
                      className="text-blue-500 underline">&nbsp;triaxis159@email.com</a>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold mb-2">9. 개인정보처리방침의 변경</h2>
                <p>본 개인정보처리방침은 법령이나 서비스 변경사항에 따라 수정될 수 있습니다.</p>
                <p>변경사항은 웹사이트 공지사항을 통해 사전에 안내드립니다.</p>
              </section>
            </CardContent>
          </TabsContent>


          <TabsContent value="eng">
            <CardHeader>
              <CardTitle className="text-2xl">Keep Idea Note - Privacy
                Policy</CardTitle>
            </CardHeader>
            <CardContent className="p-10 -mt-10">
              <section className="mb-6">
                <h2 className="text-lg font-bold mb-2">1. Personal Information We Collect </h2>
                <ul className="list-disc list-inside">
                  <li>Required: Email address, Nickname</li>
                  <li>Optional: Profile picture</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-lg font-bold mb-2">2. Purpose of Collecting
                  and Using Personal Information</h2>
                <ul className="list-disc list-inside">
                  <li>Account Management: To enable login and user
                    authentication<br/></li>
                  <ol className="pl-6">for the Keep Idea Note service.</ol>
                  <li>Service Provision: To provide note and memo management
                    services.
                  </li>
                  <li>Service Improvement: To enhance user convenience and
                    improve<br/>
                  </li>
                  <ol className="pl-6"> service quality.</ol>

                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-lg font-bold mb-2">3. Retention and Use
                  Period
                  of Personal Information</h2>
                <ul className="list-disc list-inside">
                  <li>Immediate Deletion Upon Account Deletion: Personal
                    information <br/></li>
                  <ol className="pl-6">will be deleted immediately upon account
                    deletion.
                  </ol>

{/*                  <li>However, if retention is required by applicable laws, the
                    information<br/></li>
                  <ol className="pl-6"> will be stored for the period specified
                    by such laws.
                  </ol>

                  <li>Example: Up to 5 years as required by the Act on Consumer
                    Protection<br/></li>
                  <ol className="pl-6"> in Electronic Commerce in Korea.
                  </ol>*/}
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-lg font-bold mb-2">4. Provision of Personal
                  Information to Third Parties</h2>
                <p>Personal information collected will not be provided to third
                  parties.</p>
                <p>However, it may be disclosed when required by applicable
                  laws.</p>
              </section>

              <section className="mb-6">
                <h2 className="text-lg font-bold mb-2">5. Outsourcing of
                  Personal
                  Information Processing</h2>
                <p>Keep Idea Note does not outsource the processing of personal
                  information</p><p> to any third parties.</p>
              </section>

              <section className="mb-6">
                <h2 className="text-lg font-bold mb-2">6. User Rights and How to
                  Exercise Them</h2>
                <ul className="list-disc list-inside">
                  <li>Users have the right to access, correct, or delete their
                    personal information<br/></li>
                  <ol className="pl-6"> at any time.
                  </ol>
                  <li>To make a request, please contact us via email at <a
                      href="mailto:triaxis159@email.com"
                      className="text-blue-500 underline">triaxis159@email.com</a>.
                  </li>
                  <li>Keep Idea Note will respond promptly and take necessary
                    actions<br/></li>
                  <ol className="pl-6"> without delay.
                  </ol>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-lg font-bold mb-2">7. Use of Cookies and
                  Other Technologies</h2>
                <p>Keep Idea Note does not display advertisements and does not
                  use cookies</p><p> or other technologies for data analysis or
                advertising purposes.</p>
              </section>

              <section className="mb-6">
                <h2 className="text-lg font-bold mb-2">8. Personal Information
                  Protection Officer</h2>
                <ul className="list-none">
                  <li><strong>Name:</strong> &nbsp;Hyunwoo Lee</li>
                  <li><strong>Contact:</strong> &nbsp;+82-10-8849-5745</li>
                  <li><strong>Email:</strong> <a
                      href="mailto:triaxis159@email.com"
                      className="text-blue-500 underline">&nbsp;triaxis159@email.com</a>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold mb-2">9. Changes to the Privacy
                  Policy </h2>
                <p>This Privacy Policy may be updated to reflect changes in laws
                  or services.</p>
                <p>Any changes will be notified in advance via announcements on
                  the website.</p>
              </section>
            </CardContent>
          </TabsContent>
      </Card>
      </Tabs>
  );
}
PrivacyPolicy.getLayout = function getLayout(page) {
  return <HeaderLayout>{page}</HeaderLayout>
}