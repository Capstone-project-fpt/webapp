import { setBreadCrumb } from "@/store/slice/app";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Majors = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Majors", link: "/majors" },
      ])
    );
  }, [dispatch]);

  return <div>Majors</div>;
};

export default Majors;
