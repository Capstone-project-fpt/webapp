import { LoadingTableLottie } from "@/components";
import DateDisplay from "@/components/common/date";
import EmptyResources from "@/components/common/empty-resource";
import { GroupStatusBadge } from "@/components/common/status-badge";
import { ActionCell, DateCell } from "@/components/data-table";
import ErrorBoundaryComponent from "@/components/error/error-boundary";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RootState } from "@/store";
import { useGetCurrentGroupsSemesterQuery } from "@/store/api/v1/endpoints/groups";
import { setBreadCrumb } from "@/store/slice/app";
import { UserTypes } from "@/types/accounts";
import React, { useEffect, useMemo } from "react";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";

const YourGroups = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Groups", link: "/groups" },
        { title: "Your Groups", link: "/me" },
      ])
    );
  }, [dispatch]);

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const currentSemester = useSelector(
    (state: RootState) => state.resource.currentSemester
  );

  const {
    data: queryData,
    error,
    isLoading,
  } = useGetCurrentGroupsSemesterQuery(
    {
      semester_id: Number(currentSemester?.id),
    },
    { skip: !currentSemester }
  );

  const groups = useMemo(() => queryData?.data, [queryData]);

  if (isLoading) {
    return (
      <div className=" flex justify-center pt-10">
        <div className=" w-[250px] ">
          <LoadingTableLottie />
        </div>
      </div>
    );
  }

  return (
    <div>
      {groups && groups.length > 0 ? (
        <>
          {groups.length === 1 && <Navigate to={`/groups/${groups[0].id}`} />}

          {groups.length > 1 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Total Members</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(groups || []).map((group) => {
                  return (
                    <TableRow key={group.id}>
                      <TableCell className="flex items-center space-x-2">
                        {group.name_group}
                      </TableCell>
                      <TableCell>{group.total_members}</TableCell>
                      <TableCell>
                        <GroupStatusBadge status={group.status} />
                      </TableCell>
                      <TableCell>
                        <DateCell date={group.created_at} />
                      </TableCell>
                      <TableCell>
                        <ActionCell
                          items={[
                            {
                              item: "View Detail",
                              onClick: () => {
                                navigate("/groups/" + group.id);
                              },
                            },
                          ]}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </>
      ) : (
        <EmptyResources
          title="Your do not have any groups in this semester"
          content="You can create a new group"
        >
          <Link to="/groups">
            {currentUser?.common_info.user_type !== UserTypes.TEACHER && (
              <Button variant="outline">
                <GoPlus className="h-4 w-4" />
                Create Group
              </Button>
            )}
          </Link>
        </EmptyResources>
      )}
    </div>
  );
};

export default YourGroups;
