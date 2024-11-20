import * as React from "react"
import {useEffect, useState} from "react"
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
  Frame,
  GalleryVerticalEnd,
  Home,
  Inbox,
  LineChart,
  Link as LinkIcon,
  LogOut,
  Map,
  Menu,
  PieChart,
  Plus,
  Settings2,
  SquarePen,
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
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {Button} from "@/components/ui/button"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import SettingsDialog from "@/components/ListMode";
import {logoutUser} from "@/services/user/authService";
import withAuth from "@/lib/hoc/withAuth";
import CategorySidebar from "@/components/notes/CategorySidebar";
import {useAtom} from "jotai";
import {noteCountAtom, noteEventAtom} from '@/atoms/noteStateAtom';
import {router} from "next/client";

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
  const [, setNoteEvent] = useAtom(noteEventAtom);
  const [activeTeam, setActiveTeam] = React.useState(data.teams[0])
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    profileIcon: '',
  });
  const [noteCount] = useAtom(noteCountAtom);
  const {view} = router.query;

  const handleNewNote = () => {
    setNoteEvent({
      type: 'ADD',
      payload: {title: '', content: ''}
    })
  };

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (storedUserInfo) {
      setUserInfo(storedUserInfo);
    } else {
      setUserInfo({name: '', email: '', profileIcon: ''}); // 로그아웃 후 초기화
    }
  }, []);


  const moveToHome = () => {
    router.push('/notes', undefined, {shallow: true});
  }

  const moveToTrash = () => {
    if (view !== 'trash') {
      router.push('/notes?view=trash', undefined, {shallow: true});
    } else {
      router.push('/notes', undefined, {shallow: true});
    }
  };

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
                          <UserRoundCog/>
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
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut/>
                        Log out
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu className="cursor-pointer">
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleNewNote}>
                      <SquarePen/> 새 노트
                    </SidebarMenuButton>
                  </SidebarMenuItem>
              <SidebarMenuItem>
                    <SidebarMenuButton onClick={moveToHome}>
                      <Home/> 홈
                    </SidebarMenuButton>
                  </SidebarMenuItem>
              <SidebarMenuItem>
                    <SidebarMenuButton onClick={moveToHome}>
                      <Inbox/> 전체 보기 ( {noteCount.active} )
                    </SidebarMenuButton>
                  </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <Separator/>
          <CategorySidebar/>
          <SidebarFooter>
            <SidebarMenu className="cursor-pointer">
              <SidebarMenuItem>
                <SidebarMenuButton onClick={moveToTrash}>
                  <Trash2/>
                  <span>휴지통 ( {noteCount.trashed} )</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu>
              <SidebarMenuItem>
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