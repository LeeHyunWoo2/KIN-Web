import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { StarIcon } from 'lucide-react'
import FeatureTabs from "@/components/introduce/FeatureTabs";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import TechStack from "@/components/introduce/Tech-Stack";
import * as React from "react";


export default function IntroContent() {
  return (
      <div className="flex flex-col">
        <section className="container mx-auto px-4 py-20 text-center">
          <Badge variant="secondary" className="mb-4">
            Introducing Keep Idea Note
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            노트 앱 소개
            <br/>
            샘플 제목
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-[600px] mx-auto">
            2~3 문장 정도의 소개 문구<br/>
            2~3 문장 정도의 소개 문구
          </p>
          <div className="flex gap-4 justify-center mb-8">
            <Button size="lg">버튼1</Button>
            <Button size="lg" variant="outline">버튼2</Button>
          </div>
          <div
              className="flex items-center justify-center gap-2 text-muted-foreground">
            <StarIcon className="h-5 w-5 text-yellow-400"/>
            <span>예제 문구</span>
          </div>
        </section>

        {/*주요 기능 사진, gif*/}
        <FeatureTabs/>

        <TechStack/>

        <section className="bg-slate-50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Title</h2>
              <p className="text-muted-foreground">
                description 1
                <br/>
                description 2
              </p>
            </div>

            {/* 주요 기술 스택 */}
            <div className="grid md:grid-cols-2 gap-8 max-w-[1000px] mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>A</CardTitle>
                  <p className="text-sm text-muted-foreground"></p>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">1</span>
                    <span
                        className="text-muted-foreground"> one</span>
                  </div>
                  <Button className="w-full mb-6"></Button>
                  <ul className="space-y-4">
                    <li>content 1</li>
                    <li>content 2</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 text-white">
                <CardHeader>
                  <CardTitle>B</CardTitle>
                  <p className="text-sm text-slate-400"></p>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">2</span>
                    <span className="text-slate-400"> two</span>
                  </div>
                  <Button
                      className="w-full mb-6 bg-white text-slate-900 hover:bg-slate-100">
                  </Button>
                  <ul className="space-y-4">
                    <li>content 1</li>
                    <li>content 2</li>
                  </ul>

                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Q&A</h2>
          <Accordion type="single" collapsible
                     className="max-w-[800px] mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger>질문 1</AccordionTrigger>
              <AccordionContent>
                설명 예제
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>질문 2</AccordionTrigger>
              <AccordionContent>
                설명 예제
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>질문 3</AccordionTrigger>
              <AccordionContent>
                설명 예제
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>


        <footer className="border-t py-8">
          <div
              className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 이현우. All rights reserved.</p>
          </div>
        </footer>
      </div>
  )
}