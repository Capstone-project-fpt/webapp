
export enum GroupStatus {
  ReviewingTopic = "reviewing_topic",
  InProgress = "in_progress",
}
export interface GroupType {
  id: number;
  created_at: Date;
  updated_at: Date;
  leader_id: number;
  major_id: number;
  name_group: string;
  semester_id: number;
  status: GroupStatus;
  topic_id: number | null;
}


export interface CreateGroupBody {
  major_id: number;
  semester_id: number;
  student_ids: number[];
  name_group: string;
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
  phone_number: string,
  sub_major_id: number,
  user_type: string;
  user_id: number;
}
export interface MembersType {
  mentor: GroupMentor | null;
  members: GroupMember[]
  leader_id: number;
}

export enum InvitationMentorStatus {
  Pending = 'pending',
  Approve = 'approve',
  Reject = 'reject'
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
