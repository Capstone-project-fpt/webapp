import { EvaluationType } from "./evaluation";
import { GroupType } from "./group";

export interface ScheduleType {
  id: number,
  title: string,
  type: string,
  description: string,
  capstone_group: GroupType,
  evaluation_committee: EvaluationType,
  link_meeting: string,
  start_time: Date,
  end_time: Date,
}

export enum ScheduleStatus {
  InProgress = "inProgress",
  Incoming = "incoming",
  Archived = "archived",
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

