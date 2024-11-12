import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { setBreadCrumb } from "@/store/slice/app";
import { FileIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";

interface Attachment {
  id: number;
  name: string;
  size: string;
  downloadLink: string;
}

const ReportDetail: React.FC = () => {
  const { groupId, reportId } = useParams<{
    groupId: string;
    reportId?: string;
  }>();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Groups", link: "/groups" },
        { title: "Group Name", link: `/groups/${groupId}` }, //TODO: Replace Group Name with actual group name
        { title: "Reviews", link: `/groups/${groupId}/reviews` },
        {
          title: "Review Name",
          link: `/groups/${groupId}/reports/${reportId}`, //TODO: Replace Report Name with actual report name
        },
      ])
    );
  }, [dispatch, groupId, reportId]);

  const attachments: Attachment[] = [
    {
      id: 1,
      name: "Design brief.pdf",
      size: "1.5 MB",
      downloadLink: "#",
    },
    {
      id: 2,
      name: "Craftboard logo.ai",
      size: "2.5 MB",
      downloadLink: "#",
    },
  ];

  const initialMembers = [
    { name: "Alice", score: 85, feedback: "Good job!" },
    { name: "Bob", score: 78, feedback: "Well done!" },
    { name: "Charlie", score: 92, feedback: "Excellent work!" },
  ];

  const [members, setMembers] = useState(initialMembers);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newScore, setNewScore] = useState<number | null>(null);
  const [newFeedback, setNewFeedback] = useState<string>("");

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setNewScore(members[index].score);
    setNewFeedback(members[index].feedback);
  };

  const cancelUpdateScore = () => {
    setEditingIndex(null);
    setNewScore(null);
    setNewFeedback("");
  };

  const handleUpdate = () => {
    if (editingIndex !== null && newScore !== null) {
      const updatedMembers = [...members];
      updatedMembers[editingIndex] = {
        ...updatedMembers[editingIndex],
        score: newScore,
        feedback: newFeedback,
      };
      setMembers(updatedMembers);
      setEditingIndex(null);
      setNewScore(null);
      setNewFeedback("");
    }
  };
  return (
    <div>
      <div className=" text-xl ">Report 1 - Project Introduction</div>
      {/* Status and Due Date */}
      <div className="flex flex-col mb-6">
        <div className="flex items-center gap-4">
          <span>Status:</span>
          <Badge variant="outline">On Progress</Badge>
        </div>
        <div>
          <span>Due date:</span> <span>5 Oct 2024</span>
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="mb-2">Description</h2>
        <Alert>
          <AlertDescription>
            This page aims to provide real-time insights into employee
            performance metrics and key business indicators.
          </AlertDescription>
        </Alert>
      </div>

      {/* Attachments */}
      <div className="my-6">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="">Attachments</h2>
          <FaRegEdit />
        </div>
        <div className="flex gap-4">
          {attachments.map((file) => (
            <Card key={file.id}>
              <CardHeader>
                <FaRegTrashAlt className="ml-auto" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div>
                    <FileIcon className="mr-2" />
                    <div>
                      <p>{file.name}</p>
                    </div>
                  </div>
                  <Button size="sm">Download</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />
      <Tabs defaultValue="feedback" className="my-4">
        <TabsList>
          <TabsTrigger value="feedback" className="lg:w-[150px] w-full">
            Feedbacks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feedback">
          <div className="mt-4">
            <p>No feedback yet.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportDetail;
