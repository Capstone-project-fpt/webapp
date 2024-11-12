import { SettingCard } from "@/components/custom/setting";
import GroupCalendar from "../components/group-calendar";
import ReviewTable from "../components/review-table";

const Reviews = () => {
  return (
    <div className="flex flex-col gap-5">
      <ReviewTable></ReviewTable>
      <SettingCard title="Calendar">
        <GroupCalendar />
      </SettingCard>
    </div>
  );
};

export default Reviews;
