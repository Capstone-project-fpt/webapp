import { useGetGroupReviewsQuery } from "@/store/api/v1/endpoints/groups";
import ReviewTable from "../components/review-table";

import { RootState } from "@/store";
import "@schedule-x/theme-default/dist/index.css";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Reviews = () => {
  const { groupId } = useParams<{ groupId: string }>();

  const currentSemester = useSelector(
    (state: RootState) => state.resource.currentSemester
  );

  const { data: reviews } = useGetGroupReviewsQuery(
    {
      group_id: Number(groupId),
    }
  );

  console.log(reviews);


  return (
    <div className="flex flex-col gap-5">
      <ReviewTable></ReviewTable>
    </div>
  );
};

export default Reviews;
