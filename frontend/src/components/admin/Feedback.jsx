import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from 'lucide-react'

// 임시 데이터
const feedbacks = [
  { id: 1, author: "홍길동", title: "로그인 문제", status: "읽지 않음", date: "2023-05-01" },
  { id: 2, author: "김철수", title: "기능 제안", status: "진행 중", date: "2023-05-02" },
  { id: 3, author: "이영희", title: "버그 리포트", status: "완료", date: "2023-05-03" },
]

export function Feedback() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedFeedback, setSelectedFeedback] = useState(null)

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="제목 또는 작성자 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="상태 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 상태</SelectItem>
            <SelectItem value="읽지 않음">읽지 않음</SelectItem>
            <SelectItem value="진행 중">진행 중</SelectItem>
            <SelectItem value="완료">완료</SelectItem>
          </SelectContent>
        </Select>
        <Button>
          <Search className="mr-2 h-4 w-4" /> 검색
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>작성자</TableHead>
            <TableHead>제목</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>작성 날짜</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedbacks.map((feedback) => (
            <TableRow key={feedback.id} onClick={() => setSelectedFeedback(feedback)} className="cursor-pointer">
              <TableCell>{feedback.author}</TableCell>
              <TableCell>{feedback.title}</TableCell>
              <TableCell>{feedback.status}</TableCell>
              <TableCell>{feedback.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedFeedback && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedFeedback.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>작성자: {selectedFeedback.author}</p>
            <p>상태: {selectedFeedback.status}</p>
            <p>작성 날짜: {selectedFeedback.date}</p>
            <p className="mt-4">문의 내용...</p>
            <div className="mt-4">
              <Select defaultValue={selectedFeedback.status}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="상태 변경" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="읽지 않음">읽지 않음</SelectItem>
                  <SelectItem value="진행 중">진행 중</SelectItem>
                  <SelectItem value="완료">완료</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

