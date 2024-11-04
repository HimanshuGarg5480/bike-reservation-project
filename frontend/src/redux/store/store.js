import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../feature/user/userSlice";
import bikesFilterSlice from "../feature/filter/bikeFilter";

const store = configureStore({
  reducer: {
    user:userSlice,
    bikesFilter:bikesFilterSlice
  },
});

export default store;
