import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserCard from "./components/UserCard";
import { FiMinus, FiPlus } from "react-icons/fi";
import { TbCheck } from "react-icons/tb";
import notify from "../../utils/notification";

const User = () => {
  const user = useSelector((state) => state.user.userInfo);

  const [userList, setUserList] = useState([]);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    manager: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateUser = async () => {
    try {
      if (!formData.name || !formData.email || !formData.password) {
        notify("all the feilds are required", "error");
        throw new Error("all the feilds are required");
      }

      let response;
      const { name: username, email, password } = formData;
      if (formData.manager) {
        response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password, role: "MANAGER" }),
        });
      } else {
        response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        });
      }

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("user created successfully:", data);
      notify("user created successfuly", "success");
      setShowCreateUser(false);
    } catch (error) {
      console.error("Error creating user:", error);
      notify(error, "error");
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });

      const data = await response.json();
      console.log(data);

      setUserList(data);
    } catch (error) {
      console.error("Error fetching bike reservations:", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [showCreateUser]);

  if (user.role != "MANAGER") {
    return <div>page not found</div>;
  }
  return (
    <>
      <div className="h-full overflow-y-auto flex flex-col items-center gap-2 pt-10 px-[10%] sm:px-[20%]">
        {showCreateUser && (
          <div className="mb-2 broder shadow-md rounded-md p-2">
            <div>
              <label
                htmlFor="name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Name
              </label>
              <div className="rounded-md shadow-sm">
                <input
                  id="name"
                  name="name"
                  type="text"
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-0 py-1.5 pl-2 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email
              </label>
              <div className="rounded-md shadow-sm">
                <input
                  id="email"
                  name="email"
                  type="text"
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-0 py-1.5 pl-2 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
              <div className="rounded-md shadow-sm">
                <input
                  id="password"
                  name="password"
                  type="text"
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-0 py-1.5 pl-2 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <input
                className="-mb-5"
                id="manager"
                name="manager"
                type="checkbox"
                onChange={handleInputChange}
              />
              <label
                htmlFor="manager"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Manager
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <div
                className="text-green-500 text-xl cursor-pointer"
                onClick={handleCreateUser}
              >
                <TbCheck />
              </div>
            </div>
          </div>
        )}
        {userList.map((user) => {
          return (
            <UserCard
              key={user?.id}
              userId={user?.id}
              username={user?.username}
              email={user?.email}
              manager={user?.role==="MANAGER"}
              role={user?.role}
              reloadUserList={fetchUsers}
            />
          );
        })}

        <div
          className="fixed bottom-3 right-3 p-3 text-blue-700 bg-slate-100 hover:bg-stone-300 rounded-md text-2xl"
          onClick={() => {
            setShowCreateUser(!showCreateUser);
          }}
        >
          {showCreateUser ? <FiMinus /> : <FiPlus />}
        </div>
      </div>
    </>
  );
};

export default User;
