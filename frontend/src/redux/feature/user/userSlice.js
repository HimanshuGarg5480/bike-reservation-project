import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: null,
    },
    reducers: {
        setUser: (state, action) => {
            const { id, email, role, username }= action.payload;
            state.userInfo = { id, email, role, username };
        },
        clearUser: (state) => {
            state.userInfo = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

