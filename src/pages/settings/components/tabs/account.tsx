<<<<<<< Updated upstream
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RootState } from "@/store/index";
import { FaUser } from "react-icons/fa";
import SubMajor from "@/components/common/major";
=======
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RootState } from "@/store/index";
import SubMajor from "@/components/common/major";


>>>>>>> Stashed changes
const Account: React.FC = () => {

  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user as any);
  const { name, email, phone_number, user_type } = currentUser.common_info || {};
  const { code, sub_major_id, capstone_group_id } = currentUser.extra_info?.student || currentUser.extra_info?.teacher || {};

<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
  const isAdmin = user_type === "admin";
  const isTeacher = user_type === "teacher";

  return (
    <div>
      <div className=" text-xl ">Personal Information</div>
      <div className=" text-slate-500 mt-2 ">
        Access and manage your personal information, including personal details, preferences, and settings.
      </div>
      <div className=" my-4 border dark:border-foreground " />
      <div className="flex justify-center items-center min-h-screen p-10">
        <div className="flex flex-col md:flex-row gap-10 max-w-[90%] w-full">
          <div className="w-full md:w-1/2">
            <Card className="p-12 shadow-lg rounded-lg transition-shadow duration-300 hover:shadow-xl h-full">
              <CardHeader className="flex flex-col items-center">
                <Avatar className="w-48 h-48 mb-6">
<<<<<<< Updated upstream
                  <AvatarFallback><FaUser></FaUser></AvatarFallback>
=======
                  <AvatarFallback>{currentUser ? name.charAt(0) : "User"}</AvatarFallback>
>>>>>>> Stashed changes
                </Avatar>
                <h2 className="text-4xl font-bold tracking-tight mt-4">{name}</h2>
              </CardHeader>
            </Card>
          </div>

          <div className="w-full md:w-1/2">
            <div className="flex flex-col gap-8 h-full">
              <Card className="p-12 shadow-lg rounded-lg transition-shadow duration-300 hover:shadow-xl">
                <CardHeader>
                  <h3 className="text-3xl font-bold mb-6">{isAdmin ? "FPT University" : "Group Capstone Project"}</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-4">
                    <p className="text-xl font-semibold">{isAdmin ? "Campus" : "Name Group"}</p>
                    <p className="text-xl">{isAdmin ? "Đà Nẵng" : "Đom Đóm"}</p>
                  </div>
                  {(isTeacher || isAdmin) ? null : (
                    <div className="flex justify-between mb-4">
                      <p className="text-xl font-semibold">Mentor</p>
                      <p className="text-xl">Trần Văn Hoàng</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="p-12 shadow-lg rounded-lg transition-shadow duration-300 hover:shadow-xl">
                <CardHeader>
                  <h3 className="text-3xl font-bold mb-6">Information</h3>
                </CardHeader>
                <CardContent>
                  {user_type !== "admin" && user_type !== "teacher" && (
                    <div className="flex justify-between mb-4">
                      <p className="text-xl font-semibold">Student ID</p>
                      <p className="text-xl">{code}</p>
                    </div>
                  )}
                  <div className="flex justify-between mb-4">
                    <p className="text-xl font-semibold">Role</p>
                    <p className="text-xl">{user_type.charAt(0).toUpperCase() + user_type.slice(1)}</p>
                  </div>
                  <div className="flex justify-between mb-4">
                    <p className="text-xl font-semibold">Email</p>
                    <p className="text-xl">{email}</p>
                  </div>
                  <div className="flex justify-between mb-4">
                    <p className="text-xl font-semibold">Phone Number</p>
                    <p className="text-xl">{phone_number}</p>
                  </div>
                  {user_type !== "admin" && (
                    <div className="flex justify-between mb-4">
                      <p className="text-xl font-semibold">Sub Major</p>
<<<<<<< Updated upstream
                      <p className="text-xl"><SubMajor id={sub_major_id}></SubMajor></p>
=======
                      <p className="text-xl"><SubMajor id={sub_major_id} /></p>
>>>>>>> Stashed changes
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      );
    </div>
  );
};

export default Account;
