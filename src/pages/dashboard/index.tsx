import { setBreadCrumb } from "@/store/slice/app";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import CarouselHome from "./components/carousel-home";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setBreadCrumb([{ title: "Home", link: "/" }]));
  }, [dispatch]);

  return (
    <>
      <div>
        <CarouselHome/>
      </div>
    </>
  );
};

export default Dashboard;
