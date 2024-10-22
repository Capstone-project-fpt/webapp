import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { setBreadCrumb } from "@/store/slice/app";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import About from "./about";
import Peoples from "./peoples";
import Reports from "./reports";

const TABS = [
  { name: "about", label: "About", component: About },
  { name: "reports", label: "Reports", component: Reports },
  { name: "peoples", label: "Peoples", component: Peoples },
];

const TABS_NAMES = TABS.reduce((acc, tab) => {
  acc[tab.name] = tab.label;
  return acc;
}, {} as Record<string, string>);

const GroupDetail: React.FC = () => {
  const { groupId, tab } = useParams<{ groupId: string; tab?: string }>();
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState(tab || "about");
  const navigate = useNavigate();

  useEffect(() => {
    const breadcrumb = [
      { title: "Home", link: "/" },
      { title: "Groups", link: "/groups" },
      { title: "Group Name", link: `/groups/${groupId}` }, //TODO: Replace Group Name with actual group name
      {
        title: `${TABS_NAMES[currentTab]}`,
        link: `/groups/${groupId}/${currentTab}`,
      },
    ];
    dispatch(setBreadCrumb(breadcrumb));
  }, [currentTab, dispatch, groupId]);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    navigate(`/groups/${groupId}/${tab}`);
  };

  return (
    <div>
      <Tabs defaultValue={currentTab} onValueChange={handleTabChange}>
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.name} value={tab.name} className="lg:w-[150px] w-full">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tab) => (
          <TabsContent key={tab.name} value={tab.name} className="mt-4">
            <tab.component />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default GroupDetail;
