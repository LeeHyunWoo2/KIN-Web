import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 임시 데이터
const notices = [
  { id: 1, title: "시스템 점검 안내", content: "5월 1일 오전 2시부터 4시까지 시스템 점검이 있을 예정입니다." },
  { id: 2, title: "새로운 기능 추가", content: "이제 음성 메모 기능을 사용하실 수 있습니다." },
  // ... 더 많은 공지사항 데이터
]

export function NoticeAndSettings() {
  const [noticeTitle, setNoticeTitle] = useState("")
  const [noticeContent, setNoticeContent] = useState("")

  return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>공지사항 관리</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Input
                  placeholder="공지사항 제목"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
              />
              <Textarea
                  placeholder="공지사항 내용"
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
              />
              <Button>공지사항 추가</Button>
            </form>
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>제목</TableHead>
                  <TableHead>내용</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notices.map((notice) => (
                    <TableRow key={notice.id}>
                      <TableCell>{notice.title}</TableCell>
                      <TableCell>{notice.content}</TableCell>
                      <TableCell>
                        <Button variant="ghost">수정</Button>
                        <Button variant="ghost">삭제</Button>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>서비스 설정</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="min-w-[200px]">휴지통 노트 자동 삭제 기간:</span>
                <Select defaultValue="30">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7일</SelectItem>
                    <SelectItem value="14">14일</SelectItem>
                    <SelectItem value="30">30일</SelectItem>
                    <SelectItem value="90">90일</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>설정 저장</Button>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}

