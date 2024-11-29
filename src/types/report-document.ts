export enum MentorReviewReportDocumentStatus {
  Reviewing = "reviewing",
  Done = "done",
}

export enum ReportDocumentCategoryType {
  FIRST_REPORT = "first_report",
  SECOND_REPORT = "second_report",
  THIRD_REPORT = "third_report",
  FOURTH_REPORT = "fourth_report",
  FIFTH_REPORT = "fifth_report",
  SIXTH_REPORT = "sixth_report",
  SEVENTH_REPORT = "seventh_report",
}

export interface ReportDocumentType {
  id: number;
  capstone_group_id: number;
  conclusion?: string;
  file_ids: string[];
  mentor_review_status: MentorReviewReportDocumentStatus;
  name: string;
  type_report: ReportDocumentCategoryType;
  created_at: Date;
  updated_at: Date;
}

export interface CreateReportDocumentBody {
  file_ids: string[];
  name: string;
  type_report: ReportDocumentCategoryType;
  capstone_group_id: number;
}

export interface UpdateReportDocumentBody {
  file_ids: string[];
  name: string;
  capstone_group_id: number;
  id: number;
}
