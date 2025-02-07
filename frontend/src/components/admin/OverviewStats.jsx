"use client"

import {
  Card,
  CardContent,
  CardDescription, CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {TrendingDown} from "lucide-react";

// 임시 데이터
const stats = [
  { title: "총 사용자 수", value: "1,234" },
  { title: "총 노트 수", value: "5,678" },
  { title: "휴지통 비율", value: "2.5%" },
]

const activityLog = [
  { id: 1, user: "이현우", action: "로그인", timestamp: "2024-12-03 09:00:00" },
  { id: 2, user: "조건재", action: "노트 작성", timestamp: "2024-12-04 10:30:00" },
]

const chartData = [
  { name: '1월', 작성: 400, 삭제: 240 },
  { name: '2월', 작성: 300, 삭제: 139 },
  { name: '3월', 작성: 200, 삭제: 900 },
  { name: '4월', 작성: 278, 삭제: 390 },
  { name: '5월', 작성: 789, 삭제: 480 },
  { name: '6월', 작성: 448, 삭제: 180 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
}

export function OverviewStats() {
  return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader
                    className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle
                      className="text-sm font-medium">{stat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
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
              <CardDescription>2024년 6월</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="-ml-6">
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid/>
                  <XAxis
                      dataKey="name"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                  />
                  <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dashed"/>}
                  />
                  <Bar dataKey="작성" fill="var(--color-desktop)" radius={4}/>
                  <Bar dataKey="삭제" fill="var(--color-mobile)" radius={4}/>
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                지난 달 대비 노트 생성 43.2% 감소 <TrendingDown className="h-4 w-4"/>
              </div>
              <div className="leading-none text-muted-foreground">
                지난 6개월간 매달 노트 생성/삭제 데이터
              </div>
            </CardFooter>
          </Card>
        </div>
        </div>
        )
        }

