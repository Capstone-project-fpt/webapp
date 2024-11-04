import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { setBreadCrumb } from "@/store/slice/app";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import EvaluationCommitee from "./evaluation-committee";
import Groups from "./groups";
import SemesterCard from "./semester-card";
import { useGetSemesterQuery } from "@/store/api/v1/endpoints/semesters";
import { useToast } from "@/hooks/use-toast";

const TABS = [
  { name: "groups", label: "Groups", component: Groups },
  {
    name: "evaluation-committee",
    label: "Evaluation Committee",
    component: EvaluationCommitee,
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

  if (error) {
    toast({
      title: "Get semester",
      description: "Something went wrong, please try again.",
      variant: "destructive",
    });

    navigate("/semesters");
  }

  useEffect(() => {
    const breadcrumb = [
      { title: "Home", link: "/" },
      { title: "Semesters", link: "/semesters" },
      {
        title: `Semester ${data?.data.name}`,
        link: `/semesters/${semesterId}`,
      },
      {
        title: `${TABS_NAMES[currentTab]}`,
        link: `/semesters/${semesterId}/${currentTab}`,
      },
    ];
    dispatch(setBreadCrumb(breadcrumb));
  }, [currentTab, dispatch, semesterId, data]);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    navigate(`/semesters/${semesterId}/${tab}`);
  };

  const semesterIdNumber = semesterId ? parseInt(semesterId) : undefined;

  return (
    <div className="flex">
      <div className="flex-none w-1/3 p-4 ">
        <Card className="pt-4 bg-slate-100">
          <CardContent>
            {semesterIdNumber !== undefined ? (
              <SemesterCard id={semesterIdNumber} />
            ) : (
              <div>Semester ID is invalid</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex-grow p-4">
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
