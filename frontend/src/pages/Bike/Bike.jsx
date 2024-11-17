import React, { useState } from "react";
import FilterOptions from "./components/FilterOptions";
import BikeList, { reloadBikeList } from "./components/BikeList";

import { FiMinus, FiPlus } from "react-icons/fi";
import { TbCheck } from "react-icons/tb";
import notify from "../../utils/notification";

const Bike = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateBike, setShowCreateBike] = useState(false);

  const [formData, setFormData] = useState({
    model: "",
    color: "",
    location: "",
    isAvailable: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateBike = async () => {
    try {
      const formattedData = {
        model: formData.model.trim().toLowerCase(),
        color: formData.color.trim().toLowerCase(),
        location: formData.location.trim().toLowerCase(),
        isAvailable: formData.isAvailable,
      };

      if (!formattedData.model || !formattedData.color || !formattedData.location) {
        notify("all the fields are required", "error");
        throw new Error("all the fields are required");
      }
      const response = await fetch("/api/bikes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Bike created successfully:", data);
      notify("bike created successfuly", "success");
      reloadBikeList();
      setShowCreateBike(false);
    } catch (error) {
      console.error("Error creating bike:", error);
      notify(error, "error");
    }
  };

  return (
    <div className="mt-2 px-10">
      <button
        className="sm:hidden rounded-md bg-blue-600 hover:bg-blue-500 cursor-pointer text-gray-100 p-4 font-medium"
        onClick={() => setShowFilters(true)}
      >
        Add Filters
      </button>
      {showFilters && (
        <div className="absolute block sm:hidden top-0 left-0">
          <FilterOptions setShowFilters={setShowFilters} />
        </div>
      )}
      <div className="flex gap-28 justify-center mx-auto w-full">
        <div className="hidden sm:block sm:w-[30%]">
          <FilterOptions />
        </div>
        <div className="w-full py-4 sm:p-4">
          {showCreateBike && (
            <div className="mb-2 broder shadow-md rounded-md p-2">
              <div>
                <label
                  htmlFor="model"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Model
                </label>
                <div className="rounded-md shadow-sm">
                  <input
                    id="model"
                    name="model"
                    type="text"
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="color"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Color
                </label>
                <div className="rounded-md shadow-sm">
                  <input
                    id="color"
                    name="color"
                    type="text"
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Location
                </label>
                <div className="rounded-md shadow-sm">
                  <input
                    id="location"
                    name="location"
                    type="text"
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <input
                  className="-mb-5"
                  id="availability"
                  name="isAvailable"
                  type="checkbox"
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="availability"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Availability
                </label>
              </div>

              <div className="flex justify-end gap-2">
                <div
                  className="text-green-500 text-xl cursor-pointer"
                  onClick={handleCreateBike}
                >
                  <TbCheck />
                </div>
              </div>
            </div>
          )}
          <BikeList />
        </div>
      </div>
      <div
        className="fixed bottom-3 right-3 p-3 text-blue-700 bg-slate-100 hover:bg-stone-300 rounded-md text-2xl"
        onClick={() => {
          setShowCreateBike(!showCreateBike);
        }}
      >
        {showCreateBike ? <FiMinus /> : <FiPlus />}
      </div>
    </div>
  );
};

export default Bike;
