import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearUser } from "../redux/feature/user/userSlice";
import notify from "../utils/notification";

const Navbar = () => {
  const user = useSelector((state) => state.user?.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        notify("Logged out Successfully", "success");
        dispatch(clearUser());
        navigate("/login");
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      notify("Error during logout", "error");
      console.error("Error during logout:", error);
    }
  };
  return (
    <div className="bg-blue-500 flex justify-between items-center text-gray-50 px-2 sm:px-6 py-3 text-base h-full">
      <div className="flex gap-3">
        <Link to="/">
          <div className="cursor-pointer hover:text-gray-100">Bikes</div>
        </Link>
        <Link to="/reservations">
          <div className="cursor-pointer hover:text-gray-100">Reservations</div>
        </Link>
        {user?.role === "MANAGER" && (
          <Link to="/users">
            <div className="cursor-pointer hover:text-gray-100">Users</div>
          </Link>
        )}
      </div>
      <div
        className="cursor-pointer hover:text-gray-100"
        onClick={handleLogout}
      >
        logout
      </div>
    </div>
  );
};

export default Navbar;
