import HeaderLayout from "@/components/HeaderLayout";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import * as React from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import { PolicyContentKR, PolicyContentEN} from "@/components/auth/PolicyContent";

export default function PrivacyPolicy() {
  return (
      <Tabs defaultValue="kr" className="max-w-2xl mx-auto mt-5 mb-5" >
          <TabsList className="grid w-full grid-cols-2 min-h-10 mb-5">
            <TabsTrigger value="kr" className="min-h-fit text-[16px] font-bold">한국어</TabsTrigger>
            <TabsTrigger value="en" className="min-h-fit text-[16px] font-bold">English</TabsTrigger>
          </TabsList>
        <Card>
          <TabsContent value="kr">
            <CardHeader>
              <CardTitle className="text-2xl">Keep Idea Note -
                개인정보처리방침</CardTitle>
            </CardHeader>
            <CardContent className="p-10 -mt-10">
              <PolicyContentKR/>
            </CardContent>
          </TabsContent>


          <TabsContent value="en">
            <CardHeader>
              <CardTitle className="text-2xl">Keep Idea Note - Privacy
                Policy</CardTitle>
            </CardHeader>
            <CardContent className="p-10 -mt-10">
              <PolicyContentEN/>
            </CardContent>
          </TabsContent>
      </Card>
      </Tabs>
  );
}
PrivacyPolicy.getLayout = function getLayout(page) {
  return <HeaderLayout>{page}</HeaderLayout>
}