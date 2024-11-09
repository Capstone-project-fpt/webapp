import { LoadingTableLottie } from "@/components";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import { useGetEvaluationQuery } from "@/store/api/v1/endpoints/evaluations";
import { setBreadCrumb } from "@/store/slice/app";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const EvaluationDetail: React.FC = () => {
  const { evaluationId } = useParams<{ evaluationId: string}>();

  const {
    data: evaluationData,
    isLoading,
    error,
  } = useGetEvaluationQuery({ id: Number(evaluationId) }, { skip: !evaluationId });

  const evaluation = evaluationData?.data;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const breadcrumb = [
      { title: "Home", link: "/" },
      { title: "Evaluations", link: "/Evaluations" },
      {
        title: `${evaluation?.name || "Evaluation " + evaluationId}`,
        link: `/Evaluations/${evaluationId}`,
      },
    ];
    dispatch(setBreadCrumb(breadcrumb));
  }, [ dispatch, evaluation, evaluationId]);

  if (isLoading) {
    return (
      <div className=" flex justify-center pt-10">
        <div className=" w-[250px] ">
          <LoadingTableLottie />
        </div>
      </div>
    );
  } else {
    if (error) {
      return (
        <div className="h-full">
          <ErrorBoundaryComponent />;
        </div>
      );
    }
    return (
      <div>
        Done
      </div>
    );
  }
};

export default EvaluationDetail;
