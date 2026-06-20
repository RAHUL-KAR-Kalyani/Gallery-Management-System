import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserDashboard } from "../redux/dashboardSlice";

const useUserDashboard = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_USER_ENDPOINT}/dashboard`,{ withCredentials: true });
                
                if (response.data.success) {
                    dispatch(setUserDashboard(response?.data?.stats));
                    console.log(response?.data);
                }
            } catch (error) {
                console.log(error);
                toast.error(error.response?.data?.message);
            }
        };

        fetchDashboard();
    }, []);
};

export default useUserDashboard;