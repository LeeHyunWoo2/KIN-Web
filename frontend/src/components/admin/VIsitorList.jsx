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
import {Separator} from "@/components/ui/separator";

const processVisitors = (visitors) => {
  return visitors.map(visitor => {
    // IP 변경 이력 시간순 정렬
    visitor.ipHistory.sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt));

    return {
      uuid: visitor.visitorId,
      visitCount: visitor.visitCount,
      lastVisit: format(new Date(visitor.lastVisit), "yyyy년 M월 d일 a h:mm", { locale: ko }),
      currentIp: visitor.ipHistory.length > 0 ? visitor.ipHistory[visitor.ipHistory.length - 1].ip : "N/A",
      ipHistory: visitor.ipHistory.map(ipEntry => ({
        ip: ipEntry.ip,
        changedAt: format(new Date(ipEntry.changedAt), "M월 d일 HH:mm", { locale: ko })
      })),
      device: visitor.device ? `${visitor.device} - ${visitor.browser}` : "알 수 없음"
    };
  });
};


const VisitorList = ({ visitors }) => {
  const processedData = processVisitors(visitors);

  return (
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>UUID</TableHead>
              <TableHead>방문 횟수</TableHead>
              <TableHead>마지막 방문</TableHead>
              <TableHead>현재 IP</TableHead>
              <TableHead>IP 변경 이력</TableHead>
              <TableHead>디바이스</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedData.map((visitor) => (
                <TableRow key={visitor.uuid}>
                  <TableCell className="max-w-[250px]">{visitor.uuid}</TableCell>
                  <TableCell className="text-center pr-5 text-base">{visitor.visitCount}</TableCell>
                  <TableCell>{visitor.lastVisit}</TableCell>
                  <TableCell>{visitor.currentIp}</TableCell>
                  <TableCell>
                    {visitor.ipHistory.length > 0 ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">이력 조회</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                          <DropdownMenuLabel>IP 변경 이력</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            {visitor.ipHistory.map((ip, index) => (
                                <li key={index}>{ip.ip} ({ip.changedAt})</li>
                            ))}
                          </DropdownMenuItem>
                          </DropdownMenuContent>
                            </DropdownMenu>
                    ) : "이력 없음"}
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