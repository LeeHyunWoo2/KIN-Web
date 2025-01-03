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

export default function IntroContent() {
  return (
      <div className="flex flex-col h-[calc(100vh-64px)]">
        <section className="container mx-auto px-4 py-20 text-center">
          <Badge variant="secondary" className="mb-4">
            Introducing Keep Idea Note
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            Build Notion-like editors,
            <br/>
            faster than ever
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-[600px] mx-auto">
            Over 100+ beautifully crafted components and a full-stack AI editor
            template, powered by Plate.js.
            Save time. Build better. Launch sooner.
          </p>
          <div className="flex gap-4 justify-center mb-8">
            <Button size="lg">Browse Templates</Button>
            <Button size="lg" variant="outline">Get all-access</Button>
          </div>
          <div
              className="flex items-center justify-center gap-2 text-muted-foreground">
            <StarIcon className="h-5 w-5 text-yellow-400"/>
            <span>15,000+ developers using Plate</span>
          </div>
        </section>
        <section className="bg-slate-50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Plate Plus</h2>
              <p className="text-muted-foreground">
                Lifetime access to all our components and templates.
                <br/>
                One simple price.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-[1000px] mx-auto">
              {/* Personal Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal</CardTitle>
                  <p className="text-sm text-muted-foreground">For individual
                    builders.</p>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">$299</span>
                    <span
                        className="text-muted-foreground"> one-time payment</span>
                  </div>
                  <Button className="w-full mb-6">Get all-access</Button>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-2">
                      <span
                          className="font-medium">90+ premium components</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-medium">All editor templates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-medium">Lifetime access</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Teams Plan */}
              <Card className="bg-slate-900 text-white">
                <CardHeader>
                  <CardTitle>Teams</CardTitle>
                  <p className="text-sm text-slate-400">Five developer
                    licenses.</p>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">$799</span>
                    <span className="text-slate-400"> one-time payment</span>
                  </div>
                  <Button
                      className="w-full mb-6 bg-white text-slate-900 hover:bg-slate-100">
                    Get all-access for your team
                  </Button>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-2">
                      <span className="font-medium">Team-wide access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-medium">License for up to 5 team members</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <FeatureTabs/>


        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked
            Questions</h2>
          <Accordion type="single" collapsible
                     className="max-w-[800px] mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger>How does it work?</AccordionTrigger>
              <AccordionContent>
                설명을 여기에 추가하세요.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I use this in my project?</AccordionTrigger>
              <AccordionContent>
                설명을 여기에 추가하세요.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What does "lifetime access"
                mean?</AccordionTrigger>
              <AccordionContent>
                설명을 여기에 추가하세요.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>


        <footer className="border-t py-8">
          <div
              className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
          </div>
        </footer>
      </div>
  )
}