import { setBreadCrumb } from "@/store/slice/app";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setBreadCrumb([{ title: "Home", link: "/" }]));
  }, [dispatch]);

  return (
    <>
      <div>Homepage</div>
    </>
  );
};

export default Dashboard;
