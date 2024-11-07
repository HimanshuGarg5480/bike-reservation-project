import { Bike } from "../bike.entity";

export type FilterBikesParm = {
  allowBooking: boolean;
   bikeArray: Bike[]
};
