
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SettingCard } from "@/components/custom/setting";
import { ActionCell } from "@/components/data-table";
import { Button } from '@/components/ui/button';
import { useGetGroupsQuery } from '@/store/api/v1/endpoints/groups';


const Groups: React.FC = () => {
  const { semesterId } = useParams<{ semesterId: string }>(); 
  const { data, error, isLoading } = useGetGroupsQuery({ limit: 10, page: 1 });
  const groups = data?.items || [];
  
  const filteredGroups = groups.filter((group) => group.semester_id === Number(semesterId)); 

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching groups</div>;
  }
  const handleAddGroup = () => {
      console.log("Adding a new evaluation group");
    };
  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddGroup}>Add New Group</Button>
      </div>

      <SettingCard title={`Capstone Group (${filteredGroups.length})`}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>{group.name_group}</TableCell>
                <TableCell>
                  <ActionCell
                    items={[
                      {
                        item: "View Details",
                        onClick: () => {
                          console.log(`Viewing details for ${group.name_group}`);
                        },
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

