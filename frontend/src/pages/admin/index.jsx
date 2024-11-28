import HeaderLayout from "@/components/HeaderLayout";
import {Card} from "@/components/ui/card";
import * as React from "react";

export default function AdminDashboard() {
  return (
      <div defaultValue="kr" className="max-w-2xl mx-auto mt-5 mb-5" >
        <Card>
        관리자 페이지 개발중
        </Card>
      </div>
  );
}

AdminDashboard.getLayout = function getLayout(page) {
  return <HeaderLayout>{page}</HeaderLayout>
}