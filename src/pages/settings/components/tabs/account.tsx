import SubMajor from "@/components/common/major";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RootState } from "@/store/index";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const Account: React.FC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user as any);
  const { name, email, phone_number, user_type } =
    currentUser.common_info || {};
  const { code, sub_major_id, capstone_group_id } =
    currentUser.extra_info?.student || currentUser.extra_info?.teacher || {};

  const isAdmin = user_type === "admin";
  const isTeacher = user_type === "teacher";

  return (
    <div>
      <div className="text-xl">Personal Information</div>
      <div className=" text-slate-500 mt-2 ">
        Access and manage your personal information, including personal details,
        preferences, and settings.
      </div>
      <div className=" my-4 border dark:border-foreground " />
      <div className="flex items-center">
        <div className="flex flex-col md:flex-row gap-10 w-full">
          <div className="w-full md:w-1/2">
            <Card className="rounded-lg h-full">
              <CardHeader className="flex flex-col items-center">
                <Avatar className="w-48 h-48 mb-6">
                  <AvatarFallback>
                    {currentUser ? name.charAt(0) : "User"}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-3xl font-bold tracking-tight mt-4">
                  {name}
                </h2>
              </CardHeader>
            </Card>
          </div>

          <div className="w-full md:w-1/2">
            <div className="flex flex-col gap-8 h-full">
              <Card className="rounded-lg">
                <CardHeader>
                  <h3 className="text-xl font-bold">
                    {isAdmin ? "FPT University" : "Group Capstone Project"}
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-4">
                    <p className=" font-semibold">
                      {isAdmin ? "Campus" : "Name Group"}
                    </p>
                    <p className="">{isAdmin ? "Đà Nẵng" : "Đom Đóm"}</p>
                  </div>
                  {isTeacher || isAdmin ? null : (
                    <div className="flex justify-between mb-4">
                      <p className=" font-semibold">Mentor</p>
                      <p className="">Trần Văn Hoàng</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-lg">
                <CardHeader>
                  <h3 className="text-xl font-bold">Information</h3>
                </CardHeader>
                <CardContent>
                  {user_type !== "admin" && user_type !== "teacher" && (
                    <div className="flex justify-between mb-4">
                      <p className=" font-semibold">Student ID</p>
                      <p className="">{code}</p>
                    </div>
                  )}
                  <div className="flex justify-between mb-4">
                    <p className=" font-semibold">Role</p>
                    <p className="">
                      {user_type.charAt(0).toUpperCase() + user_type.slice(1)}
                    </p>
                  </div>
                  <div className="flex justify-between mb-4">
                    <p className=" font-semibold">Email</p>
                    <p className="">{email}</p>
                  </div>
                  <div className="flex justify-between mb-4">
                    <p className=" font-semibold">Phone Number</p>
                    <p className="">{phone_number}</p>
                  </div>
                  {user_type !== "admin" && (
                    <div className="flex justify-between mb-4">
                      <p className=" font-semibold">Sub Major</p>
                      <p className="">
                        <SubMajor id={sub_major_id} />
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
