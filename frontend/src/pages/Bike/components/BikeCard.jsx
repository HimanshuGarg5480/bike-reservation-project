import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import FiveStarReview from "../../../components/FiveStarReview";
import notify from "../../../utils/notification";
import { RxCross2 } from "react-icons/rx";
import { TbCheck } from "react-icons/tb";

const BikeCard = ({ bike, reloadBikeList }) => {
  const user = useSelector((state) => state.user.userInfo);
  const bikeFilter = useSelector((state) => state.bikesFilter.bikesFilterInfo);

  const [editable, setEditable] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    model: bike?.model,
    color: bike?.color,
    location: bike?.location,
    isAvailable: bike?.isAvailable,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBookNow = async () => {
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bikeId: bike.id,
          userId: user.id,
          fromDateTime: bikeFilter.fromDateTime,
          toDateTime: bikeFilter.toDateTime,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Booking successful:", data);
      navigate("/");
      notify("bike booked successfully", "success");
      reloadBikeList();
    } catch (error) {
      console.error("Error booking bike:", error);
      notify("something went wrong, try booking bike later", "error");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/bikes/${bike.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      notify("Bike deleted successfully", "success");
      reloadBikeList(); // Refresh the bike list after deletion
    } catch (error) {
      console.error("Error deleting bike:", error);
      notify("Something went wrong, try deleting the bike later", "error");
    }
  };

  const handleEdit = async () => {
    try {
      const response = await fetch(`/api/bikes/${bike.id}`, {
        method: "PATCH", // Use PATCH to update the bike details
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send the updated form data
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Bike updated successfully:", data);
      notify("Bike updated successfully", "success");
      setEditable(false); // Exit edit mode after successful update
      reloadBikeList(); // Refresh the bike list after updating
    } catch (error) {
      console.error("Error updating bike:", error);
      notify("Something went wrong, try updating the bike later", "error");
    }
  };

  const handleIsAvailable = async () => {
    try {
      const response = await fetch(`/api/bikes/${bike.id}`, {
        method: "PATCH", // Use PATCH to update the availability
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isAvailable: !bike.isAvailable, // Toggle the availability status
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Availability updated:", data);
      notify("Bike availability updated successfully", "success");
      reloadBikeList(); // Refresh the bike list after updating availability
    } catch (error) {
      console.error("Error updating bike availability:", error);
      notify("Something went wrong, try updating availability later", "error");
    }
  };

  const handleReservations = (id) => {
    navigate(`/reservations?bikeId=${id}`);
  };

  if (editable) {
    return (
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
              value={formData.model}
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
              value={formData.color}
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
              value={formData.location}
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
            checked={formData.isAvailable}
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
    <div className="mb-2 broder shadow-md rounded-md p-2">
      <div className="text-center text-lg font-medium text-gray-700 mb-1">
        {bike?.model}
      </div>
      <div className="flex justify-between mb-3">
        <div>
          <FiveStarReview avgRating={bike?.avgRating} allowRating={false} />
        </div>
        <div>{bike?.color}</div>
      </div>
      <div className="flex justify-between mb-1">
        <div className="flex items-baseline gap-1">
          <div>Available</div>
          <input
            type="checkbox"
            defaultChecked={bike?.isAvailable}
            disabled={user.role != "MANAGER"}
            onClick={handleIsAvailable}
          />
        </div>
        <div>{bike?.location}</div>
      </div>
      {Boolean(bikeFilter?.toDateTime) & Boolean(bikeFilter?.fromDateTime) ? (
        <div className="text-blue-700 cursor-pointer" onClick={handleBookNow}>
          Book now
        </div>
      ) : (
        ""
      )}
      {user.role == "MANAGER" && (
        <div className="flex justify-between">
          <div
            className="text-blue-600 cursor-pointer"
            onClick={() => {
              handleReservations(bike.id);
            }}
          >
            Reservations
          </div>
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
      )}
    </div>
  );
};

export default BikeCard;
