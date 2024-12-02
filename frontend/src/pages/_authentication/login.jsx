import Link from "next/link";
import HeaderLayout from "@/components/HeaderLayout";
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import SocialLogin from "@/components/SocialLogin";
import { loginUser} from "@/services/user/authService";
import {useState} from "react";
import {router} from "next/client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import {toast} from "sonner";

export default function Dashboard() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event, id, password) => {
    event.preventDefault();

    if (!id || !password) {
      toast.error('아이디 혹은 비밀번호를 입력해주세요');
    } else {
      const credentials = {id, password};
      const tokens = await loginUser(credentials);
      if (tokens) {
        // 로그인 성공 시 loginSuccess로 리다이렉트
        await router.push("/loginSuccess");
      }
    }
  };

  return (
      <div
          className="w-full lg:grid lg:min-h-[600px] lg:grid-cols xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">로그인</h1>
              <p className="text-balance text-muted-foreground">

              </p>
            </div>
            <div className="grid gap-4"  onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleLogin(e, id, password);
              }
            }}>
              <div className="grid gap-2">
                <Label htmlFor="id">아이디</Label>
                <Input
                    id="id"
                    type="text"
                    placeholder="Enter your id"
                    required
                    value={id}
                    onChange={(e) => setId(e.target.value)} // 상태 업데이트
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center" >
                  <Label htmlFor="password">비밀번호</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                          href=""
                          className="ml-auto inline-block text-sm underline"
                          tabIndex={-1}
                      >
                        비밀번호 찾기
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>개발중</TooltipContent>
                  </Tooltip>
                </div>
                <Input
                    id="password"
                    type="password"
                    placeholder="Enter your Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // 상태 업데이트
                />
              </div>
              <Button type="submit" className="w-full"
                      onClick={(e) => handleLogin(e, id, password)}
              >
                로그인
              </Button>
              <div>
                <Button
                    variant="outline"
                    className="w-[47%] m-1"
                    onClick={(e) => handleLogin(e, 'test', 'Test123456!')}
                >
                  테스트 일반 로그인
                </Button>
                <Button
                    variant="outline"
                    className="w-[47%] m-1"
                    onClick={(e) => handleLogin(e, 'testadmin', 'Admin123456!')}
                >
                  테스트 관리자 로그인
                </Button>
              </div>
              <SocialLogin/>
            </div>
            <div className="mt-4 text-center text-sm">
              아직 계정이 없으시다면 {" "}
              <Link href="/signup" className="underline">
                회원 가입
              </Link>
            </div>
          </div>
        </div>
      </div>
  )
}

Dashboard.getLayout = function getLayout(page) {
  return <HeaderLayout>{page}</HeaderLayout>
}