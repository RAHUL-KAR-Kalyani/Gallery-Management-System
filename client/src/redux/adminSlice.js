import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        adminDashboard: null
    },
    reducers: {
        setAdminDashboard: (state, action) => {
            state.adminDashboard = action.payload;
        }
    }
});

export const { setAdminDashboard } = adminSlice.actions;
export default adminSlice.reducer;