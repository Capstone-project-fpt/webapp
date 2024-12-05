export interface UpsertSemesterType {
  id?: number;
  name: string;
  start_time: Date;
  end_time: Date;
}

export interface SemesterType {
  id: number;
  name: string;
  start_time: Date;
  end_time: Date;
}

export interface SemesterWithCountType extends SemesterType {
  total_capstone_groups: number;
  total_evaluation_committees: number;
}
