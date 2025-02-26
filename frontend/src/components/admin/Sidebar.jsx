import { Users, BarChart2, Settings, MessageSquare, Activity } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-64 bg-gray-100 p-4 hidden md:block">
      <nav className="space-y-2">
        <Button
          variant={activeTab.id === "users" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab({id : "users", title:"사용자 관리"})}
        >
          <Users className="mr-2 h-4 w-4" />
          사용자 관리
        </Button>
        <Button
          variant={activeTab.id === "stats" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab({id:"stats", title:"통계 및 모니터링"})}
        >
          <BarChart2 className="mr-2 h-4 w-4" />
          통계 및 모니터링
        </Button>
        <Button
          variant={activeTab.id === "notices" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab({id:"notices", title:"공지 및 설정"})}
        >
          <Settings className="mr-2 h-4 w-4" />
          공지 및 설정
        </Button>
        <Button
          variant={activeTab.id === "feedback" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab({id:"feedback", title:"건의 및 문의"})}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          건의 및 문의
        </Button>
        <Button
          variant={activeTab.id === "status" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab({id:"status", title:"서비스 상태"})}
        >
          <Activity className="mr-2 h-4 w-4" />
          서비스 상태
        </Button>
        <Button
            variant={activeTab.id === "visitors" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab({id:"visitors", title:"방문자 목록"})}
        >
          <BarChart2 className="mr-2 h-4 w-4" />
          방문자 목록
        </Button>
      </nav>
    </aside>
  )
}

