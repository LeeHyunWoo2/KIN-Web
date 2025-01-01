import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react'

// 임시 데이터
const serverStatus = [
  { name: "Oracle Cloud", status: "정상", responseTime: "15ms" },
  { name: "Redis", status: "정상", responseTime: "50ms" },
  { name: "MongoDB", status: "정상", responseTime: "120ms" },
  { name: "Uploadthing", status: "비정상", responseTime: "2120ms" },
]

const errorLogs = [
  { id: 1, date: "2024-12-01 09:00:00", errorCode: "500", errorMessage: "Internal Server Error", apiPath: "/api/users" },
  { id: 2, date: "2024-12-01 10:30:00", errorCode: "404", errorMessage: "Not Found", apiPath: "/api/notes" },
  // ... 더 많은 로그 데이터
]

export function ServiceStatus() {
  const [dateFilter, setDateFilter] = useState("")
  const [apiFilter, setApiFilter] = useState("")

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {serverStatus.map((server) => (
          <Card key={server.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{server.name} 상태</CardTitle>
              {server.status === "정상" ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{server.status}</div>
              <p className="text-xs text-muted-foreground">응답 시간: {server.responseTime}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>에러 로그</span>
            <Button size="sm" variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              새로고침
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="날짜로 필터링..."
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="max-w-sm"
            />
            <Input
              placeholder="API 경로로 필터링..."
              value={apiFilter}
              onChange={(e) => setApiFilter(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>날짜</TableHead>
                <TableHead>에러 코드</TableHead>
                <TableHead>에러 메시지</TableHead>
                <TableHead>API 경로</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {errorLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.date}</TableCell>
                  <TableCell>{log.errorCode}</TableCell>
                  <TableCell>{log.errorMessage}</TableCell>
                  <TableCell>{log.apiPath}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

