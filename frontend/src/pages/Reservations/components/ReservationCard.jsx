import React, { useState } from "react";
import FiveStarReview from "../../../components/FiveStarReview";
import { FaCircle } from "react-icons/fa";
import notify from "../../../utils/notification";
import { reloadBikeList } from "../../Bike/components/BikeList";

const ReservationCard = ({ reservation, fetchReservations }) => {
  const startDate = new Date(reservation.startDate).toLocaleDateString();
  const endDate = new Date(reservation.endDate).toLocaleDateString();

  const [reservationRating, setReservationRating] = useState(0);

  const handleRateNow = async () => {
    console.log(reservationRating);
    try {
        const response = await fetch(`/api/reservations/${reservation.id}/rating`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ rating: reservationRating }),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Rating submitted:", data);
        notify("Rating submitted successfully", "success");
        fetchReservations();
    } catch (error) {
        console.error("Error submitting rating:", error);
        notify("Error submitting rating, try again later", "error");
    }
  };

  const handleCancelReservation = async () => {
    try {
      const response = await fetch(
        `/api/reservations/${reservation.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // const data = await response.json();
      console.log("Reservation canceled:");
      notify("Reservation Cancelled", "success");
      fetchReservations();
      reloadBikeList();
    } catch (error) {
      console.error("Error canceling reservation:", error);
      notify("error in cancelation, try again later", "error");
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full justify-between border border-gray-300 rounded-md p-2">
      <div className="flex justify-between">
        <div className="text-xl sm:text-2xl">{reservation.bike.model}</div>
        <div
          className={
            reservation.status == "active" ? "text-green-700" : "text-red-700"
          }
        >
          <FaCircle />
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          <FiveStarReview
            avgRating={reservation.rating}
            allowRating={reservation.rating === null ? true : false}
            onRatingSelect={setReservationRating}
          />
        </div>
        <div className="text-xs sm:text-sm">
          {startDate} to {endDate}
        </div>
      </div>
      <div className="flex justify-between text-xs sm:text-sm tracking-widest">
        {!reservation.rating && (
          <div
            className="uppercase text-blue-700 cursor-pointer"
            onClick={handleRateNow}
          >
            rate now
          </div>
        )}
        {reservation.status == "active" && (
          <div
            className="uppercase text-blue-700 cursor-pointer"
            onClick={handleCancelReservation}
          >
            cancel reservation
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationCard;
