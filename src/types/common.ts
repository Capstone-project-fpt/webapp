import { GroupMember, GroupMentor } from "./group";

export interface CommentType {
  id?: number;
  content: string;
  user?: GroupMentor | GroupMember ;
  created_at?: Date;
}
