import { StudentDetailType } from "./accounts";
import { PaginationType } from "./utils";

export enum GroupStatus {
  ReviewingTopic = "reviewing_topic",
  InProgress = "in_progress",
  FinalizedScore = "finalized_score",
}

export interface QueryGroupsParams extends PaginationType {
  semester_id?: number;
  status?: GroupStatus;
}

export interface GroupType {
  id: number;
  created_at: Date;
  updated_at: Date;
  leader_id: number;
  mentor_id: number;
  major_id: number;
  name_group: string;
  semester_id: number;
  status: GroupStatus;
  topic_id: number | null;
  total_members: number;
}

export interface MemberCapstoneGroup {
  id: number;
  code: string;
  email: string;
  name: string;
  phone_number: string;
  sub_major_id: number;
  user_id: number;
  user_type: string;
}

export interface MentorCapstoneGroup {
  id: number;
  email: string;
  name: string;
  phone_number: string;
  sub_major_id: number;
  user_id: number;
  user_type: string;
}

export interface MentorAndListMembersCapstoneGroup {
  leader_id: number;
  members: MemberCapstoneGroup[];
  mentor?: MentorCapstoneGroup;
}

export interface CreateGroupBody {
  major_id: number;
  semester_id: number;
  student_ids: number[];
  name_group: string;
  leader_id: number;
}

export interface GroupMember {
  id: number;
  user_id: number;
  name: string;
  email: string;
  phone_number: string;
  user_type: string;
  sub_major_id: number;
  code: string;
}

export interface GroupMentor {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  sub_major_id: number;
  user_type: string;
  user_id: number;
}
export interface MembersType {
  mentor: GroupMentor | null;
  members: GroupMember[];
  leader_id: number;
}

export enum InvitationMentorStatus {
  Pending = "pending",
  Approve = "approve",
  Reject = "reject",
}
export interface InvitationMentor {
  capstone_group_id: number;
  id: number;
  mentor: GroupMentor;
  mentor_id: number;
  status: InvitationMentorStatus;
  created_at: Date;
  expired_at: Date;
  updated_at: Date;
}

export enum TopicReviewStatus {
  Reviewing = "reviewing",
  Approved = "approved",
  Rejected = "rejected",
}

export interface TopicGroup {
  id: number;
  topic: string;
  document_path: string;
  capstone_group_id: number;
  status_review: TopicReviewStatus;
  approved_at?: Date;
  approved_by?: GroupMentor;
  approved_by_id?: number;
  rejected_at?: Date;
  rejected_by?: GroupMentor;
  rejected_by_id?: number;
  created_at: Date;
  updated_at: Date;
}

export interface TopicGroupFeedback {
  id: number;
  feedback: string;
  reviewer_id: number;
  approved_by: GroupMentor;
  created_at: Date;
  updated_at: Date;
  capstone_group_topic_id: number;
}

export interface ReportComment {
  id: number;
  message: string;
  user: GroupMember | GroupMentor;
  created_at: Date;
  updated_at: Date;
}

export interface GroupReview {
  id: number;
  capstone_group_id: number;
  feedback: string;
  report_files: string[];
  schedule_review_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface StudentReportDocumentScore {
  id: number;
  student_id: number;
  student: StudentDetailType;
  score: number;
  report_document_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface UpdateStudentScore {
  student_id: number;
  score: number | null;
}

export interface UpdateListStudentScore {
  report_document_id: number;
  student_score_data: UpdateStudentScore[];
  capstone_group_id: number;
  conclusion: string | null;
}

export interface FinalScoreStudent {
  score: number;
  status: "pass" | "fail";
  student_id: number;
  student: GroupMember;
}
