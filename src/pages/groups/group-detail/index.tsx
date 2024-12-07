import { LoadingTableLottie } from "@/components";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetGroupQuery,
  useGetMembersQuery,
} from "@/store/api/v1/endpoints/groups";
import { setBreadCrumb } from "@/store/slice/app";
import { setCurrentGroup } from "@/store/slice/resource";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Peoples from "./peoples";
import Reports from "./reports";
import Reviews from "./reviews";
import Topics from "./topics";
import Score from "./score";
import { RootState } from "@/store";
import { useToast } from "@/hooks/use-toast";

const GroupDetail: React.FC = () => {
  const { groupId, tab } = useParams<{ groupId: string; tab?: string }>();

  const TABS = [
    { name: "topics", label: "Topics", component: Topics },
    { name: "reports", label: "Reports", component: Reports },
    { name: "reviews", label: "Reviews", component: Reviews },
    { name: "peoples", label: "Peoples", component: Peoples },
    { name: "score", label: "Score", component: Score },
  ];

  const TABS_NAMES = TABS.reduce(
    (acc, tab) => {
      acc[tab.name] = tab.label;
      return acc;
    },
    {} as Record<string, string>,
  );

  const {
    data: groupData,
    isLoading,
    error,
  } = useGetGroupQuery({ id: Number(groupId) }, { skip: !groupId });

  const group = groupData?.data;
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState(tab || "topics");
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { toast } = useToast();
  const { data: membersData } = useGetMembersQuery(
    {
      group_id: parseInt(groupId!),
    },
    { skip: !groupId },
  );

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
  }, [TABS_NAMES, currentTab, dispatch, group, groupId]);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    navigate(`/groups/${groupId}/${tab}`);
  };

  useEffect(() => {
    if (groupData && group) {
      dispatch(setCurrentGroup(group));
    }
  }, [dispatch, group, groupData]);

  useEffect(() => {
    if (group && membersData && currentUser) {
      if (
        !membersData.data.members.some(
          (member) => member.user_id === currentUser.common_info.id,
        )
      ) {
        navigate("/groups");
        toast({
          title: "View Detail Capstone Group",
          description: "You are not a member of this capstone group",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  }, [currentUser, group, membersData, navigate, toast]);

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
