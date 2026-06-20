import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import imageReducer from "./ImageSlice";
import albumReducer from "./albumSlice";
import adminReducer from "./adminSlice";
import dashboardReducer from "./dashboardSlice";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        image: imageReducer,
        album: albumReducer,
        admin:adminReducer,
        dashboard:dashboardReducer
    },
    // devTools: import.meta.env.MODE == "production", // do it to hide redux store variable in production
    // devTools: import.meta.env.MODE !== "development",   // do it to hide redux store variable in development

    
})