import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBreadCrumb } from "@/store/slice/app";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RootState } from "@/store/index";

const Profile = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user as any);
  const { name, email, phone_number, user_type } = currentUser.common_info || {};
  const { code, sub_major_id, capstone_group_id } = currentUser.extra_info?.student || currentUser.extra_info?.teacher || {};

  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Home", link: "/" },
        { title: "Profile", link: "/profile" },
      ])
    );
  }, [dispatch]);

  const userAvatarUrl = "https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/455092502_1804243283437831_8600967763519704709_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFG5zG6nQoPiTOhzwsnXcpJPkrVF6qLh_c-StUXqouH9yOlr_wUqnaZHyYhK0FuesUDw7GY0csrCDpVhxZJoN7y&_nc_ohc=vhOtOpWWBJMQ7kNvgHvYX2z&_nc_ht=scontent.fdad3-5.fna&_nc_gid=AKRDrPdnwhk5Mj_e3rAxExc&oh=00_AYAOH5YeYW_YQuyU3dd6nBWbOlbDEcr66IWIjIPyJbsuBw&oe=671EBA78";
  const adminAvatarUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT696YRs2dOx05-xrdb2K--3AO8yIkGwV11Fw&s";

  const isAdmin = user_type === "admin";
  const isTeacher = user_type === "teacher";

  return (
    <div className="flex justify-center items-center min-h-screen p-10">
      <div className="flex flex-col md:flex-row gap-10 max-w-[90%] w-full">
        <div className="w-full md:w-1/2">
          <Card className="p-12 shadow-lg rounded-lg transition-shadow duration-300 hover:shadow-xl h-full">
            <CardHeader className="flex flex-col items-center">
              <Avatar className="w-48 h-48 mb-6">
                <AvatarImage
                  src={isAdmin ? adminAvatarUrl : userAvatarUrl}
                  alt={name || "User Avatar"}
                />
                <AvatarFallback>{currentUser ? name.charAt(0) : "User"}</AvatarFallback>
              </Avatar>
              <h2 className="text-4xl font-bold tracking-tight mt-4">{name}</h2>
            </CardHeader>
          </Card>
        </div>

        <div className="w-full md:w-1/2">
          <div className="flex flex-col gap-8 h-full">
            <Card className="p-12 shadow-lg rounded-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader>
                <h3 className="text-3xl font-bold mb-6">{isAdmin ? "Đại học FPT" : "Group Capstone Project"}</h3>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-4">
                  <p className="text-xl font-semibold">{isAdmin ? "Khu vực" : "Name Group"}</p>
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
                {user_type !== "admin" || user_type !== "teacher" && (
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
                <div className="flex justify-between">
                  <p className="text-xl font-semibold">Sub Major</p>
                  <p className="text-xl">Node JS</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
