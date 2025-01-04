import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  LabelList
} from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent, ChartTooltip, ChartTooltipContent
} from "@/components/ui/chart";

const activityData = [
  { date: '12 - 29', logins: 120, notes: 45 },
  { date: '12 - 30', logins: 150, notes: 55 },
  { date: '12 - 31', logins: 180, notes: 70 },
  { date: '01 - 01', logins: 200, notes: 80 },
  { date: '01 - 02', logins: 250, notes: 100 },
  { date: '01 - 03', logins: 180, notes: 60 },
  { date: '01 - 04', logins: 140, notes: 50 },
]

const activityRatio = [
  { name: 'active', value: 70, fill: "var(--color-active)" },
  { name: 'deactivate', value: 30, fill: "var(--color-deactivate)"},
]

const chartConfig = {
  login: {
    label: "로그인",
    color: "hsl(var(--chart-1))",
  },
  createNote: {
    label: "노트작성",
    color: "hsl(var(--chart-2))",
  },
}

const pieChartConfig = {
  active: {
    label: "활성",
    color: "hsl(var(--chart-5))",
  },
  deactivate: {
    label: "비활성",
    color: "hsl(var(--chart-1))",
  }
}

export function UserActivity() {
  return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader
                className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 활동 횟수</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5,432</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader
                className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">최근 7일 활성
                사용자</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">890</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>최근 7일 활동 그래프</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="-ml-6">
                <BarChart data={activityData}>
                  <CartesianGrid/>
                  <XAxis
                      dataKey="date"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                  />
                  <YAxis
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                  />
                  <Tooltip/>
                  <Bar dataKey="logins" fill="var(--color-login)" name="로그인"/>
                  <Bar dataKey="notes" fill="var(--color-createNote)" name="노트 작성"/>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
              <CardTitle>활동 비율</CardTitle>
              <CardDescription>2024년 12월</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                  config={pieChartConfig}
                  className="mx-auto aspect-square max-h-[300px]"
              >
                <PieChart>
                  <ChartTooltip
                      content={<ChartTooltipContent nameKey="name" hideLabel />}
                  />
                  <Pie data={activityRatio} dataKey="value" />
                  <ChartLegend
                      content={<ChartLegendContent nameKey="name" />}
                      className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center text-sm"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        </div>
        )
        }

