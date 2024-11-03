import { AuthGuard, LoadingAppLottie, SideBar, TopHeader } from "@/components";
import { RootState } from "@/store";
import { useGetSubMajorsQuery } from "@/store/api/v1/endpoints/major";
import { useGetCurrentSemesterQuery } from "@/store/api/v1/endpoints/semesters";
import { setCurrentSemester, setSubMajors } from "@/store/slice/resource";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: subMajorsData } = useGetSubMajorsQuery({}, { skip: !user });
  const { data: currentSemesterData } = useGetCurrentSemesterQuery(null, {
    skip: !user,
  });
  const isSideBarOpen = useSelector(
    (state: RootState) => state.app.isSideBarOpen
  );

  // Get list sub majors from api and store to redux if already has user and once time
  useEffect(() => {
    if (user && subMajorsData?.data.items) {
      dispatch(setSubMajors(subMajorsData?.data.items));
    }

    if (user && currentSemesterData?.data) {
      dispatch(setCurrentSemester(currentSemesterData?.data));
    }
  }, [user, subMajorsData?.data, dispatch]);

  return (
    <AuthGuard>
      {user ? (
        <div className="flex">
          <div className=" hidden lg:block">
            <SideBar />
          </div>
          <main
            className={
              " w-full lg:px-5 px-2 " +
              (isSideBarOpen ? "lg:ms-60" : "lg:ms-14")
            }
          >
            <TopHeader />
            <div className=" mt-6 ">
              <Outlet />
            </div>
          </main>
        </div>
      ) : (
        <div className="w-screen h-screen flex justify-center algin-items-center">
          <div className="w-[150px] flex justify-center algin-items-center">
            <LoadingAppLottie />
          </div>
        </div>
      )}
    </AuthGuard>
  );
};

export default MainLayout;
