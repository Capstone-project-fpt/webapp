import { LectureType } from "./accounts";

export interface TopicType {
  id: number;
  name: string;
  path: string;
  teacher: LectureType;
}

export interface TopicsType {
  items: TopicType[];
  meta: {
    current_page: number;
    total: number;
  };
}
