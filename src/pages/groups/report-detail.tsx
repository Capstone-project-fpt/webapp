import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { setBreadCrumb } from "@/store/slice/app";
import { FileIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import Comment from "./components/comment";

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
        <div className="flex gap-4">
          <h2 className="mb-2">Attachments</h2>
          <Button variant="outline">Add</Button>
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
      <Tabs defaultValue="comments" className="my-4">
        <TabsList>
          <TabsTrigger value="comments" className="lg:w-[150px] w-full">
            Comments
          </TabsTrigger>
          <TabsTrigger value="activities" className="lg:w-[150px] w-full">
            Activities
          </TabsTrigger>
          <TabsTrigger value="grade" className="lg:w-[150px] w-full">
            Grade
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
          <div>
            <Comment />
          </div>
        </TabsContent>
        <TabsContent value="activities">
          <div className="mt-4">
            <p>No activities yet.</p>
          </div>
        </TabsContent>
        <TabsContent value="grade">
          {members.length > 0 ? (
            members.map((member, index) => (
              <div key={index} className="mb-4 flex gap-4">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        member.name
                      )}&size=32`}
                      alt={member.name}
                    />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{member.name}</p>
                  </div>
                </div>
                {editingIndex === index ? (
                  <>
                    <div>
                      <Label>Score</Label>
                      <Input
                        type="number"
                        value={newScore ?? ""}
                        onChange={(e) => setNewScore(Number(e.target.value))}
                      />
                      <Label>Feedback</Label>
                      <Textarea
                        placeholder="Type your message here."
                        value={newFeedback}
                        onChange={(e) => setNewFeedback(e.target.value)}
                      />
                    </div>
                    <div className="mt-2">
                      <Button onClick={cancelUpdateScore} variant="outline">
                        Cancel
                      </Button>
                      <Button onClick={handleUpdate}>Update</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label>Score</Label>
                      <p>{member.score}</p>
                      <Label>Feedback</Label>
                      <p>{member.feedback}</p>
                    </div>
                    <Button onClick={() => handleEdit(index)}>Edit</Button>
                  </>
                )}
              </div>
            ))
          ) : (
            <p>No grade yet.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportDetail;
