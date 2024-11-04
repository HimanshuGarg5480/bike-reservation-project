import { createSlice } from '@reduxjs/toolkit';

const bikesFilterSlice = createSlice({
    name: 'bikesFilter',
    initialState: {
        bikesFilterInfo: {},
    },
    reducers: {
        setBikesFilter: (state, action) => {
            state.bikesFilterInfo = action.payload;
        },
        clearBikesFilter: (state) => {
            state.bikesFilterInfo = null;
        },
    },
});

export const { setBikesFilter, clearBikesFilter } = bikesFilterSlice.actions;
export default bikesFilterSlice.reducer;

