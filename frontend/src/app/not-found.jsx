import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import HeaderLayout from "@/components/HeaderLayout";
import * as React from "react";
import {AlertTriangle} from "lucide-react";

export default function PageNotFound() {
  return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-gray-100">
        <Card className="w-[350px]">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-yellow-400"/>
            </div>
            <CardTitle className="text-2xl font-bold">오류가 발생했습니다</CardTitle>
            <CardDescription>요청하신 페이지를 찾을 수 없습니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.<br/>
              입력하신 주소가 정확한지 다시 한 번 확인해 주세요.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Button onClick={() => window.history.back()}>
                돌아가기
              </Button>
            </Button>
          </CardFooter>
        </Card>
      </div>
  )
}

PageNotFound.getLayout = function getLayout(page) {
  return <HeaderLayout>{page}</HeaderLayout>;
}