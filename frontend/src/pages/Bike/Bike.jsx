import React, { useState } from "react";
import FilterOptions from "./components/FilterOptions";
import BikeList from "./components/BikeList";
import PageInitiation from "../../components/PageInitiation";

const Bike = () => {
  const [showFilters,setShowFilters]=useState(false);
  return (
    <div className="mt-2 px-10">
      <button className="sm:hidden rounded-md bg-blue-600 hover:bg-blue-500 cursor-pointer text-gray-100 p-4 font-medium" onClick={()=>setShowFilters(true)}>
        Add Filters
      </button>
     {showFilters && <div className="absolute top-0 left-0">
        <FilterOptions setShowFilters={setShowFilters}/>
      </div>}
      <div className="flex gap-28 justify-center mx-auto w-full">
        <div className="hidden sm:block sm:w-[30%]">
          <FilterOptions />
        </div>
        <div className="w-full py-4 sm:p-4">
        <BikeList />
        
        </div>
      </div>

    </div>
  );
};

export default Bike;
