import { Card, CardContent } from "@/components/ui/card"
import { Code2, Server, Cloud } from 'lucide-react'
import {logos} from "@/components/icons"
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {motion, AnimatePresence} from "framer-motion";


const technologies = {
  frontend: [
    { name: "React", description: "컴포넌트 기반 UI 라이브러리", icon: "react", url: "https://react.dev"},
    { name: "Next.js", description: "React 기반 서버 사이드 렌더링 프레임워크", icon: "next", url: "https://nextjs.org/"},
    { name: "Tailwind CSS", description: "유틸리티 중심 CSS 프레임워크", icon: "tailwind", url: "https://tailwindcss.com/"},
    { name: "Plate.js", description: "Slate.js 기반 텍스트 에디터", icon: "platejs" , url: "https://platejs.org/"},
    { name: "PouchDB", description: "클라이언트 측 NoSQL 데이터베이스", icon: "pouchDB" , url: "https://pouchdb.com/"},
    {name: "Uploadthing", description: "미디어 시스템 핵심 클라우드 스토리지", icon:"uploadthing", url: "https://uploadthing.com/"},
    { name: "Axios", description: "Promise 기반 HTTP 클라이언트", icon: "axios" , url: "https://axios-http.com/"},
    { name: "Jotai", description: "전역 상태 관리 라이브러리", icon: "jotai" , url: "https://jotai.org/"},
  ],
  frontend_etc: [
    { name: "Shadcn/UI", description: "Radix UI 기반 컴포넌트 라이브러리", icon: "shadcn" , url: "https://ui.shadcn.com/"},
    { name: "Zod", description: "스키마 유효성 검증 라이브러리", url: "https://zod.dev/" },
  ],
  backend: [
    { name: "Node.js", description: "JS 기반 서버 런타임", icon: "nodejs" , url: "https://nodejs.org/"},
    { name: "Express.js", description: "경량 웹 서버 프레임워크", icon: "expressjs", url: "https://expressjs.com/"},
    { name: "MongoDB Atlas", description: "클라우드 NoSQL 데이터베이스", icon: "mongodb", url: "https://www.mongodb.com/atlas"},
    { name: "Redis", description: "초고속 캐싱 데이터베이스", icon: "redis" , url: "https://redis.io/"},
    { name: "Passport.js", description: "OAuth 기반 소셜 인증 라이브러리", icon: "passport" , url: "https://www.passportjs.org/"},
    { name: "JWT", description: "JSON 토큰 기반 인증", icon: "jwt", url: "https://jwt.io/"},
    { name: "Axios", description: "HTTP 요청 처리 클라이언트", icon: "axios", url: "https://axios-http.com/"},
    { name: "WebSocket", description: "이벤트 기반 실시간 통신 프로토콜", icon: "webSocket", url: "https://github.com/websockets/ws"},
  ],
  backend_etc: [
    { name: "Helmet", description: "웹 애플리케이션 보안 강화", url: "https://helmetjs.github.io/" },
    { name: "Bcryptjs", description: "비밀번호 해싱 및 인증 강화", url: "https://github.com/dcodeIO/bcrypt.js/" },
    { name: "Nodemailer", description: "서버 기반 이메일 전송 모듈", url: "https://nodemailer.com/" },
    { name: "OAuth2.0", description: "인증 및 권한 부여를 위한 프로토콜", url: "https://oauth.net/2/" },
    { name: "Morgan", description: "HTTP 요청 로깅 미들웨어", url: "https://github.com/expressjs/morgan" },
    { name: "Express Rate Limit", description: "API 요청 속도 제한 미들웨어", url: "https://github.com/express-rate-limit/express-rate-limit" },
    { name: "Dotenv", description: "환경 변수 관리 라이브러리", url: "https://github.com/motdotla/dotenv" },
  ],
  deployment: [
    { name: "Vercel", description: "프론트엔드 배포 플랫폼", icon: "vercel" , url: "https://vercel.com/"},
    { name: "Oracle Cloud", description: "API 요청 처리 백엔드 서버", icon: "oracle", url: "https://www.oracle.com/cloud/"},
    { name: "Ubuntu", description: "백엔드 서버 운영 환경", icon: "ubuntu" , url: "https://ubuntu.com/"},
    { name: "Cloudflare", description: "DNS 레코드 설정, SSL 인증 및 네트워크 보안.", icon: "cloudflare", url: "https://www.cloudflare.com/"},
  ]
};

