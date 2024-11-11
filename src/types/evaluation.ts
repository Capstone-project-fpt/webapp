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
}

export interface CreateEvaluationGroup{
  semester_id: number;
  teacher_ids: number[];
  name: string;
}
