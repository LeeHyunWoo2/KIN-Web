import { useState } from 'react'
import { UserManagement } from '@/components/admin/UserManagement'
import { Statistics } from '@/components/admin/Statistics'
import { NoticeAndSettings } from '@/components/admin/NoticeAndSettings'
import { Sidebar } from '@/components/admin/Sidebar'
import { Feedback } from '@/components/admin/Feedback'
import { ServiceStatus } from '@/components/admin/ServiceStatus'
import HeaderLayout from "@/components/HeaderLayout";
import * as React from "react";
import withAdminAuth from "@/lib/hoc/withAdminAuth";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users")

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UserManagement />
      case "stats":
        return <Statistics />
      case "notices":
        return <NoticeAndSettings />
      case "feedback":
        return <Feedback />
      case "status":
        return <ServiceStatus />
      default:
        return <UserManagement />
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">관리자 대시보드</h1>
        {renderContent()}
      </main>
    </div>
  )
}

AdminDashboard.getLayout = function getLayout(page) {
  return <HeaderLayout>{page}</HeaderLayout>;
}

export default withAdminAuth(AdminDashboard);