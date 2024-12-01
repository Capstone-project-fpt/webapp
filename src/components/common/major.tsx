import { RootState } from "@/store";
import React from "react";
import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";

const SubMajor: React.FC<{ id: number }> = ({ id }) => {
  const subMajors = useSelector((state: RootState) => state.resource.subMajors);

  if (subMajors && subMajors?.length) {
    const subMajor = subMajors.find((item) => item.id === id);

    if (subMajor) {
      return <Badge variant="outline">{subMajor.name}</Badge>
    }
  }
};

export default SubMajor;
