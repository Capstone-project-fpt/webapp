import { setBreadCrumb } from "@/store/slice/app";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import ReportCurrentSemester from "./components/report-current-semester";
import ReportChart from "./components/report-chart";


const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setBreadCrumb([{ title: "Home", link: "/" }]));
  }, [dispatch]);

  return (
    <>
      <div>
        <ReportCurrentSemester />
        <div className="pt-4"> 
          <ReportChart />
          </div>

        {/* <CarouselHome/> */}
      </div>
    </>
  );
};

export default Dashboard;
