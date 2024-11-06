import React from "react";
import {useNavigate} from "react-router-dom"
import { MdDelete, MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import FiveStarReview from "../../../components/FiveStarReview";
import notify from "../../../utils/notification";

const BikeCard = ({ bike, reloadBikeList}) => {
  const user = useSelector((state) => state.user.userInfo);
  const bikeFilter = useSelector((state)=>state.bikesFilter.bikesFilterInfo);

  const navigate = useNavigate();

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
      navigate('/')
      notify("bike booked successfully", "success");
      reloadBikeList();
    } catch (error) {
      console.error("Error booking bike:", error);
      notify("something went wrong, try booking bike later", "error");
    }
  };

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
          <input type="checkbox" defaultChecked={bike?.isAvailable} />
        </div>
        <div>{bike?.location}</div>
      </div>
      {(Boolean(bikeFilter?.toDateTime) & Boolean(bikeFilter?.fromDateTime)) ? (
        <div className="text-blue-700 cursor-pointer" onClick={handleBookNow}>
          Book now
        </div>
      ) : (
        ""
      )}
      {user.role == "MANAGER" && (
        <div className="flex justify-between">
          <div className="text-blue-600">Reservations</div>
          <div className="flex gap-5">
            <div className="text-blue-600">
              <MdEdit />
            </div>
            <div className="text-red-500">
              <MdDelete />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BikeCard;
