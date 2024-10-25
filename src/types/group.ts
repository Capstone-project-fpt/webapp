
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
