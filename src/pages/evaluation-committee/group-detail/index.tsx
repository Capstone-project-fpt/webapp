import { LoadingTableLottie } from "@/components";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetEvaluationQuery } from "@/store/api/v1/endpoints/evaluations";
import { setBreadCrumb } from "@/store/slice/app";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Calendar from "./calendar";
import Peoples from "./peoples";

const TABS = [
  { name: "calendar", label: "Calendar", component: Calendar },
  { name: "peoples", label: "Peoples", component: Peoples },
];

const TABS_NAMES = TABS.reduce((acc, tab) => {
  acc[tab.name] = tab.label;
  return acc;
}, {} as Record<string, string>);

const EvaluationDetail: React.FC = () => {
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
    { skip: !evaluationId }
  );

  const evaluation = evaluationData?.data;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(tab || "calendar");

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    navigate(`/evaluation-committees/${evaluationId}/${tab}`);
  };

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
  }, [currentTab, dispatch, evaluation, evaluationId]);

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

export default EvaluationDetail;
