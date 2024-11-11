import { PaginationType } from "./utils";

export interface QueryEvaluationsParams extends PaginationType {
  semester_id?: number;
}

export interface EvaluationType {
  id: number;
  created_at: Date;
  updated_at: Date;
  name: string;
  semester_id: number;
  teacher_ids: number[];
  teachers: MemberEvaluationGroup[];
}

export interface CreateEvaluationGroup{
  semester_id: number;
  teacher_ids: number[];
  name: string;
}

export interface MemberEvaluationGroup {
  id: number;
  email: string;
  name: string;
  phone_number: string;
  sub_major_id: number;
  user_id: number;
  user_type: string;
}
