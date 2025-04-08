import {format} from "date-fns";
import {ko} from "date-fns/locale";
import {Button} from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Search, Eye, EyeOff, Loader2, RefreshCw} from 'lucide-react'
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from '@/components/ui/separator'
import * as React from "react";
import {useEffect, useState} from "react";
import {getVisitorList} from "@/services/visitorAPIService";

const processVisitors = (visitors, isVisitDescend, isTrackingDescend) => {
  const processed = visitors.map(visitor => {
    // IP 변경 이력 시간순 정렬
    visitor.ipHistory.sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt));

    // 활동 기록 정렬
    if (isTrackingDescend) {
      visitor.tracking?.sort((a, b) => new Date(b.visitedAt) - new Date(a.visitedAt)); // 최신순
    } else {
      visitor.tracking?.sort((a, b) => new Date(a.visitedAt) - new Date(b.visitedAt)); // 오래된순
    }

    return {
      uuid: visitor.visitorId,
      visitCount: visitor.visitCount,
      lastVisit: visitor.lastVisit,
      formattedLastVisit: format(new Date(visitor.lastVisit), "yyyy년 M월 d일 a h:mm", { locale: ko }),
      currentIp: visitor.ipHistory.length > 0 ? visitor.ipHistory[0].ip : "알 수 없음",
      ipHistory: visitor.ipHistory.map(ipHis => ({
        ip: ipHis.ip,
        changedAt: format(new Date(ipHis.changedAt), "yy년 M월 d일 HH:mm", { locale: ko })
      })),
      device: visitor.device.replace(/"/g, '') || "알 수 없음",
      browser: visitor.browser || "알 수 없음",
      path: visitor.path || "알 수 없음",
      country: visitor.country === "unknown" ? "알 수 없음" : visitor.country,
      userAgent: visitor.userAgent,
      tracking: visitor.tracking?.length > 0 ? visitor.tracking?.map(tracking => ({
        path: tracking.path || "알 수 없음",
        stay: tracking.stay ? `${Math.floor(tracking.stay / 60000) > 0
                ? `${Math.floor(
                    tracking.stay / 60000)}분 ` : ""}${parseFloat(
                (tracking.stay % 60000) / 1000).toFixed(2).replace(/\.?0+$/, '')}초`
            : "알 수 없음",
        changedAt: format(new Date(tracking.visitedAt), "yy년 M월 d일 HH:mm:ss", { locale: ko })
      })) : []
    };
  });

  // 마지막 방문 날짜 기준 정렬 (오름차순/내림차순)
  if (isVisitDescend){
    processed.sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit));
  } else {
    processed.sort((a, b) => new Date(a.lastVisit) - new Date(b.lastVisit));
  }

  return processed;
};

const calculateMaxPathWidth = (trackingData) => {
  const allPaths = trackingData
  .map(visitor => visitor.tracking.map(track => track.path))
  .flat();
  const maxPathLength = Math.max(...allPaths.map(path => path.length || 0));
  return maxPathLength * 8;
};

