import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Peoples from "./peoples";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "@/store/slice/app";

const GroupDetail: React.FC = () => {
  const { groupId, tab } = useParams<{ groupId: string; tab?: string }>();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Groups", link: "/groups" },
        { title: "Group Name", link: `/groups/${groupId}` }, //TODO: Replace Group Name with actual group name
      ])
    );
  }, [dispatch, groupId]);

  const defaultTab = tab || "about";
  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    navigate(`/groups/${groupId}/${tab}`);
  };

  return (
    <div>
      <Tabs defaultValue={defaultTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="about" className="lg:w-[150px] w-full">
            About
          </TabsTrigger>
          <TabsTrigger value="reports" className="lg:w-[150px] w-full">
            Reports
          </TabsTrigger>
          <TabsTrigger value="peoples" className=" lg:w-[150px] w-full ">
            Peoples
          </TabsTrigger>
          <TabsTrigger value="setting" className=" lg:w-[150px] w-full ">
            Setting
          </TabsTrigger>
        </TabsList>

        <TabsContent value="about" className=" mt-4 ">
          <div> about</div>
        </TabsContent>
        <TabsContent value="reports" className=" mt-4 ">
          <div> Reports</div>
        </TabsContent>
        <TabsContent value="peoples" className=" mt-4 ">
          <Peoples />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupDetail;
