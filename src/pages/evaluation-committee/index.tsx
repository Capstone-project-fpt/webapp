
import { setBreadCrumb } from "@/store/slice/app";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";


const EvaluationCommittee: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Evaluation Committee", link: "/evaluation-committees" },
      ])
    );
  }, [dispatch]);
  return <div>Evaluation Commitee</div>;

};

export default EvaluationCommittee;
