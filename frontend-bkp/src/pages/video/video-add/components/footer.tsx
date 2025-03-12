import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropsWithChildren } from "react";
import { DetailsTab } from "./details-tab";
import { HelpTab } from "./help-tab";

type TabItemProps = {
  value: string;
};

const TabItem = ({ children, value }: PropsWithChildren<TabItemProps>) => {
  return (
    <TabsTrigger className="h-full rounded-none w-20 data-[state=active]:bg-transparent text-gray-50 data-[state=active]:text-white data-[state=active]:border-t-white data-[state=active]:border-t-4 data-[state=active]:shadow-none" value={value}>
      {children}
    </TabsTrigger>
  );
};

export const Footer = () => {
  return (
    <footer className="h-full">
      <Tabs defaultValue="details" className="flex flex-col-reverse h-full">
        <TabsList className="bg-transparent p-1 pt-0 bg-teal-400 rounded-none h-20 flex justify-between absolute w-full z-10">
          <div className="h-full">
            <TabItem value="details">Details</TabItem>
            <TabItem value="lyrics">Lyrics</TabItem>
            <TabItem value="help">Help</TabItem>
          </div>

          <div className="space-x-2 px-2 py-4 float-right">
            <Button variant="outline" className="w-[100px] bg-transparent text-white">
              Preview
            </Button>
            <Button type="submit" className="bg-teal-500 w-[100px] hover:bg-teal-700">
              Save
            </Button>
          </div>
        </TabsList>
        <div className="flex flex-1">
          <TabsContent value="details" className="w-full mt-0">
            <div className="h-[calc(100vh-415px)] flex">
              <DetailsTab />
            </div>
          </TabsContent>
          {/* <TabsContent value="lyrics" className="h-[calc(100vh-415px)]"></TabsContent> */}
          <TabsContent value="help" className="mt-0 ">
            <div className="h-[calc(100vh-415px)] flex">
              <HelpTab />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </footer>
  );
};
