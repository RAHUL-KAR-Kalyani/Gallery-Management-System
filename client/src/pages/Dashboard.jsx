import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import useUserDashboard from "../hooks/useUserDashboard";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const Dashboard = () => {
    useUserDashboard();
    
    useEffect(() => {
        document.title = "Dashboard";
    }, []);

    const { user } = useSelector((store) => store.auth);
    const { userDashboard } = useSelector(store => store.dashboard);

    const totalAlbums = userDashboard?.totalAlbums;
    const totalImages = userDashboard?.totalImages;

    const chartData = {
        labels: ["Albums", "Images"],
        datasets: [
            {
                data: [totalAlbums, totalImages],
                backgroundColor: ["#3B82F6", "#8B5CF6"],
                borderWidth: 0
            }
        ]
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">
                Dashboard
            </h1>

            <p className="text-gray-500 mb-6">
                Welcome back, {user?.name}
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div className="rounded-2xl bg-linear-to-r from-blue-500 to-blue-600 text-white p-6 shadow-lg">
                    <h3 className="text-sm opacity-80">
                        Total Albums
                    </h3>

                    <p className="text-4xl font-bold mt-2">
                        {totalAlbums}
                    </p>
                </div>

                <div className="rounded-2xl bg-linear-to-r from-purple-500 to-pink-500 text-white p-6 shadow-lg">
                    <h3 className="text-sm opacity-80">
                        Total Images
                    </h3>

                    <p className="text-4xl font-bold mt-2">
                        {totalImages}
                    </p>
                </div>

            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl shadow-lg mt-8 p-6 max-w-md">
                <h1 className="font-semibold mb-6 text-xl">Content Overview</h1>

                <Doughnut data={chartData} />
            </div>
        </div>
    );
};

export default Dashboard;