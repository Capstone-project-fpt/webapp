import { NetworkError } from "@/components";
import useNetworkDetect from "@/hooks/useNetworkDetect";
import { isTokenExpired } from "@/lib/utils";
import { RootState } from "@/store";
import { useGetMeQuery } from "@/store/api/v1/endpoints/user";
import { removeUserInfo, saveUserInfo, setUserInfo } from "@/store/slice/auth";
import { ChildrenType } from "@/types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { getCookie } from "typescript-cookie";
import { useToast } from "../ui/use-toast";

const AuthGuardComponent: React.FC<ChildrenType> = ({ children }) => {
  const token = useSelector((state: RootState) => state?.auth?.token);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOnline } = useNetworkDetect();
  const { data: userInfoData, isLoading, error} = useGetMeQuery({}, { skip: !token });
  const [fetched, setFetched] = useState(false);
  const { toast } = useToast();

  // Checking Authentication
  const checkAuth = () => {
    const storeToken = getCookie("token");
    const isExpired = storeToken && isTokenExpired(storeToken);
    if (!storeToken || isExpired || error) {
      if (location.pathname.includes("/auth")) {
        return;
      }

      if (isExpired) {
        toast({
          title: "Session Expired",
          description: "Please login again to continue",
        });
      }
      navigate("/auth/sign-in");
      dispatch(removeUserInfo());
    } else {
      dispatch(saveUserInfo({ token: storeToken }));
      // Redirect Back Home is Auth Layout
      if (location.pathname.includes("/auth")) {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    checkAuth();
  }, [token]);

  useEffect(() => {
    if (!fetched && !isLoading) {
      if (userInfoData && userInfoData.message) {
        const { data: userInfo } = userInfoData;
        dispatch(setUserInfo(userInfo));
        setFetched(true);
      }
    }
  }, [userInfoData, dispatch, fetched, isLoading]);

  return <div>{isOnline ? children : <NetworkError />}</div>;
};

export default AuthGuardComponent;
