import {useEffect, useState} from 'react'
import { UserManagement } from '@/components/admin/UserManagement'
import { Statistics } from '@/components/admin/Statistics'
import { NoticeAndSettings } from '@/components/admin/NoticeAndSettings'
import { Sidebar } from '@/components/admin/Sidebar'
import { Feedback } from '@/components/admin/Feedback'
import { ServiceStatus } from '@/components/admin/ServiceStatus'
import HeaderLayout from "@/components/HeaderLayout";
import * as React from "react";
import withAdminAuth from "@/lib/hoc/withAdminAuth";
import VisitorList from "@/components/admin/VIsitorList";
import { getVisitorList } from "@/services/visitorAPIService"

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState({id:"visitors", title:"방문자 목록"})
  const [visitors, setVisitors] = useState([]);


  useEffect(() => {
    const loadVisitors = async () => {
      const data = await getVisitorList();
      setVisitors(data);
    };
    loadVisitors();
  }, []);

  const renderContent = () => {
    switch (activeTab.id) {
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
      case "visitors":
        return <VisitorList visitors={visitors}/>
      default:
        return <VisitorList visitors={visitors}/>
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">{activeTab ? activeTab.title : "사용자 관리"}</h1>
        {renderContent()}
      </main>
    </div>
  )
}

AdminDashboard.getLayout = function getLayout(page) {
  return <HeaderLayout>{page}</HeaderLayout>;
}

export default withAdminAuth(AdminDashboard);