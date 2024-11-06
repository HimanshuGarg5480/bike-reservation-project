import React, { useEffect, useState } from "react";
import ReservationCard from "./components/ReservationCard";
import { useSelector } from "react-redux";

const Reservations = () => {
  const [reservationList, setReservationList] = useState([]);

  const user = useSelector((state) => state.user.userInfo);

  const fetchReservations = async () => {
    try {
      const response = await fetch(`/api/reservations/user/${user.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });

      const data = await response.json();
      console.log(data);
      setReservationList(data);
    } catch (error) {
      console.error("Error fetching filtered bikes:", error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);
  return (
    <div className="h-full overflow-y-auto flex flex-col items-center gap-2 pt-10 px-[10%] sm:px-[20%]">
      {!reservationList.length ? (
        <div>no reservations yet</div>
      ) : (
        reservationList.map((reservation) => {
          return <ReservationCard key={reservation.id} reservation={reservation} fetchReservations={fetchReservations}/>;
        })
      )}
    </div>
  );
};

export default Reservations;
