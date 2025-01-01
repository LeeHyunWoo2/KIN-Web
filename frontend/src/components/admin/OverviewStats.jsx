import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// 임시 데이터
const stats = [
  { title: "총 사용자 수", value: "1,234" },
  { title: "총 노트 수", value: "5,678" },
  { title: "휴지통 비율", value: "2.5%" },
]

const activityLog = [
  { id: 1, user: "이현우", action: "로그인", timestamp: "2024-12-03 09:00:00" },
  { id: 2, user: "조건재", action: "노트 작성", timestamp: "2024-12-04 10:30:00" },
  // ... 더 많은 로그 데이터
]

const chartData = [
  { name: '1월', 작성: 400, 삭제: 240 },
  { name: '2월', 작성: 300, 삭제: 139 },
  { name: '3월', 작성: 200, 삭제: 980 },
  { name: '4월', 작성: 278, 삭제: 390 },
  { name: '5월', 작성: 189, 삭제: 480 },
]

export function OverviewStats() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>사용자 활동 로그</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사용자</TableHead>
                <TableHead>작업</TableHead>
                <TableHead>시간</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityLog.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>노트 작성/삭제 트렌드</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="작성" fill="#8884d8" />
              <Bar dataKey="삭제" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