export default function TechStack() {
  const [showEtc, setShowEtc] = useState({
    frontend: false,
    backend: false,
    deployment: false,
  });

  const transition = {
    duration: 0.3,
    ease: "easeInOut",
  };


  return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">사용된 기술 스택</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="max-h-fit">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-4 flex items-center">
                  <Code2 className="mr-2" />
                  Frontend
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 cursor-pointer">
                  {technologies.frontend.map((tech) => (
                      <div key={tech.name} className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <a href={tech.url} target="_blank" rel="noreferrer" className="block">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border">
                            {logos[tech.icon] ? logos[tech.icon]({ className: "w-5 h-5" }) : null}
                          </div>
                          <h4 className="font-medium">{tech.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600">{tech.description}</p>
                        </a>
                      </div>
                  ))}
                </div>
                <div className="flex justify-end my-4">
                  <Button variant="outline" className="min-w-[25%]"
                          onClick={() => setShowEtc((prev) => ({ ...prev, frontend: !prev.frontend }))}>
                    기타 사용된 도구 {technologies.frontend_etc.length} 개
                  </Button>
                </div>
                <AnimatePresence>
                {showEtc.frontend && (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 cursor-pointer overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={transition}
                    >
                      {technologies.frontend_etc.map((tech) => (
                          <div key={tech.name}
                               className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                            <a href={tech.url} target="_blank" rel="noreferrer"
                               className="block">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-medium">{tech.name}</h4>
                              </div>
                              <p className="text-sm text-gray-600">{tech.description}</p>
                            </a>
                          </div>
                        ))}
                    </motion.div>
                )}
                </AnimatePresence>
              </CardContent>
            </Card>
            <Card className="max-h-fit">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-4 flex items-center">
                  <Server className="mr-2"/>
                  Backend
                </h3>
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 cursor-pointer">
                  {technologies.backend.map((tech) => (
                      <div key={tech.name}
                           className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <a href={tech.url} target="_blank" rel="noreferrer"
                           className="block">
                          <div className="flex items-center space-x-2 mb-2">
                            <div
                                className="w-8 h-8 bg-white rounded-full flex items-center justify-center border">
                              {logos[tech.icon] ? logos[tech.icon](
                                  {className: "w-5 h-5"}) : null}
                            </div>
                            <h4 className="font-medium">{tech.name}</h4>
                          </div>
                          <p className="text-sm text-gray-600">{tech.description}</p>
                        </a>
                      </div>
                    ))}
                </div>
                <div className="flex justify-end my-4">
                  <Button variant="outline" className="min-w-[25%]"
                          onClick={() => setShowEtc((prev) => ({ ...prev, backend: !prev.backend }))}>
                    기타 사용된 도구 {technologies.backend_etc.length} 개
                  </Button>
                </div>
                <AnimatePresence>
                {showEtc.backend && (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 cursor-pointer overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={transition}
                    >
                      {technologies.backend_etc.map((tech) => (
                          <div key={tech.name}
                               className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                            <a href={tech.url} target="_blank" rel="noreferrer"
                               className="block">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-medium">{tech.name}</h4>
                              </div>
                              <p className="text-sm text-gray-600">{tech.description}</p>
                            </a>
                          </div>
                        ))}
                    </motion.div>
                )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-8 max-w-[50%] mx-auto">
            <CardContent className="p-6">
              <h3 className="text-2xl font-semibold mb-4 flex items-center">
                <Cloud className="mr-2"/>
                Deploy & Security
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 cursor-pointer">
                {technologies.deployment.map((tech) => (
                    <div key={tech.name}
                         className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <a href={tech.url} target="_blank" rel="noreferrer"
                         className="block">
                        <div className="flex items-center space-x-2 mb-2">
                          <div
                              className="w-8 h-8 bg-white rounded-full flex items-center justify-center border">
                            {logos[tech.icon] ? logos[tech.icon](
                                {className: "w-5 h-5"}) : null}
                          </div>
                          <h4 className="font-medium">{tech.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600">{tech.description}</p>
                      </a>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
  )
}

