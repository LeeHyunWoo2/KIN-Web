import Link from "next/link";
import Image from "next/image";

import {cn} from "@/lib/utils";
import {Button, buttonVariants} from "@/components/ui/button";
import HeaderLayout from "@/components/HeaderLayout";
import {Label} from "@/components/ui/label";
import {Icons} from "@/components/icons";
import * as React from "react";
import {useState} from "react";
import {
  Card, CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";



export default function AuthenticationPage() {
  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState({
    Nickname:'',
    email: '',
    password: '',
  });

  const handleNext = () => setPage((prevPage) => prevPage + 1);
  const handlePrev = () => setPage((prevPage) => prevPage - 1);

  return (
      <>
        <div className="md:hidden">
          <Image
              src="/examples/authentication-light.png"
              width={1280}
              height={843}
              alt="Authentication"
              className="block dark:hidden"
          />
          <Image
              src="/examples/authentication-dark.png"
              width={1280}
              height={843}
              alt="Authentication"
              className="hidden dark:block"
          />
        </div>
        <div
            className="container relative hidden h-[calc(100vh-64px)] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">

          <Link
              href="/login"
              className={cn(
                  buttonVariants({variant: "ghost"}),
                  "absolute right-4 top-4 md:right-8 md:top-8",
              )}
          >
            Login
          </Link>
          <div
              className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div className="absolute inset-0 bg-zinc-900"/>
            <div
                className="relative z-20 flex items-center text-lg font-medium">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-6 w-6"
              >
                <path
                    d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>
              </svg>
              KINote
            </div>

            <div className="relative z-20 mt-auto">
              <blockquote className="space-y-2">
              <p className="text-lg">
                  &ldquo;대충 검은 화면에 큰따옴표로 아무 말이나 적으면 좀 있어 보이더라고요 .&rdquo;
                </p>
                <footer className="text-sm">현우</footer>
              </blockquote>
            </div>
          </div>
          <div className="lg:p-8">
            {page === 0 && (
            <div
                className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Create an account
                </h1>
                <p className="white text-sm text-muted-foreground">
                  Enter your email below to create your account
                </p>
              </div>
              <div className={cn("grid gap-6")}>
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <Label className="sr-only" htmlFor="email">
                      Email
                    </Label>
                  </div>
                  <Button onClick={handleNext}>
                    Sign In with Email
                  </Button>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"/>
                  </div>
                  <div
                      className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
                  </div>
                </div>
                <Button variant="outline" type="button">
                  <Icons.gitHub className="mr-2 h-4 w-4"/>
                  GitHub
                </Button>
              </div>
              <p className="px-8 text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <Link
                    href="/terms"
                    className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                    href="/privacy"
                    className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
            )}
            {page === 1 && (
                <Card className="max-w-sm mx-auto">
                  <CardHeader>
                    <CardTitle className="text-xl">Sign Up</CardTitle>
                    <CardDescription>
                      Enter your information to create an account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="Nickname">Nickname</Label>
                        <Input
                            id="Nickname"
                            type="Nickname"
                            value={formData.Nickname}
                            onChange={(e) =>
                                setFormData({...formData, Nickname: e.target.value})
                        }
                            placeholder="Nickname"
                            required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({...formData, email: e.target.value})
                            }
                            placeholder="email@example.com"
                            required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({...formData, password: e.target.value})
                        }
                            placeholder="password"
                            required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Create an account
                      </Button>
                      <Button variant="outline" className="w-full" onClick={handlePrev}>
                        Cancel
                      </Button>
                    </div>
                    <div className="mt-4 text-sm text-center">
                      Already have an account?{" "}
                      <Link href="/login" className="underline">
                        Login
                      </Link>
                    </div>
                  </CardContent>
                </Card>
                )}
          </div>
        </div>
      </>
  );
}

AuthenticationPage.getLayout = function getLayout(page) {
  return <HeaderLayout>{page}</HeaderLayout>
}