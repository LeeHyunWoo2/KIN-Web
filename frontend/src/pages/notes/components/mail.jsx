import * as React from "react";
import {Search,} from "lucide-react";
import {MailDisplay} from "./mail-display";
import {MailList} from "./mail-list";
import {mails as mailData} from "../data";
import {useMail} from "../use-mail";
import {Separator} from "@/components/ui/separator";
import {Input} from "@/components/ui/input";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {TooltipProvider} from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Mail({
  mails = mailData,
  defaultLayout = [265, 440, 655],
}) {
  const [mail] = useMail();

  return (
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup
            direction="horizontal"
            className="h-full max-h-[800px] items-stretch"
        >
          <ResizablePanel defaultSize={defaultLayout[27]} minSize={27}>
            <Tabs defaultValue="all">
              <div className="flex items-center px-4 py-2">
                <h1 className="text-xl font-bold">Inbox</h1>
                <TabsList className="ml-auto">
                  <TabsTrigger
                      value="all"
                      className="text-zinc-600 dark:text-zinc-200"
                  >
                    All mail
                  </TabsTrigger>
                  <TabsTrigger
                      value="unread"
                      className="text-zinc-600 dark:text-zinc-200"
                  >
                    Unread
                  </TabsTrigger>
                </TabsList>
              </div>
              <Separator />
              <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <form>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search" className="pl-8" />
                  </div>
                </form>
              </div>
              <TabsContent value="all" className="m-0">
                <MailList items={mails} />
              </TabsContent>
              <TabsContent value="unread" className="m-0">
                <MailList items={mails.filter((item) => !item.read)} />
              </TabsContent>
            </Tabs>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={defaultLayout[2]}>
            <MailDisplay
                mail={mails.find((item) => item.id === mail.selected) || null}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
  );
}
