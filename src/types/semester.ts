export interface SemesterType {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
}

export interface SemestersType {
  items: SemesterType[];
  meta: {
    current_page: number;
    total: number;
  };
}
