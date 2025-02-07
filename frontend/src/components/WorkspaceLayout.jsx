import * as React from "react"
import {useEffect, useState} from "react"
import Link from "next/link"
import {
  ArrowDown,
  ArrowUp,
  BadgeCheck,
  ChevronRight,
  ClipboardList,
  Copy,
  CornerUpLeft,
  CornerUpRight,
  FileText,
  GalleryVerticalEnd,
  LineChart,
  Link as LinkIcon,
  LogOut,
  Menu,
  Settings,
  Settings2,
  SquarePen,
  Trash,
  Trash2,
  UserRoundCog,
  CircleGauge,
} from "lucide-react"

import {Avatar, AvatarFallback, AvatarImage,} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import {logoutUser} from "@/services/user/authAPIService";
import withAuth from "@/lib/hoc/withAuth";
import CategorySidebar from "@/components/notes/CategorySidebar";
import {useAtom, useAtomValue} from "jotai";
import {noteEventAtom} from '@/atoms/noteStateAtom';
import {ListView, TrashFilter} from '@/components/notes/FilterComponents';
import TagManagerModal from "@/components/notes/TagManagement";
import TutorialButton from "@/components/notes/TutorialButton";
import {useIsMobile} from "@/hooks/use-mobile";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {authAtom} from "@/atoms/userState";
import {useRouter} from "next/router";

const data = {
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

const handleLogout = async () => {
  await logoutUser();
};

function Page({children}) {
  const router = useRouter();
  const [, setNoteEvent] = useAtom(noteEventAtom);
  const auth = useAtomValue(authAtom);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    profileIcon: '',
  });

  const isMobile = useIsMobile();
  const [newNotePopoverOpen, setNewNotePopoverOpen] = useState(false);

  const handleNewNote = (mode) => {
    let content = '';
    if (mode === 'editor'){
      content = [{
        children: [{ text: '' }],
        type: 'p',
      }]
    } else if (mode === 'text'){
      content = ''
    }
    {
      setNoteEvent({
        type: 'ADD',
        payload: {
          title: '새 페이지',
          content: content,
          mode: mode,
        },
      });
    };
    // 라우팅 했다가 되돌아왔을때 중복실행을 막기 위해 noteEventAtom 상태 초기화
    setTimeout(() => {
      setNoteEvent(null);
    }, 0); // 이 딜레이를 안넣으면 이벤트 자체가 안됨
  };

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (storedUserInfo) {
      setUserInfo(storedUserInfo);
    } else {
      setUserInfo({name: '', email: '', profileIcon: ''});
    }
  }, []);

  const moveToHome = () => {
    router.push('/notes', undefined, {shallow: true});
  }

  return (
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <div className="step2">
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
                              className="rounded-lg">KIN</AvatarFallback>
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
                        side={isMobile ? "bottom" : "right"}
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
                              KIN
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
                            내 정보
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator/>
                      <DropdownMenuGroup>
                        {auth === 'admin' ? (
                        <a href="/admin">
                          <DropdownMenuItem>
                            <CircleGauge />
                            관리자 대시보드
                          </DropdownMenuItem>
                        </a>
                        ) : (
                        <DropdownMenuItem disabled>
                          <BadgeCheck/>
                          Account
                        </DropdownMenuItem>
                        )}
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator/>
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut/>
                        로그아웃
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </div>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu className="cursor-pointer">
              <Popover open={newNotePopoverOpen} onOpenChange={setNewNotePopoverOpen}>
                <PopoverTrigger asChild>
              <div className="step1">
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <SquarePen/> 새 노트
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
                </PopoverTrigger>
                <PopoverContent>
                  모드 선택
                  <Button variant="outline" className="ml-5 min-w-20" onClick={() => handleNewNote('editor')}>에디터</Button>
                  <Button variant="outline" className="ml-3 min-w-20" onClick={() => handleNewNote('text')}>텍스트</Button>
                </PopoverContent>
              </Popover>
              <SidebarMenuItem>
                <TagManagerModal/>
              </SidebarMenuItem>
              <SidebarMenuItem onClick={moveToHome}>
                <ListView/>
              </SidebarMenuItem>
              <TutorialButton/>
            </SidebarMenu>
          </SidebarHeader>
          <Separator/>
          <CategorySidebar/>
          <SidebarFooter>
            <SidebarMenu className="cursor-pointer mb-1">
              <SidebarMenuItem>
                <div className="step4">
                  <TrashFilter/>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <div className="p-1"/>
          <SidebarRail/>
        </Sidebar>
        <SidebarInset>
          <header
              className="flex sticky top-0 bg-background h-12 shrink-0 items-center gap-2 border-b px-2">
            <div className="flex flex-1 items-center gap-2">
              <SidebarTrigger className="w-20 h-10"/>
              <Separator orientation="vertical" className="mr-2 h-4"/>
              {/*              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="line-clamp-1">
                      탭 추가 예정
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>*/}
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
        <Button variant="ghost">
          <ClipboardList/>
        </Button>
        <Button variant="ghost">
          <UserRoundCog/>
        </Button>
        <Button variant="ghost">
          <Settings/>
        </Button>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 data-[state=open]:bg-accent"
                >
                  <Menu/>
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>샘플 메뉴</TooltipContent>
          </Tooltip>
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