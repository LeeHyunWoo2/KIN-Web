import * as React from "react"
import Link from "next/link"
import {
  ArrowDown,
  ArrowUp,
  AudioWaveform,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  ClipboardList,
  Command,
  Copy,
  CornerUpLeft,
  CornerUpRight,
  CreditCard,
  FileText,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd, Home, Inbox,
  LineChart,
  Link as LinkIcon,
  LogOut,
  Map,
  Menu,
  MoreHorizontal,
  PieChart,
  SquarePen,
  Plus,
  Settings2,
  SquareTerminal,
  Star,
  Trash,
  Trash2,
  UserRoundCog,
} from "lucide-react"

import {Avatar, AvatarFallback, AvatarImage,} from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Separator} from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {Button} from "@/components/ui/button"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import SettingsDialog from "@/components/ListMode";
import {logoutUser} from "@/services/authService";
import {useEffect, useState} from "react";
import withAuth from "@/lib/hoc/withAuth";
import CategorySidebar from "@/components/notes/CategorySidebar";
import {useAtom, useSetAtom} from "jotai";
import {testAtom} from "@/atoms/testAtom";
import { newNoteAtom } from '@/atoms/newNoteAtom';

const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navHeader: [
    {
      title: "새 노트",
      icon: SquarePen,
    },
    {
      title: "홈",
      url: "/notes",
      icon: Home,
    },
    {
      title: "전체 보기",
      url: "#",
      icon: Inbox,
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
  actions: [
    [
      {
        label: "Customize Page",
        icon: Settings2,
      },
      {
        label: "Turn into wiki",
        icon: FileText,
      },
    ],
    [
      {
        label: "Copy Link",
        icon: LinkIcon,
      },
      {
        label: "Duplicate",
        icon: Copy,
      },
      {
        label: "Move to",
        icon: CornerUpRight,
      },
      {
        label: "Move to Trash",
        icon: Trash2,
      },
    ],
    [
      {
        label: "Undo",
        icon: CornerUpLeft,
      },
      {
        label: "View analytics",
        icon: LineChart,
      },
      {
        label: "Version History",
        icon: GalleryVerticalEnd,
      },
      {
        label: "Show delete pages",
        icon: Trash,
      },
      {
        label: "Notifications",
        icon: Bell,
      },
    ],
    [
      {
        label: "Import",
        icon: ArrowUp,
      },
      {
        label: "Export",
        icon: ArrowDown,
      },
    ],
  ],
}

const handleLogout = () => {
  logoutUser();
};

function Page({children}) {

  const setNewNote = useSetAtom(newNoteAtom);
  const [ mode, setMode ] = useAtom(testAtom);
  const [activeTeam, setActiveTeam] = React.useState(data.teams[0])
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    profileIcon: '',
  });

  const handleNewNote = () => {
    setNewNote(true); // 새 노트 작성 신호 전송
  };

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (storedUserInfo) {
      setUserInfo(storedUserInfo);
    } else {
      setUserInfo({name: '', email: '', profileIcon: ''}); // 로그아웃 후 초기화
    }
  }, []);

  const changeMode = () => {
    if (mode === "modeA"){
      setMode("modeB");
    } else if (mode === "modeB"){
      setMode("modeA");
    }
  }

  return (
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                            src={userInfo.profileIcon}
                            alt={userInfo.name}
                        />
                        <AvatarFallback
                            className="rounded-lg">CN</AvatarFallback>
                      </Avatar>
                      <div
                          className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {userInfo.name}
                      </span>
                        <span className="truncate text-xs">
                        {userInfo.email}
                      </span>
                      </div>
                      <ChevronRight className="ml-auto size-4"/>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                      side="right"
                      align="end"
                      sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div
                          className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                              src={userInfo.profileIcon}
                              alt={userInfo.name}
                          />
                          <AvatarFallback className="rounded-lg">
                            CN
                          </AvatarFallback>
                        </Avatar>
                        <div
                            className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {userInfo.name}
                        </span>
                          <span className="truncate text-xs">
                          {userInfo.email}
                        </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuGroup>
                      <Link href="/userinfo">
                      <DropdownMenuItem>
                        <UserRoundCog />
                        Account Settings
                      </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator/>
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <BadgeCheck/>
                        Account
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CreditCard/>
                        Billing
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Bell/>
                        Notifications
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator/>
                    <Link href="/">
                      <DropdownMenuItem  onClick={handleLogout}>
                        <LogOut/>
                        Log out
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
            <NavMain items={data.navHeader} onNewNote={handleNewNote} />
          </SidebarHeader>
          <Separator/>
          <CategorySidebar/>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarMenu>
                {data.navMain.map((item) => (
                    <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={item.isActive}
                        className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title}>
                            {item.icon && <item.icon/>}
                            <span>{item.title}</span>
                            <ChevronRight
                                className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild>
                                    <a href={subItem.url}>
                                      <span>{subItem.title}</span>
                                    </a>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup className="group-data-[collapsible=icon]:hidden">
              <SidebarGroupLabel>Projects</SidebarGroupLabel>
              <SidebarMenu>
                {data.projects.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon/>
                          <span>{item.name}</span>
                        </a>
                      </SidebarMenuButton>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction showOnHover>
                            <MoreHorizontal/>
                            <span className="sr-only">More</span>
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-48 rounded-lg"
                            side="bottom"
                            align="end"
                        >
                          <DropdownMenuItem>
                            <Folder className="text-muted-foreground"/>
                            <span>View Project</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Forward className="text-muted-foreground"/>
                            <span>Share Project</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator/>
                          <DropdownMenuItem>
                            <Trash2 className="text-muted-foreground"/>
                            <span>Delete Project</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <Button variant="ghost" className="min-w-full" onClick={changeMode}/>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <div
                          className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground min-w-fit">
                        <activeTeam.logo className="size-4"/>
                      </div>
                      <div
                          className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {activeTeam.name}
                      </span>
                        <span className="truncate text-xs">
                        {activeTeam.plan}
                      </span>
                      </div>
                      <ChevronsUpDown className="ml-auto"/>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                      align="start"
                      side="right"
                      sideOffset={4}
                  >
                    <DropdownMenuLabel
                        className="text-xs text-muted-foreground">
                      Teams
                    </DropdownMenuLabel>
                    {data.teams.map((team, index) => (
                        <DropdownMenuItem
                            key={team.name}
                            onClick={() => setActiveTeam(team)}
                            className="gap-2 p-2"
                        >
                          <div
                              className="flex size-6 items-center justify-center rounded-sm border">
                            <team.logo className="size-4 shrink-0"/>
                          </div>
                          {team.name}
                          <DropdownMenuShortcut>⌘{index
                              + 1}</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem className="gap-2 p-2">
                      <div
                          className="flex size-6 items-center justify-center rounded-md border bg-background">
                        <Plus className="size-4"/>
                      </div>
                      <div className="font-medium text-muted-foreground">
                        Add team
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail/>
        </Sidebar>
        <SidebarInset>
          <header
              className="flex sticky top-0 bg-background h-12 shrink-0 items-center gap-2 border-b px-4">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger/>
              <Separator orientation="vertical" className="mr-2 h-4"/>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="line-clamp-1">
                      Project Management & Task Tracking
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="ml-auto px-3">
              <NavActions actions={data.actions}/>
            </div>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
  )
}

function NavMain({
  items, onNewNote
}) {
  return (
      <SidebarMenu>
        {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                  asChild
                  onClick={item.title === "새 노트" ? onNewNote : undefined} // "새 노트"일 때만 신호 전달
              >
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
        ))}
      </SidebarMenu>
  )
}

function NavActions({
  actions,
}) {
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    setIsOpen(false)
  }, [])

  return (
      <div className="flex items-center gap-2 text-sm">
        <Link href="/list">
          <Button variant="ghost">
            <ClipboardList/>
          </Button>
        </Link>
        <Link href="/settings">
          <Button variant="ghost">
            <UserRoundCog/>
          </Button>
        </Link>
        <SettingsDialog/>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Star/>
        </Button>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 data-[state=open]:bg-accent"
            >
              <Menu/>
            </Button>
          </PopoverTrigger>
          <PopoverContent
              className="w-56 overflow-hidden rounded-lg p-0"
              align="end"
          >
            <Sidebar collapsible="none" className="bg-transparent">
              <SidebarContent>
                {actions.map((group, index) => (
                    <SidebarGroup key={index}
                                  className="border-b last:border-none">
                      <SidebarGroupContent className="gap-0">
                        <SidebarMenu>
                          {group.map((item, index) => (
                              <SidebarMenuItem key={index}>
                                <SidebarMenuButton>
                                  <item.icon/>
                                  <span>{item.label}</span>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </SidebarGroup>
                ))}
              </SidebarContent>
            </Sidebar>
          </PopoverContent>
        </Popover>
      </div>
  )
}
export default withAuth(Page);