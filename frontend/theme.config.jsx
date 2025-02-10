import React from 'react'
import {useConfig, useThemeConfig} from 'nextra-theme-docs'
import HeaderButtons from "@/components/HeaderButtons";
import getGitIssueUrl from "@/lib/docsCustomFeedback"

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
  logo: (
      <div className="flex items-center gap-6">
        <HeaderButtons/>
      </div>
  ),
  logoLink: false,
  search: {
    placeholder: '검색어를 입력하세요.',
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
  editLink: false,
  feedback:{
    content: <span className="text-sm font-semibold">문의 또는 피드백 →</span>,
    useLink() {
      const themeConfig = useThemeConfig();
      return getGitIssueUrl({
        labels: themeConfig.feedback.labels,
        repository: themeConfig.docsRepositoryBase,
        title: ""
      });
    }
  },
}

// 커스터마이징 할거면 여기 참고
// D:\workspace\KIN-Web\frontend\node_modules\nextra-theme-docs\dist\index.js

export default config
