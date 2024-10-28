import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { setBreadCrumb } from "@/store/slice/app";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import SemesterCard from "./semester-card";
import Groups from './groups';
import EvaluationCommitee from './evaluation-committee';
import { Card, CardContent } from "@/components/ui/card"; 

const TABS = [
  { name: "groups", label: "Groups", component: Groups },
  { name: "evaluation-committee", label: "Evaluation Committee", component: EvaluationCommitee },
];

const TABS_NAMES = TABS.reduce((acc, tab) => {
  acc[tab.name] = tab.label;
  return acc;
}, {} as Record<string, string>);

const SemesterDetail: React.FC = () => {
  const { semesterid, tab } = useParams<{ semesterid: string; tab?: string }>();
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState(tab || "groups");
  const navigate = useNavigate();

  useEffect(() => {
    const breadcrumb = [
      { title: "Home", link: "/" },
      { title: "Semesters", link: "/semesters" },
      { title: "Semester Name", link: `/semesters/${semesterid}` }, 
      {
        title: `${TABS_NAMES[currentTab]}`,
        link: `/semesters/${semesterid}/${currentTab}`,
      },
    ];
    dispatch(setBreadCrumb(breadcrumb));
  }, [currentTab, dispatch, semesterid]);
  
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    navigate(`/semesters/${semesterid}/${tab}`);
  };

  const semesterIdNumber = semesterid ? parseInt(semesterid) : undefined;

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
