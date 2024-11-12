
  export interface ScheduleType {
    id : number,
    title: string,
    type: string,
    description: string,
    capstone_group_id : number,
    evaluation_committee_id: number,
    link_meeting : string,
    start_time: string,
    end_time : string,
}

export interface CreateScheduleType {
    capstone_group_id : number,
    description: string ,
    end_time : string,
    evaluation_committee_id: number,
    semester_id: number,
    start_time: string,
    title: string,
    type: string,
}

