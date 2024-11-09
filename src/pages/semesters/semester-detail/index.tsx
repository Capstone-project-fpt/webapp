import DateDisplay from "@/components/common/date";
import { SettingCard } from "@/components/custom/setting";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useGetSemesterQuery } from "@/store/api/v1/endpoints/semesters";
import { setBreadCrumb } from "@/store/slice/app";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import EvaluationCommittee from "./evaluation-committee";
import Groups from "./groups";

const TABS = [
  { name: "groups", label: "Groups", component: Groups },
  {
    name: "evaluation-committee",
    label: "Evaluation Committee",
    component: EvaluationCommittee,
  },
];

const TABS_NAMES = TABS.reduce((acc, tab) => {
  acc[tab.name] = tab.label;
  return acc;
}, {} as Record<string, string>);

const SemesterDetail: React.FC = () => {
  const { semesterId, tab } = useParams<{ semesterId: string; tab?: string }>();
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState(tab || "groups");
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data, error } = useGetSemesterQuery(
    { id: Number(semesterId) },
    { skip: !semesterId }
  );

  const semester = data?.data;

  if (error) {
    toast({
      title: "Get semester",
      description: "Something went wrong, please try again.",
      variant: "destructive",
    });

    navigate("/semesters");
  }

  useEffect(() => {
    if (tab) {
      setCurrentTab(tab);
    }
  }, [tab]);

  useEffect(() => {
    const breadcrumb = [
      { title: "Home", link: "/" },
      { title: "Semesters", link: "/semesters" },
      {
        title: `Semester ${semester?.name}`,
        link: `/semesters/${semesterId}`,
      },
      {
        title: `${TABS_NAMES[currentTab]}`,
        link: `/semesters/${semesterId}/${currentTab}`,
      },
    ];
    dispatch(setBreadCrumb(breadcrumb));
  }, [currentTab, dispatch, semesterId, data, semester?.name]);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    navigate(`/semesters/${semesterId}/${tab}`);
  };

  return (
    <div className="flex gap-4">
      <div className="flex-none w-1/4">
        {semester ? (
          <SettingCard title={`${semester.name}`}>
            <div className="grid grid-cols-[max-content_max-content] gap-y-2 gap-x-4 items-center">
              <span>Start date</span>
              <DateDisplay
                date={new Date(semester.start_time)}
                format="MMM DD, YYYY"
              />
              <span>End date</span>
              <DateDisplay
                date={new Date(semester.end_time)}
                format="MMM DD, YYYY"
              />
            </div>
          </SettingCard>
        ) : null}
      </div>

      <div className="flex-grow">
        <Tabs value={currentTab} onValueChange={handleTabChange}>
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
    </div>
  );
};

export default SemesterDetail;
