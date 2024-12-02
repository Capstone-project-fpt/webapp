import { Button } from "@/components/ui/button";
import { setBreadCrumb } from "@/store/slice/app";
import React, { useEffect } from "react";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import EvaluationGroups from "./evaluation-committee";
import { RootState } from "@/store";
import { UserTypes } from "@/types/accounts";

const EvaluationCommittee: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Evaluation Committee", link: "/evaluation-committees" },
      ]),
    );
  }, [dispatch]);
  return (
    <div>
      <div className="flex justify-end mb-2">
        <Link to="/evaluation-committees/create">
          {currentUser?.common_info.user_type === UserTypes.ADMIN && (
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
