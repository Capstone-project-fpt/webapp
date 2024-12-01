import React from "react";
import LoadingTableJson from "@/lottie/LoadingTable.json";
import Lottie from "lottie-react";

const LoadingTable: React.FC = () => {
  return <Lottie animationData={LoadingTableJson}
  size={ 20 }
  loop={true} />;
};

export default LoadingTable;
