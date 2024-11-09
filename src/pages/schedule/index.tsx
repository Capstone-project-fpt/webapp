import { setBreadCrumb } from "@/store/slice/app";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";


const Schedule: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Schedule", link: "/schedule" },
      ])
    );
  }, [dispatch]);
  return <div>Hello</div>;

};

export default Schedule;
