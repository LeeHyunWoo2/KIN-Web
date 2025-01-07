'use client'

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Sparkles, Menu, Slash, ActivityIcon as Function } from 'lucide-react'

export default function FeatureTabs() {
  const features = [
    {
      id: "equation",
      icon: <Function className="h-4 w-4" />,
      title: "Equation",
      description: "Express complex mathematical concepts in both inline and block formats.",
      content: (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Key features:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>LaTeX syntax support</li>
                <li>Inline and block equation formats</li>
              </ul>
            </div>
            <div>
              <p className="mb-2">Inline equation example: E = mc² (Einstein's famous equation)</p>
              <div className="bg-slate-100 p-4 rounded-lg text-center my-4">
                <p className="text-lg">-b ± √(b² - 4ac) / 2a</p>
              </div>
              <p className="text-sm text-muted-foreground">The quadratic formula for solving ax² + bx + c = 0</p>
            </div>
          </div>
      )
    },
    {
      id: "ai",
      icon: <Sparkles className="h-4 w-4" />,
      title: "AI Menu",
      description: "Three ways to open the AI menu:",
      content: (
          <div className="space-y-4">
            <ol className="list-decimal pl-6 space-y-2">
              <li>Press space at the start of the block or select text to see Ask AI in the floating toolbar</li>
              <li>Right click on the block to open the context menu and see the Ask AI</li>
              <li>Use slash command '/'. Type '/' in the block or end of the block.</li>
            </ol>
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <p className="text-blue-600">The sun began to set, casting a warm golden hue across the landscape...</p>
              <div className="bg-white shadow-sm rounded-lg p-2 mt-2 flex items-center gap-2">
                <span className="text-sm text-gray-500">Ask AI anything...</span>
              </div>
            </div>
          </div>
      )
    },
    {
      id: "upload",
      icon: <Upload className="h-4 w-4" />,
      title: "Upload Files",
      description: "Our editor supports four versatile media types for upload:",
      content: (
          <div className="space-y-4">
            <ul className="space-y-4">
              <li>
                <div className="bg-slate-100 rounded-lg p-3 flex items-center gap-3">
                  <div className="bg-white p-2 rounded">📷</div>
                  <div>
                    <p className="font-medium">Images</p>
                    <p className="text-sm text-muted-foreground">Enhance your content with visuals (.jpg, .png, .jpeg)</p>
                  </div>
                </div>
              </li>
              <li>
                <div className="bg-slate-100 rounded-lg p-3 flex items-center gap-3">
                  <div className="bg-white p-2 rounded">🎥</div>
                  <div>
                    <p className="font-medium">Videos</p>
                    <p className="text-sm text-muted-foreground">Embed engaging video content (.mp4)</p>
                  </div>
                </div>
              </li>
              <li>
                <div className="bg-slate-100 rounded-lg p-3 flex items-center gap-3">
                  <div className="bg-white p-2 rounded">🎵</div>
                  <div>
                    <p className="font-medium">Audio</p>
                    <p className="text-sm text-muted-foreground">Add sound clips or music (.mp3)</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
      )
    }
  ]

  return (
      <Card className="w-full max-w-4xl mx-auto mb-16">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Tabs defaultValue="equation" className="w-full">
              <TabsList>
                {features.map((feature) => (
                    <TabsTrigger
                        key={feature.id}
                        value={feature.id}
                        className="flex items-center gap-2"
                    >
                      {feature.icon}
                      {feature.title}
                    </TabsTrigger>
                ))}
              </TabsList>
              <CardContent className="pt-6">
                <AnimatePresence>
                  {features.map((feature) => (
                      <TabsContent key={feature.id} value={feature.id}>
                        <motion.div
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                          <div className="space-y-4">
                            <h2 className="text-2xl font-bold">{feature.title}</h2>
                            <p className="text-muted-foreground">{feature.description}</p>
                            {feature.content}
                          </div>
                        </motion.div>
                      </TabsContent>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Tabs>
          </div>
        </CardHeader>
      </Card>
  )
}