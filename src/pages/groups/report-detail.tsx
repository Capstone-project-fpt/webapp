import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { setBreadCrumb } from "@/store/slice/app";
import { FileIcon } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import Comment from "./components/comment-composer";
import { RootState } from "@/store";
import { useGetCapstoneGroupReportDocumentQuery } from "@/store/api/v1/endpoints/groups";
import { LoadingTableLottie } from "@/components";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import { getFileName, getUrlFile } from "@/utils/generate-key-s3";

const ReportDetail: React.FC = () => {
  const { groupId, reportId } = useParams<{
    groupId: string;
    reportId?: string;
  }>();
  const dispatch = useDispatch();
  const { currentGroup } = useSelector((state: RootState) => state.resource);

  const { data, isError, isLoading } = useGetCapstoneGroupReportDocumentQuery({
    capstone_group_id: Number(groupId),
    report_id: Number(reportId),
  });

  const reportData = useMemo(() => {
    return data ? data.data : null;
  }, [data]);

  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Groups", link: "/groups" },
        { title: currentGroup?.name_group, link: `/groups/${groupId}` },
        { title: "Reports", link: `/groups/${groupId}/reports` },
        {
          title: reportData?.name,
          link: `/groups/${groupId}/reports/${reportId}`,
        },
      ])
    );
  }, [dispatch, groupId, reportId, reportData, currentGroup]);

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

  if (isLoading) {
    return (
      <div className=" flex justify-center pt-10">
        <div className=" w-[250px] ">
          <LoadingTableLottie />
        </div>
      </div>
    );
  }

  if (isError) {
    return <ErrorBoundaryComponent />;
  }

  return (
    <div>
      <div className=" text-xl ">{reportData?.name}</div>
      {/* Status and Due Date */}
      <div className="flex flex-col mb-6">
        <div className="flex items-center gap-4">
          <span>Status:</span>
          <Badge variant="outline">{reportData?.mentor_review_status}</Badge>
        </div>
        {/* <div>
          <span>Due date:</span> <span>5 Oct 2024</span>
        </div> */}
      </div>

      {/* Attachments */}
      <div className="my-6">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="">Attachments</h2>
          <FaRegEdit />
        </div>
        <div className="flex gap-4 flex-wrap">
          {reportData?.file_ids.map((file, index) => (
            <div
              key={index}
              className="flex items-center border px-5 py-3 rounded-lg max-w-[512px]"
            >
              <FileIcon className="mr-2" />
              <span className="truncate">{getFileName(file)}</span>
              <Button variant={"outline"} className="ml-3" size="sm">
                <a
                  href={getUrlFile(file)}
                  download={getFileName(file)}
                  className="text-accent underline flex items-center"
                  target="_blank"
                >
                  Download
                </a>
              </Button>
            </div>
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
                <div className="flex gap-1 items-center mb-2">
                  <Avatar>
                    <AvatarImage
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        comment.author
                      )}&size=32`}
                      alt={comment.author}
                    />
                    <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">{comment.author}</span>
                </div>
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
