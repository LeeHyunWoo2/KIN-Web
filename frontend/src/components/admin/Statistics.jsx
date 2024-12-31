import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewStats } from './OverviewStats'
import { UserActivity } from './UserActivity'

export function Statistics() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">전체 통계</TabsTrigger>
        <TabsTrigger value="activity">사용자 활동</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <OverviewStats />
      </TabsContent>
      <TabsContent value="activity">
        <UserActivity />
      </TabsContent>
    </Tabs>
  )
}

