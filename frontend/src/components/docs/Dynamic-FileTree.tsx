"use client"

import dynamic from "next/dynamic"

export const FileTree = dynamic(
    () => import("@/components/docs/FileTree"),
    {
      ssr: false,
    }
)