import React from "react";
import LoadingAppJson from "@/lottie/LoadingApp.json";
import Lottie from "lottie-react";

const LoadingApp: React.FC = () => {
  return <Lottie animationData={LoadingAppJson}
  size={ 20 }
  loop={true} />;
};

export default LoadingApp;