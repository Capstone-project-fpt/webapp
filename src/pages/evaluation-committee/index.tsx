import { Button } from "@/components/ui/button";
import { setBreadCrumb } from "@/store/slice/app";
import React, { useEffect } from "react";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import EvaluationGroups from "./evaluation-committee";
import { RootState } from "@/store";

const EvaluationCommittee: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user as any);
  const { user_type } = currentUser.common_info || {};
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Evaluation Committee", link: "/evaluation-committees" },
      ])
    );
  }, [dispatch]);
  return (
    <div>
      <div className="flex justify-end mb-2">
        <Link to="/evaluation-committees/create">
          {user_type !== "student" && user_type !== "teacher" && (
            <Button variant="outline">
              <GoPlus className="h-4 w-4" />
            </Button>
          )}
        </Link>
      </div>
      <EvaluationGroups />
    </div>
  );
};

export default EvaluationCommittee;
