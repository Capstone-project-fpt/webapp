import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/store";
import { useGetSemesterQuery } from "@/store/api/v1/endpoints/semesters";
import { setBreadCrumb } from "@/store/slice/app";
import { isNaN } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Decentralization from "./decentralization";
import EvaluationCommittee from "./evaluation-committee";
import Groups from "./groups";
import Information from "./information";

const TABS = [
  { name: "information", label: "Information", component: Information },
  { name: "groups", label: "Groups", component: Groups },
  {
    name: "evaluation-committee",
    label: "Evaluation Committee",
    component: EvaluationCommittee,
  },
  {
    name: "decentralization",
    label: "Decentralization",
    component: Decentralization,
  },
];

const TABS_NAMES = TABS.reduce((acc, tab) => {
  acc[tab.name] = tab.label;
  return acc;
}, {} as Record<string, string>);

const SemesterDetail: React.FC = () => {
  const { semesterId, tab } = useParams<{ semesterId: string; tab?: string }>();
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState(tab || "information");
  const navigate = useNavigate();
  const { toast } = useToast();

  const currentSemester = useSelector(
    (state: RootState) => state.resource.currentSemester
  );

  const validSemesterId =
    semesterId === "current" ? currentSemester?.id : Number(semesterId);

  useEffect(() => {
    if (isNaN(validSemesterId)) {
      toast({
        title: "Invalid semester ID",
        description:
          "The semester ID is invalid. Redirecting to semesters list.",
        variant: "destructive",
      });
      navigate("/semesters");
      return;
    }
  }, [validSemesterId, navigate, toast]);

  const { data, error } = useGetSemesterQuery(
    { id: validSemesterId },
    { skip: !validSemesterId || isNaN(validSemesterId) }
  );

  const semester = data?.data;

  useEffect(() => {
    if (semesterId === "current" && currentSemester?.id) {
      navigate(`/semesters/${currentSemester.id}`);
    }
  }, [semesterId, currentSemester, currentTab, navigate]);

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
