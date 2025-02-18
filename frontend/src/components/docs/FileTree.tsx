"use client"

import {
  createContext,
  memo,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react"
import cn from "clsx"
import { FileText as FiFileText } from "lucide-react"
import { Folder as LuFolder, FolderClosed as LuFolderClosed } from "lucide-react"

const ctx = createContext(0)

interface FolderProps {
  name: string
  label?: ReactElement
  open?: boolean
  defaultOpen?: boolean
  onToggle?: (open: boolean) => void
  children: ReactNode
}

interface FileProps {
  name: string
  label?: ReactElement
  url?: string
}

function useIndent() {
  return useContext(ctx)
}

function Tree({ children }: { children: ReactNode }): ReactElement {
  return (
      <div className={cn("flex")}>
        <ul className="border list-none !p-4 !py-1 !m-0 min-w-[200px]">{children}</ul>
      </div>
  )
}

export const Folder = memo(
    ({
       label,
       name,
       open,
       defaultOpen = false,
       onToggle,
       children,
     }: FolderProps) => {
      const indent = useIndent()
      const [isOpen, setIsOpen] = useState(defaultOpen)

      const toggle = useCallback(() => {
        onToggle?.(!isOpen)
        setIsOpen(!isOpen)
      }, [isOpen, onToggle])

      const isFolderOpen = open === undefined ? isOpen : open

      return (
          <li className="list-none">
            <div
                onClick={toggle}
                title={name}
                className={cn(
                    "inline-flex items-center cursor-pointer py-1 text-base hover:text-muted-foreground transition-all"
                )}
                style={{ marginLeft: indent * 17 }}
            >
          <span className="ml-1">
            {isFolderOpen ? (
                <LuFolderClosed size={16} />
            ) : (
                <LuFolder size={16} />
            )}
          </span>
              <span className="ml-2">{label ?? name}</span>
            </div>
            {isFolderOpen && (
                <ul className="list-none">
                  <ctx.Provider value={indent + 1}>{children}</ctx.Provider>
                </ul>
            )}
          </li>
      )
    }
)

Folder.displayName = "Folder"

export const File = memo(({ label, name, url }: FileProps) => {
  const indent = useIndent()
  return (
      <li className="list-none">
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center py-1 text-base hover:text-muted-foreground cursor-pointer transition-all"
            style={{marginLeft: indent * 17}}>
      <span className="ml-1">
        <FiFileText size={16}/>
      </span>
          <span className="ml-2 mr-2">{label ?? name}</span>
        </a>
      </li>
  )
})

File.displayName = "File"

export default Tree