import { LoadingTableLottie } from "@/components";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RootState } from "@/store";
import { useGetEvaluationQuery } from "@/store/api/v1/endpoints/evaluations";
import { setBreadCrumb } from "@/store/slice/app";
import { UserTypes } from "@/types/accounts";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Calendar from "./calendar";
import Assign from "./groups";
import Peoples from "./peoples";
import Reviews from "./reviews";

interface Tab {
  name: string;
  label: string;
  component: () => JSX.Element;
  display: UserTypes[];
}

const EvaluationDetail: React.FC = () => {
  const TABS: Tab[] = useMemo(() => {
    return [
      {
        name: "reviews",
        label: "Reviews",
        component: Reviews,
        display: [UserTypes.ADMIN, UserTypes.TEACHER],
      },
      {
        name: "calendar",
        label: "Calendar",
        component: Calendar,
        display: [UserTypes.ADMIN, UserTypes.TEACHER],
      },
      {
        name: "peoples",
        label: "Peoples",
        component: Peoples,
        display: [UserTypes.ADMIN, UserTypes.STUDENT, UserTypes.TEACHER],
      },
      {
        name: "group-assign",
        label: "Assign",
        component: Assign,
        display: [UserTypes.ADMIN, UserTypes.TEACHER],
      },
    ];
  }, []);

  const TABS_NAMES = TABS.reduce(
    (acc, tab) => {
      acc[tab.name] = tab.label;
      return acc;
    },
    {} as Record<string, string>,
  );

  const { evaluationId, tab } = useParams<{
    evaluationId: string;
    tab?: string;
  }>();

  const {
    data: evaluationData,
    isLoading,
    error,
  } = useGetEvaluationQuery(
    { id: Number(evaluationId) },
    { skip: !evaluationId },
  );

  const evaluation = evaluationData?.data;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(tab || "peoples");
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [filteredTabs, setFilteredTabs] = useState<Tab[]>(TABS);

  const handleTabChange = useCallback(
    (tab: string) => {
      setCurrentTab(tab);
      navigate(`/evaluation-committees/${evaluationId}/${tab}`);
    },
    [evaluationId, navigate],
  );

  useEffect(() => {
    if (currentUser) {
      const filteredTabs = TABS.filter((tab) =>
        tab.display.includes(currentUser?.common_info.user_type),
      );
      setFilteredTabs(filteredTabs);
      handleTabChange(filteredTabs[0].name);
    }
  }, [TABS, currentUser, handleTabChange]);

  useEffect(() => {
    const breadcrumb = [
      { title: "Home", link: "/" },
      { title: "Evaluations", link: "/evaluation-committees" },
      {
        title: `${evaluation?.name || "Evaluation " + evaluationId}`,
        link: `/evaluation-committees/${evaluationId}`,
      },
      {
        title: `${TABS_NAMES[currentTab]}`,
        link: `/evaluation-committees/${evaluationId}/${currentTab}`,
      },
    ];
    dispatch(setBreadCrumb(breadcrumb));
  }, [TABS_NAMES, currentTab, dispatch, evaluation, evaluationId]);

  if (isLoading) {
    return (
      <div className=" flex justify-center pt-10">
        <div className=" w-[250px] ">
          <LoadingTableLottie />
        </div>
      </div>
    );
  } else if (error) {
    return (
      <div className="h-full">
        <ErrorBoundaryComponent />
      </div>
    );
  } else {
    return (
      <div>
        <Tabs defaultValue={currentTab} onValueChange={handleTabChange}>
          <TabsList>
            {filteredTabs.map((tab) => (
              <TabsTrigger
                key={tab.name}
                value={tab.name}
                className="lg:w-[150px] w-full"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {filteredTabs.map((tab) => (
            <TabsContent key={tab.name} value={tab.name} className="mt-4">
              <tab.component />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  }
};

export default EvaluationDetail;
