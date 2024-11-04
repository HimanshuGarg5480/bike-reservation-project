import React, { useState } from "react";

import { MdDelete, MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import FiveStarReview from "../../../components/FiveStarReview";

const BikeCard = ({ bike }) => {
  const user = useSelector((state) => state.user.userInfo);

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
      {(bike?.fromDateTime & bike?.toDateTime) ?(
        <div className="text-blue-700 cursor-pointer">Book now</div>
      ):""}
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
