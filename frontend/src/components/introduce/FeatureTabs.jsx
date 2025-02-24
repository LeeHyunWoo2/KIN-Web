'use client'

import React, {useEffect, useRef, useState} from "react"
import {motion, AnimatePresence} from "framer-motion"
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Card, CardContent} from "@/components/ui/card"
import {Upload, Menu, Radical, Slash} from "lucide-react"
import Image from "next/image";
import demo1 from "/public/images/demo/demo1.png"
import demo2 from "/public/images/demo/demo2.png"
import demo3 from "/public/images/demo/demo3.png"
import demo4 from "/public/images/demo/demo4.png"

export default function FeatureTabs() {
  const features = [
    {
      id: "upload",
      icon: <Upload className="h-4 w-4"/>,
      title: "파일 처리",
      content: (
          <>
            <Image src={demo2} alt="asd"/>
          </>
      )
    },
    {
      id: "context-menu",
      icon: <Menu className="h-4 w-4"/>,
      title: "컨텍스트 메뉴",
      content: (
          <>
            <Image src={demo3} alt="asd"/>
          </>
      )
    },
    {
      id: "slash",
      icon: <Slash className="h-4 w-4"/>,
      title: "슬래시 메뉴",
      content: (
          <>
            <Image src={demo4} alt="asd"/>
          </>
      )
    },
    {
      id: "math",
      icon: <Radical className="h-4 w-4"/>,
      title: "수식",
      content: (
          <>
            <Image src={demo1} alt="asd"/>
          </>
      )
    },
  ]

  const [activeFeature, setActiveFeature] = useState(features[0].id) // 현재 탭
  const [isAutoSwitch, setIsAutoSwitch] = useState(true); // 자동 전환 상태
  const tabsRef = useRef(null) // 탭 참조
  const [isVisible, setIsVisible] = useState(false) // 유저가 탭을 보고 있는지

  useEffect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting)
        },
        { threshold: 0.2 } // 20% 이상 보인다면 보는중으로 간주
    )
    if (tabsRef.current) {
      observer.observe(tabsRef.current)
    }
    return () => {
      if (tabsRef.current) observer.unobserve(tabsRef.current)
    }
  }, [])

  // 자동 전환 동작
  useEffect(() => {
    if (!isAutoSwitch || !isVisible) return // 자동 전환 상태가 꺼지거나 탭이 화면 밖에 있으면 중단
    const interval = setInterval(() => {
      setActiveFeature((prev) => {
        const currentIndex = features.findIndex((feature) => feature.id === prev)
        const nextIndex = (currentIndex + 1) % features.length
        return features[nextIndex].id
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [isAutoSwitch, features])

  // 탭 클릭 시 자동 전환 비활성화
  const handleTabClick = (id) => {
    setActiveFeature(id)
    setIsAutoSwitch(false) // 클릭하면 자동 전환 멈춤
  }

  return (
      <div className="w-full max-w-[863px] mx-auto mb-16">
        <div className="flex items-center space-x-2" ref={tabsRef}>
          <Tabs value={activeFeature} className="w-full">
            <TabsList
                className="flex min-w-fit min-h-12  space-x-8 bg-background">
              {features.map((feature) => (
                  <TabsTrigger
                      key={feature.id}
                      value={feature.id}
                      aria-controls={`tabpanel-${feature.id}`}
                      aria-expanded={activeFeature === feature.id}
                      className="flex items-center gap-2 text-base font-medium text-foreground hover:bg-muted data-[state=active]:bg-muted"
                      onClick={() => handleTabClick(feature.id)}
                  >
                    {feature.icon}
                    {feature.title}
                  </TabsTrigger>
              ))}
            </TabsList>
            <Card>
              <CardContent className="pt-6 relative min-h-[570px]">
                <AnimatePresence>
                  {features.map((feature) =>
                      feature.id === activeFeature ? (
                          <motion.div
                              key={feature.id}
                              className=" inset-0"
                              role="tabpanel"
                              id={`tabpanel-${feature.id}`}
                              aria-labelledby={`tab-${feature.id}`}
                              initial={{opacity: 0}}
                              animate={{opacity: 1}}
                              exit={{opacity: 0}}
                              transition={{duration: 0.4, ease: "easeInOut"}}
                          >
                            <div className="space-y-4 absolute inset-0">
                              {feature.content}
                            </div>
                          </motion.div>
                      ) : null
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </Tabs>
        </div>
        <span className="flex justify-center mt-5 text-sm text-muted-foreground font-medium">해당 이미지는 에디터의 이해를 돕기 위한 다른버전의 샘플입니다.</span>
      </div>

  )
}