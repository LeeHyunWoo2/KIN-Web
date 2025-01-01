import { Users, BarChart2, Settings, MessageSquare, Activity } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-64 bg-gray-100 p-4 hidden md:block">
      <nav className="space-y-2">
        <Button
          variant={activeTab === "users" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("users")}
        >
          <Users className="mr-2 h-4 w-4" />
          사용자 관리
        </Button>
        <Button
          variant={activeTab === "stats" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("stats")}
        >
          <BarChart2 className="mr-2 h-4 w-4" />
          통계 및 모니터링
        </Button>
        <Button
          variant={activeTab === "notices" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("notices")}
        >
          <Settings className="mr-2 h-4 w-4" />
          공지 및 설정
        </Button>
        <Button
          variant={activeTab === "feedback" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("feedback")}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          건의 및 문의
        </Button>
        <Button
          variant={activeTab === "status" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("status")}
        >
          <Activity className="mr-2 h-4 w-4" />
          서비스 상태
        </Button>
      </nav>
    </aside>
  )
}

