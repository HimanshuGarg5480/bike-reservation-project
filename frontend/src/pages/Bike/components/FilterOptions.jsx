import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { setBikesFilter } from "../../../redux/feature/filter/bikeFilter";

const FilterOptions = ({ setShowFilters }) => {
  const [formData, setFormData] = useState({
    currentTime: "",
    rating: 3,
    model: "",
    color: "",
    location: "",
    fromDateTime: "",
    toDateTime: "",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const now = new Date(); // Get the current date and time
    setFormData((prev) => ({
      ...prev,
      currentTime: now.toISOString().slice(0, 16),
    })); // Set current date and time in YYYY-MM-DDTHH:MM format
  }, []);

  const addFilters = () => {
    const { model, color, location, rating, fromDateTime, toDateTime } =
      formData;
    dispatch(
      setBikesFilter({
        model,
        color,
        location,
        rating,
        fromDateTime,
        toDateTime,
      })
    );

    // setShowFilters(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className=" px-4 bg-white rounded-lg shadow-md py-4">
      <div className="flex justify-end sm:hidden">
        <span className="cursor-pointer" onClick={() => setShowFilters(false)}>
          <RxCross2 />
        </span>
      </div>

      <h2 className="text-xl font-semibold mb-4">Filter Options</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium">Model:</label>
        <input
          name="model"
          value={formData.model}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          type="text"
        />
        
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Color:</label>
        <input
          name="color"
          value={formData.color}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          type="text"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Location:</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter Location"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">From Date and Time:</label>
        <input
          type="datetime-local"
          name="fromDateTime"
          min={formData.currentTime}
          value={formData.fromDateTime}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">To Date and Time:</label>
        <input
          type="datetime-local"
          name="toDateTime"
          min={formData.currentTime}
          value={formData.toDateTime}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Rating:</label>
        <input
          type="range"
          name="rating"
          min="1"
          max="5"
          value={formData.rating}
          onChange={handleChange}
          className="mt-1 block w-full"
        />
        <div className="flex justify-between text-sm mt-2">
          <span>Min: 1</span>
          <span>Max: 5</span>
          <span>Current: {formData.rating}</span>
        </div>

        <button
          onClick={addFilters}
          type="submit"
          className="mt-4 w-full bg-blue-500 text-white rounded-md p-2"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default FilterOptions;
