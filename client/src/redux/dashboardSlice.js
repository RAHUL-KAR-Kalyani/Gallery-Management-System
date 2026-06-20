import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        userDashboard: null
    },
    reducers: {
        setUserDashboard: (state, action) => {
            state.userDashboard = action.payload;
        }
    }
});

export const { setUserDashboard } = dashboardSlice.actions;

export default dashboardSlice.reducer;