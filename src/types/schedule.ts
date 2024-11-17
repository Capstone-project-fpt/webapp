import { EvaluationType } from "./evaluation";
import { GroupReview, GroupType } from "./group";

export interface ScheduleType {
  id: number,
  title: string,
  type: string,
  description: string,
  link_meeting: string,
  start_time: Date,
  end_time: Date,
  capstone_group: GroupType,
  evaluation_committee: EvaluationType,
  capstone_group_review: GroupReview
}

export enum ScheduleStatus {
  Archived = "archived",
  Reviewing = "reviewing",
  InProgress = "inProgress",
  Incoming = "incoming",
}

export interface CreateScheduleType {
  capstone_group_id: number,
  description: string,
  end_time: Date,
  evaluation_committee_id: number,
  semester_id: number,
  start_time: Date,
  title: string,
  type: string,
}

