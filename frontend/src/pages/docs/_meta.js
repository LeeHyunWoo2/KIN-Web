import Separator from "@/components/docs/Separator";

export default {
  'Introduction': {
    title: (
        <Separator>
          Introduction
        </Separator>
    ),
    type: 'separator'
  },
  index: "프로젝트 소개",
  about: "나를 담은 프로젝트",
  techStack: "기술 스택",
  structure: "프로젝트 디렉토리 구조",
  'Fundamental': {
    title: (
        <Separator>
          Fundamentals
        </Separator>
    ),
    type: 'separator'
  },
  architecture: "Architecture",
  frontend: "Frontend",
  backend: "Backend",
  security: "Infra & Security",
  'Features': {
    title: (
        <Separator>
          Features
        </Separator>
    ),
    type: 'separator'
  },
  auth: {title: "Auth", display: "hidden"},
  notes: {title: "Notes", display: "hidden"},
  'Insights':{
    title: (
        <Separator>
          Insights
        </Separator>
    ),
    type: 'separator',
  },
  issues: "Issues",
  etc: {title: "Extras", display: "hidden"},
}