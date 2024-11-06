import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BikeCard from "./BikeCard";
import PageInitiation from "../../../components/PageInitiation";

let reloadBikeList;

const BikeList = () => {
  const bikeFilter = useSelector((state) => state.bikesFilter.bikesFilterInfo);

  const [bikes, setBikes] = useState([]);

  const handlePreviousNext = async (page) => {
    console.log("handlePreviousNext", page);
    try {
      const { model, color, location, rating, fromDateTime, toDateTime } =
        bikeFilter;

      // Construct the query string based on non-falsy values
      const params = new URLSearchParams();
      if (model) params.append("model", model);
      if (color) params.append("color", color);
      if (location) params.append("location", location);
      if (rating) params.append("avgRating", rating);
      if (fromDateTime) params.append("startDate", fromDateTime);
      if (toDateTime) params.append("endDate", toDateTime);
      if (page > 1) params.append("offset", (page - 1) * 10);

      const response = await fetch(`/api/bikes/filter?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });

      const data = await response.json();
      setBikes(data.bikeArray);
    } catch (error) {
      console.error("Error fetching filtered bikes:", error);
    }
  };
  const fetchBikes = async () => {
    try {
      const { model, color, location, rating, fromDateTime, toDateTime } =
        bikeFilter;

      // Construct the query string based on non-falsy values
      const params = new URLSearchParams();
      if (model) params.append("model", model);
      if (color) params.append("color", color);
      if (location) params.append("location", location);
      if (rating) params.append("avgRating", rating);
      if (fromDateTime) params.append("startDate", fromDateTime);
      if (toDateTime) params.append("endDate", toDateTime);

      const response = await fetch(`/api/bikes/filter?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });

      const data = await response.json();
      setBikes(data.bikeArray);
    } catch (error) {
      console.error("Error fetching filtered bikes:", error);
    }
  };

 reloadBikeList = () => {
    fetchBikes();
  };

  useEffect(() => {
    fetchBikes();
  }, [bikeFilter]);

  return (
    <>
      {!bikes || !bikes.length ? (
        <>
          <div>No Bikes Found</div>
        </>
      ) : (
        <div className="w-full flex flex-col">
          {bikes?.map((bike) => (
            <BikeCard
              key={bike.id}
              bike={bike}
              reloadBikeList={reloadBikeList}
            />
          ))}
        </div>
      )}
      <div className="flex justify-center">
        <PageInitiation
          handlePreviousNext={handlePreviousNext}
          nextFlag={bikes.length}
        />
      </div>
    </>
  );
};

export default BikeList;
export {reloadBikeList}
