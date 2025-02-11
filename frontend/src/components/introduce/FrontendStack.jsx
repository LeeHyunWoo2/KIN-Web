import {Card, CardContent} from "@/components/ui/card";
import {Code2} from "lucide-react";
import {logos} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {motion, AnimatePresence} from "framer-motion";
import {useState} from "react";

const technologies = {
  frontend: [
    {
      name: "React",
      description: "컴포넌트 기반 UI",
      icon: "react",
      url: "https://react.dev"
    },
    {
      name: "Next.js",
      description: "React 기반 웹 개발 프레임워크",
      icon: "next",
      url: "https://nextjs.org/"
    },
    {
      name: "Tailwind CSS",
      description: "유틸리티 중심 CSS 프레임워크",
      icon: "tailwind",
      url: "https://tailwindcss.com/"
    },
    {
      name: "Plate.js",
      description: "Slate.js 기반 텍스트 에디터",
      icon: "platejs",
      url: "https://platejs.org/"
    },
    {
      name: "PouchDB",
      description: "클라이언트 측 NoSQL 데이터베이스",
      icon: "pouchDB",
      url: "https://pouchdb.com/"
    },
    {
      name: "Uploadthing",
      description: "미디어 시스템 핵심 클라우드 스토리지",
      icon: "uploadthing",
      url: "https://uploadthing.com/"
    },
    {
      name: "Axios",
      description: "Promise 기반 HTTP 클라이언트",
      icon: "axios",
      url: "https://axios-http.com/"
    },
    {
      name: "Jotai",
      description: "전역 상태 관리",
      icon: "jotai",
      url: "https://jotai.org/"
    },
  ],
  frontend_etc: [
    {
      name: "Shadcn/UI",
      description: "Radix UI 기반 컴포넌트 라이브러리",
      icon: "shadcn",
      url: "https://ui.shadcn.com/"
    },
    {name: "Zod", description: "스키마 유효성 검증", url: "https://zod.dev/"},
  ],
};

const FrontendStack = () => {
  const [showEtc, setShowEtc] = useState(false);
  const transition = {duration: 0.3, ease: "easeInOut"};

  return (
      <Card className="max-h-fit">
        <CardContent className="p-6">
          <h3 className="text-2xl font-semibold mb-4 flex items-center">
            <Code2 className="mr-2"/>
            Frontend
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 cursor-pointer">
            {technologies.frontend.map((tech) => (
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
                    onClick={() => setShowEtc(!showEtc)}>
              기타 사용된 도구 {technologies.frontend_etc.length} 개
            </Button>
          </div>
          <AnimatePresence>
            {showEtc && (
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 cursor-pointer overflow-hidden"
                    initial={{height: 0, opacity: 0}}
                    animate={{height: "auto", opacity: 1}}
                    exit={{height: 0, opacity: 0}}
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
  );
};

export default FrontendStack;