import Link from "next/link";
import HeaderLayout from "@/components/HeaderLayout";
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import SocialLogin from "@/components/SocialLogin";
import {loginUser} from "@/services/authService";
import {useState} from "react";
import {router} from "next/client";


export default function Dashboard() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    const credentials = {
      id,
      password,
    };

    const tokens = await loginUser(credentials);
    if (tokens) {
      // 로그인 성공 시 리다이렉트
      router.push("/notes");
    } else {
      console.error("로그인 실패");
    }
  };

  const testHandleLogin = async (event) => {
    event.preventDefault();

    const credentials = {
      id: 'test',
      password: 'Test123456!',
    };

    const tokens = await loginUser(credentials);
    if (tokens) {
      // 로그인 성공 시 리다이렉트
      router.push("/notes");
    } else {
      console.error("로그인 실패");
    }
  };


  const testAdminHandleLogin = async (event) => {
    event.preventDefault();

    const credentials = {
      id: 'testadmin',
      password: 'Admin123456!',
    };

    const tokens = await loginUser(credentials);
    if (tokens) {
      // 로그인 성공 시 리다이렉트
      router.push("/notes");
    } else {
      console.error("로그인 실패");
    }
  };


  return (
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-balance text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="id">ID</Label>
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
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                      href=""
                      className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // 상태 업데이트
                />
              </div>
              <Button type="submit" className="w-full" onClick={handleLogin}>
                Login
              </Button>
              <div>
              <Button variant="outline" className="w-[47%] m-1" onClick={testHandleLogin}>
                테스트 일반 로그인
              </Button>
              <Button variant="outline" className="w-[47%] m-1" onClick={testAdminHandleLogin}>
                테스트 관리자 로그인
              </Button>
              </div>
              <SocialLogin/>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
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