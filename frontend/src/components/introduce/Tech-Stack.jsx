import { Card, CardContent } from "@/components/ui/card"
import { Code2, Server, Cloud } from 'lucide-react'
import {logos} from "@/components/icons"

const technologies = {
  frontend: [
    { name: "React", description: "컴포넌트 기반 UI 라이브러리", icon: "react" },
    { name: "Next.js", description: "React 기반 서버 사이드 렌더링 프레임워크", icon: "next" },
    { name: "Tailwind CSS", description: "유틸리티 중심의 CSS 프레임워크", icon: "tailwind"},
    { name: "Shadcn/UI", description: "Radix UI 기반 컴포넌트 라이브러리", icon: "shadcn" },
    { name: "Jotai", description: "경량 전역 상태 관리 라이브러리", icon: "jotai" },
    { name: "Plate.js", description: "Slate.js 기반 텍스트 에디터", icon: "platejs" },
    { name: "PouchDB", description: "클라이언트 측 NoSQL 데이터베이스", icon: "pouchDB" },
    { name: "Axios", description: "Promise 기반 HTTP 클라이언트", icon: "axios" },
  ],
  backend: [
    { name: "Node.js", description: "JavaScript 런타임 환경", icon: "nodejs" },
    { name: "Express.js", description: "웹 서버 프레임워크", icon: "expressjs"},
    { name: "MongoDB Atlas", description: "클라우드 NoSQL 데이터베이스", icon: "mongodb"},
    { name: "Redis", description: (<>메모리 기반 데이터베이스<br/> (express-session 과 함께 세션 관리에 사용됨)</>), icon: "redis" },
    { name: "Passport.js", description: "OAuth 기반 소셜 로그인 라이브러리", icon: "passport" },
    { name: "JWT", description: "JSON 기반 인증 토큰", icon: "jwt"},
    { name: "Axios", description: "HTTP 요청 처리 클라이언트", icon: "axios"},
    { name: "WebSocket", description: "실시간 통신 프로토콜", icon: "webSocket"},
/*    { name: "HTTPS", description: "SSL 인증서를 통한 보안 통신" },
    { name: "Secure Cookies", description: "HTTPOnly 및 SameSite 쿠키 설정" },
    { name: "Cookie-parser", description: "쿠키 관리 미들웨어" },
    { name: "Helmet", description: "보안 헤더 설정" },
    { name: "Rate Limiting", description: "조건부 API 요청 제한 설정" },
    { name: "Node-schedule", description: "스케줄링 및 주기적인 DB 백업 작업" },*/
  ],
  deployment: [
    { name: "Vercel", description: "프론트엔드 배포 플랫폼", icon: "vercel" },
    { name: "Oracle Cloud", description: "API 요청 처리 백엔드 서버", icon: "oracle"},
    { name: "Ubuntu", description: "백엔드 서버 운영 환경", icon: "ubuntu" },
    { name: "Cloudflare", description: "DNS 레코드 설정, SSL 인증 및 네트워크 보안." },
  ]
};

/*
const frontend = [
  { name: "React", description: "컴포넌트 기반 UI 라이브러리." },
  { name: "Next.js", description: "React 기반 서버 사이드 렌더링 프레임워크." },
  { name: "Tailwind CSS", description: "유틸리티 중심의 CSS 프레임워크." },
  { name: "Shadcn/UI", description: "Radix UI 기반의 컴포넌트 라이브러리." },
  { name: "Jotai", description: "경량 전역 상태 관리 라이브러리." },
  { name: "Plate.js", description: "Slate.js 기반의 텍스트 에디터 라이브러리." },
  { name: "PouchDB", description: "오프라인 데이터를 지원하는 클라이언트 측 NoSQL 데이터베이스." },
  { name: "Axios", description: "Promise 기반 HTTP 클라이언트." },
];
const backend = [
  { name: "Node.js", description: "JavaScript 런타임 환경." },
  { name: "Express.js", description: "간결하고 유연한 웹 서버 프레임워크." },
  { name: "MongoDB (Mongoose)", description: "클라우드 NoSQL 데이터베이스 및 ODM." },
  { name: "Redis", description: "인메모리 데이터 저장소로 캐싱과 세션 관리." },
  { name: "Passport.js", description: "OAuth 기반 소셜 로그인 라이브러리." },
  { name: "JWT", description: "JSON 기반 인증 토큰으로 세션 없는 인증 지원." },
  { name: "Axios", description: "HTTP 요청 처리 클라이언트." },
  { name: "WebSocket", description: "실시간 통신을 위한 프로토콜." },
];
const deployment = [
  { name: "Vercel", description: "프론트엔드 배포 플랫폼." },
  { name: "Oracle Cloud", description: "API 요청 처리 및 백엔드 서버 운영." },
  { name: "Cloudflare", description: "SSL 인증 및 네트워크 보안." },
  { name: "Ubuntu", description: "백엔드 서버 운영 환경." },
];
*/

export default function TechStack() {
  return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">사용된 기술 스택</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-4 flex items-center">
                  <Code2 className="mr-2" />
                  프론트엔드
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 cursor-pointer">
                  {technologies.frontend.map((tech) => (
                      <div key={tech.name} className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border">
                            {logos[tech.icon] ? logos[tech.icon]({ className: "w-5 h-5" }) : null}
                          </div>
                          <h4 className="font-medium">{tech.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600">{tech.description}</p>
                      </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-4 flex items-center">
                  <Server className="mr-2" />
                  백엔드
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 cursor-pointer">
                  {technologies.backend.map((tech) => (
                      <div key={tech.name} className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border">
                            {logos[tech.icon] ? logos[tech.icon]({ className: "w-5 h-5" }) : null}
                          </div>
                          <h4 className="font-medium">{tech.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600">{tech.description}</p>
                      </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-8 max-w-[50%] mx-auto">
            <CardContent className="p-6">
              <h3 className="text-2xl font-semibold mb-4 flex items-center">
                <Cloud className="mr-2" />
                배포 및 네트워크 보안
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 cursor-pointer">
                {technologies.deployment.map((tech) => (
                    <div key={tech.name} className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border">
                          {logos[tech.icon] ? logos[tech.icon]({ className: "w-5 h-5" }) : null}
                        </div>
                        <h4 className="font-medium">{tech.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{tech.description}</p>
                    </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
  )
}

