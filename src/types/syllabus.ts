export interface SyllabusType {
    id: number;
    code: string;
    name: string;
    path:string; 
}
export interface SyllabusesType {
    items: SyllabusType[];
    meta: {
      current_page: number;
      total: number;
    };
  }