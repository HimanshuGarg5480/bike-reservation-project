import React, { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import notify from "../../../utils/notification";
import { TbCheck } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";

const UserCard = ({
  userId,
  username,
  email,
  role,
  reloadUserList,
}) => {
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({
    name: username,
    email: email,
    password: "",
    manager: role == "MANAGER",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        notify("Something went wrong, try deleting the user later", "error");
        throw new Error("Network response was not ok");
      }
      notify("user deleted successfully", "success");
      reloadUserList(); // Refresh the bike list after deletion
    } catch (error) {
      console.error("Error deleting bike:", error);
      notify("Something went wrong, try deleting the user later", "error");
    }
  };

  const handleEdit = async () => {
    try {
      let payload = {};
      if (formData.name) {
        payload.username = formData.name;
      }
      if (formData.email) {
        payload.email = formData.email;
      }
      if (formData.password) {
        payload.password = formData.password;
      }
      if (formData.manager) {
        payload.role = "MANAGER";
      } else {
        payload.role = "REGULAR";
      }
      console.log(payload);
      const response = await fetch(`/api/user/${userId}/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("user updated successfully:", data);
      notify("user updated successfully", "success");
      setEditable(false);
      reloadUserList();
    } catch (error) {
      console.error("Error updating user:", error);
      notify("Something went wrong, try updating the user later", "error");
    }
  };

  if (editable) {
    return (
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
              value={formData.name}
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
              value={formData.email}
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
              value={formData.password}
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
            checked={formData.manager}
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
            className="text-red-500 text-xl cursor-pointer"
            onClick={() => {
              setEditable(false);
            }}
          >
            <RxCross2 />
          </div>
          <div
            className="text-green-500 text-xl cursor-pointer"
            onClick={handleEdit}
          >
            <TbCheck />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full justify-between border border-gray-300 rounded-md p-2">
      <div className="flex justify-between">
        <div className="text-xl sm:text-2xl">{username}</div>
        <div className={"text-gray-700"}>{email}</div>
      </div>
      <div>{role}</div>
      <div className="flex items-center gap-2">
      </div>
      <div className="flex justify-end">
        <div className="flex gap-5">
          <div
            className="text-blue-600 cursor-pointer"
            onClick={() => {
              setEditable(true);
            }}
          >
            <MdEdit />
          </div>
          <div className="text-red-500 cursor-pointer" onClick={handleDelete}>
            <MdDelete />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
