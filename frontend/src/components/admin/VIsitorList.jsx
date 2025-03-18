import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {Button} from "@/components/ui/button";
import {
  Table,
  TableBody, TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from '@/components/ui/separator'
import * as React from "react";

const processVisitors = (visitors, isDescend) => {
  const processed = visitors.map(visitor => {
    // IP 변경 이력 시간순 정렬
    visitor.ipHistory.sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt));

    return {
      uuid: visitor.visitorId,
      visitCount: visitor.visitCount,
      lastVisit: visitor.lastVisit,
      formattedLastVisit: format(new Date(visitor.lastVisit), "yyyy년 M월 d일 a h:mm", { locale: ko }),
      currentIp: visitor.ipHistory.length > 0 ? visitor.ipHistory[0].ip : "N/A",
      ipHistory: visitor.ipHistory.map(ipHis => ({
        ip: ipHis.ip,
        changedAt: format(new Date(ipHis.changedAt), "yy년 M월 d일 HH:mm", { locale: ko })
      })),
      device: visitor.device ? `${visitor.device} - ${visitor.browser}` : "알 수 없음"
    };
  });

  // 마지막 방문 날짜 기준 정렬 (오름차순/내림차순)
  if (isDescend){
    processed.sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit));
  } else {
    processed.sort((a, b) => new Date(a.lastVisit) - new Date(b.lastVisit));
  }
  return processed;
};


const VisitorList = ({ visitors }) => {
  const [isDescend, setIsDescend] = React.useState(true);
  const processedData = processVisitors(visitors, isDescend);

  return (
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-background">
              <TableHead>UUID</TableHead>
              <TableHead>방문 횟수</TableHead>
              <TableHead>
                <div className="flex justify-between">
                  <span>마지막 방문</span>
                  <span
                      className="mr-10 cursor-pointer select-none text-foreground"
                      onClick={() => setIsDescend(!isDescend)}>
                    {isDescend ? "최신순" : "오래된순"}
                  </span>
                </div>
              </TableHead>
              <TableHead>현재 IP (클릭 시 검색)</TableHead>
              <TableHead>IP 변경 이력</TableHead>
              <TableHead>디바이스</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedData.map((visitor) => (
                <TableRow key={visitor.uuid}>
                  <TableCell className="max-w-[250px]">{visitor.uuid}</TableCell>
                  <TableCell className="text-center pr-5 text-base">{visitor.visitCount}</TableCell>
                  <TableCell>{visitor.formattedLastVisit}</TableCell>
                  <TableCell>
                    <div
                        className="font-medium cursor-pointer hover:underline hover:font-semibold"
                        onClick={() => {
                          window.open("https://whatismyipaddress.com/ip/" + visitor.currentIp)
                        }}
                    >
                    {visitor.currentIp}
                    </div>
                  </TableCell>
                  <TableCell>
                    {visitor.ipHistory.length > 0 ? (
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
                  <TableCell className="max-w-[300px]">
                    {visitor.device}
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
  );
};

export default VisitorList;