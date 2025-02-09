import React from 'react'

const config = {
  logo: <span>My Project</span>,
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
  }
}

export default config
