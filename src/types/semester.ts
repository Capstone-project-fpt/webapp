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

export interface SemestersType {
  items: SemesterType[];
  meta: {
    current_page: number;
    total: number;
  };
}
