"use client"

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription, CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {AlertTriangle, CheckCircle} from 'lucide-react';
import {
  ChartTooltip,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis, YAxis
} from "recharts";
import {
  Select,
  SelectContent, SelectGroup, SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {Separator} from "@/components/ui/separator";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

export function ServiceStatus() {
  const [serverStatus, setServerStatus] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loadAverageData, setLoadAverageData] = useState([]);
  const [refreshInterval, setRefreshInterval] = useState(5); // 기본값 5초
  const [webSocket, setWebSocket] = useState(null);
  const [isSampleData, setIsSampleData] = useState(false);

  // 웹소켓 연결
  useEffect(() => {
    const socket = new WebSocket(process.env.NEXT_PUBLIC_API_URL.replace('http', 'ws') + '/status');

    socket.onopen = () => {
      setWebSocket(socket)
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const now = Date.now(); // UTC 기준으로 경과 시간 계산

      // 테스트용 랜덤값 생성 함수
      const generateRandomLoad = () => {
        const base = parseFloat((Math.random() * 2).toFixed(2)); // 0 ~ 2 사이 값 생성
        return {
          load1: base, // 1분 평균
          load5: parseFloat((base * 0.8 + Math.random() * 0.4).toFixed(2)), // 5분 평균은 1분 평균보다 안정적
          load15: parseFloat((base * 0.65 + Math.random() * 0.35).toFixed(2)), // 15분 평균
        };
      };

      if (data.loadAverage) {
        let loadAverage;

        // 랜덤 모드 활성화 시 랜덤값 사용
        if (isSampleData) {
          loadAverage = generateRandomLoad();
        } else {
          // 수신된 데이터를 그대로 사용
          loadAverage = {
            load1: data.loadAverage[0],
            load5: data.loadAverage[1],
            load15: data.loadAverage[2],
          };
        }

        setLoadAverageData((prevData) => [
          // 기존 데이터의 경과 시간 업데이트
          ...prevData
          .map((entry) => ({
            ...entry,
            elapsed: Math.floor((now - entry.timestamp) / 1000), // 경과 시간 계산
          }))
          .slice(-29), // 최대 30개 데이터 유지
          {
            timestamp: now, // Unix Timestamp
            elapsed: 0, // 최신 데이터는 항상 경과 시간 0초
            ...loadAverage, // 랜덤 또는 서버에서 수신된 데이터 추가
          },
        ]);
      }

      setServerStatus((prevStatus) => {
        if (!prevStatus) {
          // 첫 데이터 수신 시 모든 필드를 저장
          return data;
        }

        // 이후 데이터 갱신 시 기존 필드 유지
        return {
          ...prevStatus,
          ...data, // 새로운 필드만 업데이트
        };
      });
    };

    socket.onclose = () => {
      setIsConnected(false);
      setWebSocket(null);
    };

    return () => socket.close();
  }, [isSampleData]);

  // 갱신 주기 변경 핸들러
  const handleIntervalChange = (value) => {
    setRefreshInterval(parseInt(value, 10));
    if (webSocket) {
      webSocket.send(JSON.stringify({ type: "setInterval", interval: parseInt(value, 10) }));
    }
  };

  if (!serverStatus) {
    return <div>서버 상태 로드 중...</div>; // 데이터가 없을 때
  }

  const { mongodb, redis, uptime, nodeUptime, memoryUsage = {}, cpuUsage = {}, cpuCount, cpuModel, cpuSpeed,
    cpuUsagePerCore, cpuTotalUsage, cpuFreeMemory, serverTime} = serverStatus;
  const { heapUsed = 0, heapTotal = 0 } = memoryUsage;
  const { user = 0, system = 0 } = cpuUsage;
  const totalMemoryGB = (cpuTotalUsage / (1024 ** 3)).toFixed(2);
  const freeMemoryGB = (cpuFreeMemory / (1024 ** 3)).toFixed(2);
  const cpuUsageFormatted = cpuUsagePerCore.map((usage, index) => ({
    core: `Thread ${index + 1} `,
    time: `${(usage / 1000).toFixed(2)}`,
  }));


  return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader
                className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">MongoDB 상태</CardTitle>
              {mongodb === 'Connected' ? (
                  <CheckCircle className="h-4 w-4 text-green-500"/>
              ) : (
                  <AlertTriangle className="h-4 w-4 text-red-500"/>
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mongodb}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader
                className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Redis 상태</CardTitle>
              {redis === 'Connected' ? (
                  <CheckCircle className="h-4 w-4 text-green-500"/>
              ) : (
                  <AlertTriangle className="h-4 w-4 text-red-500"/>
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{redis}</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>서버 시간</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold">{serverTime}</div>
            </CardContent>
            <CardHeader>
              <CardTitle>서버 리소스 상태</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>항목</TableHead>
                    <TableHead>값</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Uptime</TableCell>
                    <TableCell>{Math.floor(uptime / 3600)} 시간</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>NodeUptime</TableCell>
                    <TableCell>{Math.floor(nodeUptime / 3600)} 시간</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>메모리 사용량</TableCell>
                    <TableCell>
                      {`${(heapUsed / 1024 / 1024).toFixed(
                          2)} MB`} / {`${(heapTotal / 1024 / 1024).toFixed(
                        2)} MB`}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>총 메모리</TableCell>
                    <TableCell>
                      {totalMemoryGB} GB
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>사용 가능한 메모리</TableCell>
                    <TableCell>
                      {freeMemoryGB} GB
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>CPU 사용량</TableCell>
                    <TableCell>
                      User: {(user / 1000).toFixed(2)}ms, System: {(system / 1000).toFixed(2)}ms
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Separator/>
              <div className="grid grid-cols-[33%_auto] text-sm">
                  <div className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted
                  flex items-center ">
                    <div className="text-center p-2">
                      스레드 개별 사용량(ms)
                    </div>
                </div>
                <div>
                    {cpuUsageFormatted.map((core) => (
                  <div className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" key={core.core}>
                        <div className="p-2 align-middle">
                          {core.core}: {core.time}
                        </div>
                  </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <div>
            <div className="flex items-center gap-2">
            <Label className="text-base">갱신 주기</Label>
            <Select defaultValue="5" value={String(refreshInterval)} onValueChange={handleIntervalChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="5초" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="1">1초</SelectItem>
                  <SelectItem value="5">5초</SelectItem>
                  <SelectItem value="10">10초</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            </div>
            <Card className="my-4">
              <CardHeader>
                <div className="flex items-center gap-2">
                <CardTitle>
                  CPU 평균 부하
                </CardTitle>
                  <Tooltip>
                    <TooltipTrigger>
                    <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md
                     text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
                      disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 ml-2
                      border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                            onClick={() => setIsSampleData(isSampleData => !isSampleData)}
                    >샘플 데이터 모드 {isSampleData ? '끄기' : '켜기'}</div>
                    </TooltipTrigger>
                    <TooltipContent className="text-sm">
                    서버의 활동이 없거나, 서버가 윈도우 환경일 경우 값이 0입니다.<br/>
                    누르면 임시 데이터로 전환됩니다. (차트 예시용)
                    </TooltipContent>
                  </Tooltip>
                </div>
                <CardDescription>1분, 5분, 15분간 발생한 CPU 부하의 평균을 모니터링 합니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart accessibilityLayer data={loadAverageData} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={true} />
                    <XAxis
                        dataKey="elapsed"
                        tickLine={true}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value}
                    />
                    <YAxis
                        domain={[0, 2]}
                        tickCount={5}
                        tickFormatter={(value) => value.toFixed(1)}
                    />
                    <ChartTooltip
                        cursor={true}
                        content={({ payload }) =>
                            payload && payload.length ? (
                                <div className="p-2 bg-white rounded shadow text-xs">
                                  <p>{`${payload[0].payload.elapsed}초 전`}</p>
                                  <p>{`1m : ${payload[0].payload.load1.toFixed(2)}`}</p>
                                  <p>{`5m : ${payload[0].payload.load5.toFixed(2)}`}</p>
                                  <p>{`15m : ${payload[0].payload.load15.toFixed(2)}`}</p>
                                </div>
                            ) : null
                        }
                    />
                    <Line
                        type="linear"
                        dataKey="load1"
                        isAnimationActive={false}
                        stroke="#EE6FA5"
                        strokeWidth={2}
                        dot={false}
                        name="1m"
                    />
                    <Line
                        type="linear"
                        dataKey="load5"
                        isAnimationActive={false}
                        stroke="#3872AE"
                        strokeWidth={2}
                        dot={false}
                        name="5m"
                    />
                    <Line
                        type="linear"
                        dataKey="load15"
                        isAnimationActive={false}
                        stroke="#36AC60"
                        strokeWidth={2}
                        dot={false}
                        name="15m"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
              <div className="flex justify-center px-20 -mt-2 mb-4">
                <div className="flex items-center gap-10">
                  <div className="flex items-center gap-2">
      <span
          className="w-3 h-3 rounded-full"
          style={{backgroundColor: "#EE6FA5"}}/>
                    <span>1분 </span>
                    <span className="text-sm -ml-1 text-gray-600">
        ({loadAverageData.length > 0 ? loadAverageData[loadAverageData.length
                    - 1].load1.toFixed(2) : '0.00'})
      </span>
                  </div>
                  <div className="flex items-center gap-2">
      <span
          className="w-3 h-3 rounded-full"
          style={{backgroundColor: "#3872AE"}}/>
                    <span>5분</span>
                    <span className="text-sm -ml-1 text-gray-600">
        ({loadAverageData.length > 0 ? loadAverageData[loadAverageData.length
                    - 1].load5.toFixed(2) : '0.00'})
      </span>
                  </div>
                  <div className="flex items-center gap-2">
      <span
          className="w-3 h-3 rounded-full"
          style={{backgroundColor: "#36AC60"}}/>
                    <span>15분</span>
                    <span className="text-sm -ml-1 text-gray-600">
        ({loadAverageData.length > 0 ? loadAverageData[loadAverageData.length
                    - 1].load15.toFixed(2) : '0.00'})
      </span>
                  </div>
                </div>
              </div>
              <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 font-medium leading-none">
                      실시간 모니터링 상태 <span className="text-green-500">정상</span>
                    </div>
                    <div className="flex items-center gap-2 leading-none text-muted-foreground">
                      업데이트 간격 : {refreshInterval}초
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          <Card>
            <CardContent>
              <CardHeader>
                <CardTitle>서버 사양</CardTitle>
              </CardHeader>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      CPU 모델: {cpuModel}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      프로세서 스레드 수: {cpuCount}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      CPU 속도: {cpuSpeed}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          </div>
        </div>
        </div>
        );
}