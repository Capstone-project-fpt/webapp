import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { setBreadCrumb } from "@/store/slice/app";
import { FileIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
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
        { title: "Reports", link: `/groups/${groupId}/reports` },
        {
          title: "Report Name",
          link: `/groups/${groupId}/reports/${reportId}`, //TODO: Replace Report Name with actual report name
        },
      ])
    );
  }, [dispatch, groupId, reportId]);
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Calum Tyler",
      message:
        "Hey @dawtar, wanted to discuss the upcoming KPI & Employee statistics page design!",
      timeAgo: "2 hours ago",
    },
    {
      id: 2,
      author: "Calum Tyler",
      message:
        "Absolutely, @calty I think the design should prioritize simplicity and accessibility.",
      timeAgo: "2 hours ago",
    },
  ]);

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
  return (
    <div>
      <h1 className="mb-4">Report 1 - Project Introduction</h1>

      {/* Status and Due Date */}
      <div className="flex flex-col mb-6">
        <div className="flex items-center gap-4">
          <span>Status:</span>
          <Badge variant="outline">On Progress</Badge>
        </div>
        <div>
          <span>Due date:</span> <span>5 March 2024</span>
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
        <h2 className="mb-2">Attachments</h2>
        <div className="flex gap-4">
          {attachments.map((file) => (
            <Card key={file.id} className="flex items-center gap-2 p-4">
              <FileIcon className="mr-2" />
              <div>
                <p>{file.name}</p>
                <p className="text-sm ">{file.size}</p>
              </div>
              <Button size="sm" className="ml-auto">
                Download
              </Button>
            </Card>
          ))}
        </div>
      </div>

      <Separator />
      {/* Tabs for Comments and Activities */}
      <Tabs defaultValue="comments" className="mt-4">
        <TabsList>
          <TabsTrigger value="comments" className="lg:w-[150px] w-full">
            Comments
          </TabsTrigger>
          <TabsTrigger value="activities" className="lg:w-[150px] w-full">
            Activities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comments">
          <div className="mt-4">
            {comments.map((comment) => (
              <Card key={comment.id} className="mb-4 p-4">
                <p className="font-semibold">{comment.author}</p>
                <p>{comment.message}</p>
                <p className="text-sm ">{comment.timeAgo}</p>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="activities">
          <div className="mt-4">
            <p>No activities yet.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportDetail;
