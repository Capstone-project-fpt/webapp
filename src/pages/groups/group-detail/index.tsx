import { LoadingTableLottie } from "@/components";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetGroupQuery } from "@/store/api/v1/endpoints/groups";
import { setBreadCrumb } from "@/store/slice/app";
import { setCurrentGroup } from "@/store/slice/resource";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Peoples from "./peoples";
import Reports from "./reports";
import Reviews from "./reviews";
import Topics from "./topics";

const TABS = [
  { name: "topics", label: "Topics", component: Topics },
  { name: "reports", label: "Reports", component: Reports },
  { name: "reviews", label: "Reviews", component: Reviews },
  { name: "peoples", label: "Peoples", component: Peoples },
];

const TABS_NAMES = TABS.reduce((acc, tab) => {
  acc[tab.name] = tab.label;
  return acc;
}, {} as Record<string, string>);

const GroupDetail: React.FC = () => {
  const { groupId, tab } = useParams<{ groupId: string; tab?: string }>();

  const {
    data: groupData,
    isLoading,
    error,
  } = useGetGroupQuery({ id: Number(groupId) }, { skip: !groupId });

  const group = groupData?.data;
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState(tab || "topics");
  const navigate = useNavigate();

  useEffect(() => {
    const breadcrumb = [
      { title: "Home", link: "/" },
      { title: "Groups", link: "/groups" },
      {
        title: `${group?.name_group || "Group " + groupId}`,
        link: `/groups/${groupId}`,
      },
      {
        title: `${TABS_NAMES[currentTab]}`,
        link: `/groups/${groupId}/${currentTab}`,
      },
    ];
    dispatch(setBreadCrumb(breadcrumb));
  }, [currentTab, dispatch, group, groupId]);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    navigate(`/groups/${groupId}/${tab}`);
  };

  useEffect(() => {
    if (groupData && group) {
      dispatch(setCurrentGroup(group));
    }
  }, [dispatch, group, groupData]);

  if (isLoading) {
    return (
      <div className=" flex justify-center pt-10">
        <div className=" w-[250px] ">
          <LoadingTableLottie />
        </div>
      </div>
    );
  } else {
    if (error) {
      return (
        <div className="h-full">
          <ErrorBoundaryComponent />;
        </div>
      );
    }
    return (
      <div>
        <Tabs defaultValue={currentTab} onValueChange={handleTabChange}>
          <TabsList>
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.name}
                value={tab.name}
                className="lg:w-[150px] w-full"
              >
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
  }
};

export default GroupDetail;
