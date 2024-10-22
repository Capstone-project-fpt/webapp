import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RootState } from "@/store";
import { BreadcrumbType } from "@/types";
import { SlashIcon } from "@radix-ui/react-icons";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Breadcrumbs = () => {
  const breadCrumbs = useSelector((state: RootState) => state.app.breadCrumbs);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadCrumbs?.map((breadcrumb: BreadcrumbType, index: number) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              <Link to={breadcrumb.link}>{breadcrumb.title}</Link>
            </BreadcrumbItem>
            {index < breadCrumbs.length - 1 && (
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
