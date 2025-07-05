import React from "react";
import { useDispatch, useSelector } from "react-redux";
import dp1 from "../assets/dp1.jpg";
import { RiLogoutCircleLine } from "react-icons/ri";
import axios from "axios";
import { serverUrl } from "../main";
import {
  setOtherUsers,
  setSelectedUser,
  setUserData,
} from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function SideBar() {
  const { userData, otherUsers, selectedUser, onlineUsers } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`lg:w-[30%] overflow-hidden lg:block ${
        !selectedUser ? "block" : "hidden"
      } w-full h-full bg-slate-200 relative`}
    >
      {/* Top Section */}
      <div className="w-full h-[250px] bg-[#19cdff] rounded-b-[30%] shadow-md px-5 py-6 flex flex-col justify-center">
        <h1 className="text-white font-semibold text-[24px]">
          Chatlyfy Community
        </h1>
        <div className="flex justify-between items-center mt-3">
          <h1 className="text-gray-900 font-bold text-[22px]">
            Hii, {userData.name || "User"}
          </h1>
          <div
            className="w-[55px] h-[55px] rounded-full overflow-hidden cursor-pointer border-2 border-white"
            onClick={() => navigate("/profile")}
          >
            <img
              src={userData.image || dp1}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="w-full h-[calc(100vh-320px)] overflow-auto px-3 pt-4 pb-20 flex flex-col gap-4">
        {otherUsers
          ?.slice() // clone list
          .sort((a, b) => {
            const aOnline = onlineUsers?.includes(a._id) ? 1 : 0;
            const bOnline = onlineUsers?.includes(b._id) ? 1 : 0;
            return bOnline - aOnline; // online users first
          })
          .map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl shadow-sm hover:bg-[#e0f7ff] cursor-pointer transition"
              onClick={() => dispatch(setSelectedUser(user))}
            >
              <div className="w-[45px] h-[45px] rounded-full overflow-hidden relative">
                <img
                  src={user.image || dp1}
                  alt="user"
                  className="w-full h-full object-cover"
                />
                {onlineUsers?.includes(user._id) && (
                  <span className="absolute bottom-1 right-1 w-[10px] h-[10px] bg-[#3aff20] rounded-full border-2 border-white"></span>
                )}
              </div>
              <h1 className="text-gray-800 font-medium text-[16px]">
                {user.name || user.userName}
              </h1>
            </div>
          ))}
      </div>

      {/* Logout Button (fixed bottom-left) */}
      <div className="fixed bottom-4 left-4 z-50" onClick={handleLogout}>
        <div
          className="cursor-pointer w-[45px] h-[45px] bg-[#19cdff] rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition"
          title="Logout"
        >
          <RiLogoutCircleLine className="w-[22px] h-[22px]" />
        </div>
      </div>
    </div>
  );
}

export default SideBar;