const VisitorList = ({ isMobile, title }) => {
  const [visitors, setVisitors] = useState([]);
  const [isVisitDescend, setIsVisitDescend] = React.useState(true);
  const [isTrackingDescend, setIsTrackingDescend] = React.useState(true);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const processedData = processVisitors(visitors, isVisitDescend, isTrackingDescend);
  const [onReload, setOnReload] = React.useState(false);

  const maxPathWidth = calculateMaxPathWidth(processedData);

  useEffect(() => {
    handleOnReload();
  },[])

  const handleOnReload = async () => {
    setOnReload(true);
    const loadVisitors = async () => {
      const data = await getVisitorList();
      setVisitors(data);
    };
    loadVisitors();
    setTimeout(() => {
      setOnReload(false);
    }, 1000);
  }

  return (
      <>
        <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">
          {title}
        </h1>
          <div className="ml-4">
          {!onReload ? (
              <Button variant="outline" onClick={handleOnReload}>
                <RefreshCw />
              </Button>
          ) : (
              <Button variant="outline" disabled>
                <Loader2 className="animate-spin"/>
              </Button>
          )}
          </div>
        </div>
  <div className="space-y-4">
    <Table
        className={`${isMobile ? "min-w-[900px]" : ""}`}
        >
          <TableHeader>
            <TableRow className="hover:bg-background">
              <TableHead className="min-w-36 max-w-[250px]">
                <div className="flex items-center">
                  <span>UUID</span>
                  <span
                      className="ml-5 py-1 px-2 cursor-pointer select-none text-foreground border rounded-md shadow-sm"
                      onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? "접기" : "펼치기"}
                  </span>
                </div>
              </TableHead>
              <TableHead>방문 횟수</TableHead>
              <TableHead>
                <div className="flex justify-between items-center">
                  <span>마지막 방문</span>
                  <span
                      className="mr-10 py-1 px-2 cursor-pointer select-none text-foreground border rounded-md shadow-sm"
                      onClick={() => setIsVisitDescend(!isVisitDescend)}>
                    {isVisitDescend ? "최신순" : "오래된순"}
                  </span>
                </div>
              </TableHead>
              <TableHead>첫 접속 경로</TableHead>
              <TableHead>현재 IP</TableHead>
              <TableHead>국가</TableHead>
              <TableHead>IP 변경 이력</TableHead>
              <TableHead>활동 이력</TableHead>
              <TableHead>디바이스</TableHead>
              <TableHead>브라우저</TableHead>
              <TableHead>UserAgent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedData.map((visitor) => (
                <TableRow key={visitor.uuid}>
                  <TableCell>
                    {isExpanded ? visitor.uuid : visitor.uuid.substring(0,8) + " ..."}
                  </TableCell>
                  <TableCell className="text-center pr-5 text-base">{visitor.visitCount}</TableCell>
                  <TableCell>{visitor.formattedLastVisit}</TableCell>
                  <TableCell>
                    {visitor.path}
                  </TableCell>
                  <TableCell className="min-w-[140px]">
                    <div className="flex items-center justify-between">
                    <div
                        className="font-medium cursor-pointer hover:underline hover:font-semibold"
                        onClick={() => {
                          window.open("https://whatismyipaddress.com/ip/" + visitor.currentIp)
                        }}
                    >
                    {visitor.currentIp}
                    </div>
                      <div className="mr-6"
                           onClick={() => {
                             window.open("https://whatismyipaddress.com/ip/" + visitor.currentIp)
                           }}
                      >
                        <Search size={20} strokeWidth={3.5} className="text-gray-500 hover:text-foreground hover:cursor-pointer transition-colors duration-200" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {visitor.country}
                  </TableCell>
                  <TableCell>
                    {visitor.ipHistory.length > 1 ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">이력 조회</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="px-2">
                          <DropdownMenuLabel>{visitor.ipHistory.length}회 변경됨 (클릭 시 검색)</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="font-medium">
                            <div className="flex space-x-3 items-center">
                              <span className="py-1 -mx-1 min-w-7">번호</span>
                              <Separator orientation="vertical" className="h-7"/>
                              <span className="min-w-28">변경 전 IP</span>
                              <Separator orientation="vertical" className="h-7"/>
                              <span>변경 시각</span>
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                            <ScrollArea className={`pr-3 ${
                              visitor
                              .ipHistory.length > 6 ? "h-[250px]" : ""
                            }`}>
                            {visitor.ipHistory.map((ip, index) => (
                          <DropdownMenuItem key={index} onClick={() => {
                            window.open("https://whatismyipaddress.com/ip/" + ip.ip)
                          }}
                          >
                                <div className="flex space-x-3 items-center">
                                  <span className="text-center border rounded-md min-w-7 py-1  -mx-1">{index + 1}</span>
                                  <Separator orientation="vertical" className="h-7"/>
                                  <span className="min-w-28 font-medium">{ip.ip}</span>
                                  <Separator orientation="vertical" className="h-7"/>
                                  <span>{ip.changedAt}</span>
                                </div>
                          </DropdownMenuItem>
                            ))}
                            </ScrollArea>
                          </DropdownMenuContent>
                            </DropdownMenu>
                    ) : <Button variant="outline" disabled>이력 없음</Button>}
                  </TableCell>
                  <TableCell>
                    {visitor.tracking?.length > 1 ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">이력 조회</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="px-2">
                          <DropdownMenuLabel>총 {visitor.tracking?.length}회 이동</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="font-medium">
                            <div className="flex space-x-3 items-center">
                              <span className="py-1 -mx-1 min-w-7">번호</span>
                              <Separator orientation="vertical"
                                         className="h-7"/>
                              <span style={{ minWidth: `${maxPathWidth}px` }} className="min-w-32">경로</span>
                              <Separator orientation="vertical"
                                         className="h-7"/>
                              <span className="min-w-24">체류 기간</span>
                              <Separator orientation="vertical"
                                         className="h-7"/>
                              <div className="flex justify-between items-center">
                                <span>이동 시각</span>
                                <span
                                    className="ml-8 py-1 px-2 cursor-pointer select-none text-foreground border rounded-md shadow-sm"
                                    onClick={() => setIsTrackingDescend(
                                        !isTrackingDescend)}>
                                  {isTrackingDescend ? "최신순" : "오래된순"}
                                </span>
                              </div>
                            </div>
                          </DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <ScrollArea className={`pr-3 ${visitor.tracking?.length > 6 ? "h-[250px]" : ""}`}>
                              {visitor.tracking?.map((track, index) => (
                          <DropdownMenuItem key={index}>
                                <div className="flex space-x-3 items-center">
                                  <span className="text-center border rounded-md min-w-7 py-1  -mx-1">
                                    {isTrackingDescend ? index + 1 : visitor.tracking?.length - index}
                                  </span>
                                  <Separator orientation="vertical" className="h-7"/>
                                  <span style={{ minWidth: `${maxPathWidth}px` }} className="min-w-32 font-medium">{track.path}</span>
                                  <Separator orientation="vertical" className="h-7"/>
                                  <span className="min-w-24 font-medium">{track.stay}</span>
                                  <Separator orientation="vertical" className="h-7"/>
                                  <span>{track.changedAt}</span>
                                </div>
                          </DropdownMenuItem>
                            ))}
                            </ScrollArea>
                          </DropdownMenuContent>
                            </DropdownMenu>
                    ) : <Button variant="outline" disabled>이력 없음</Button>}
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    {visitor.device}
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    {visitor.browser ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="outline">
                          <Eye />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="px-2 mx-4 max-w-[400px]">
                        <DropdownMenuLabel>브라우저</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <div className="p-2">{visitor.browser}</div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                        ) : (
                        <Button variant="outline" disabled>
                          <EyeOff />
                        </Button>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    {visitor.userAgent ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="outline">
                          <Eye />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="px-2 mx-4 max-w-[400px]">
                        <DropdownMenuLabel>UserAgent</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <div className="p-2">{visitor.userAgent}</div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                        ) : (
                        <Button variant="outline" disabled>
                          <EyeOff />
                        </Button>
                    )}
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      </>
  );
};

export default VisitorList;