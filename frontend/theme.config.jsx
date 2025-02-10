import React from 'react'
import { useConfig } from 'nextra-theme-docs'
import HeaderButtons from "@/components/HeaderButtons";

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
}

export default config
