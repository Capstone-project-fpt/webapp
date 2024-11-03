import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SettingCard } from "@/components/custom/setting";
import { ActionCell } from "@/components/data-table";
import {
  useGetGroupsQuery,
  useLazyGetMentorAndListMembersGroupQuery,
} from "@/store/api/v1/endpoints/groups";
import { GroupType } from "@/types/group";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserTypes } from "@/types/accounts";
import { useToast } from "@/hooks/use-toast";

const Groups: React.FC = () => {
  const { semesterId } = useParams<{ semesterId: string }>();
  const [triggerGetMentorAndListMembersGroup] =
    useLazyGetMentorAndListMembersGroupQuery();
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const { data, error, isLoading } = useGetGroupsQuery({
    limit: 10,
    page: 1,
    semester_id: Number(semesterId),
  });

  const groups: GroupType[] = Array.isArray(data?.data?.items)
    ? data.data.items
    : [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching groups</div>;
  }

  const handleViewDetailCapstoneGroup = async (capstone_group_id: number) => {
    if (currentUser?.common_info.user_type === UserTypes.STUDENT) {
      const {
        data: { members },
      } = await triggerGetMentorAndListMembersGroup({
        capstone_group_id,
      }).unwrap();

      if (
        !members
          .map((m) => m.id)
          .includes(currentUser.extra_info.student!.student_id)
      ) {
        toast({
          title: "View Detail Capstone Group",
          description: "You are not a member of this capstone group",
          variant: "destructive",
        });
      }
    }

    // navigate('/') TODO: redirect to capstone group detail
  };

  return (
    <div>
      <SettingCard title={`Capstone Group (${groups.length})`}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="flex items-center justify-center">
                Total Members
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>{group.name_group}</TableCell>
                <TableCell className="flex items-center justify-center">
                  {group.total_members}
                </TableCell>
                <TableCell>
                  <ActionCell
                    items={[
                      {
                        item: "View Details",
                        onClick: () => handleViewDetailCapstoneGroup(group.id),
                      },
                      {
                        item: "Edit",
                        onClick: () => {
                          console.log(`Editing group ${group.name_group}`);
                        },
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SettingCard>
    </div>
  );
};

export default Groups;
