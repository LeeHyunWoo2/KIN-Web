import React from 'react'
import {useConfig, useThemeConfig} from 'nextra-theme-docs'
import HeaderButtons from "@/components/HeaderButtons";
import getGitIssueUrl from "@/lib/docsCustomFeedback"
import {jsx as jsx5} from "react/jsx-runtime";
import {authAtom} from "@/atoms/userState";
import {useAtomValue} from "jotai";

const config = {
  head() {
    const config = useConfig()
    const title = `${config.title} - Keep Idea Note`
    return (
        <>
          <title>{title}</title>
        </>
    )
  },
  logo: () => {
    const auth = useAtomValue(authAtom);
    return (
      <div className="flex items-center gap-6">
        <HeaderButtons auth={auth}/>
      </div>
    )
  },
  logoLink: false,
  search: {
    placeholder: '검색어를 입력하세요.',
    emptyResult: /* @__PURE__ */ jsx5("span", { className: "_block _select-none _p-8 _text-center _text-sm _text-gray-400", children: "결과가 없습니다." }),
  },
  project: {
    link: 'https://github.com/LeeHyunWoo2/KIN-Web',
  },
  docsRepositoryBase: 'https://github.com/LeeHyunWoo2/KIN-Web',
  footer: {
    content: (
        <span className="container mx-auto px-4 text-end font-medium text-[14px] text-muted-foreground">
        © {new Date().getFullYear()} {' '}
          <a href="https://github.com/LeeHyunWoo2" target="_blank" rel="noopener noreferrer">
          LeeHyunWoo. All rights reserved.
        </a>
      </span>
    )
  },
  sidebar: {
    toggleButton: false,
  },
  toc:{
    backToTop: (
        <span className="text-[15px]">
        Scroll to top
        </span>
    ),
    title: "목차"
  },
  editLink: false,
  feedback:{
    content: <span className="text-sm">문의 또는 피드백 →</span>,
    useLink() {
      const themeConfig = useThemeConfig();
      return getGitIssueUrl({
        labels: themeConfig.feedback.labels,
        repository: themeConfig.docsRepositoryBase,
        title: ""
      });
    }
  },
  mdxComponent: {
    wrapper: (props) => {
      try {
        return <div {...props} />;
      } catch (error) {
        console.error('MDX 렌더링 오류:', error);
        return <div style={{ color: 'red' }}>MDX 문법 오류.</div>;
      }
    },
  },
}

// 커스터마이징 할거면 여기 참고
// D:\workspace\KIN-Web\frontend\node_modules\nextra-theme-docs\dist\index.js

export default config
