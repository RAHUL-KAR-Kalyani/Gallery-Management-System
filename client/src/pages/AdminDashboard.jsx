import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import useAdminDashboard from "../hooks/useAdminDashboard";
import { Doughnut, Bar } from "react-chartjs-2";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
} from "chart.js";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
);

const AdminDashboard = () => {
    useAdminDashboard();

    useEffect(() => {
        document.title = "Admin Dashboard";
    }, []);

    const { user } = useSelector((store) => store.auth);
    const { adminDashboard } = useSelector((store) => store.admin);

    const totalUsers = adminDashboard?.totalUsers;
    const totalAlbums = adminDashboard?.totalAlbums;
    const totalImages = adminDashboard?.totalImages;

    const imageCountPerUser = adminDashboard?.imageCountPerUser ?? [];
    // console.log('imageCountPerUser:', imageCountPerUser);

    // Doughnut Chart
    const doughnutData = {
        labels: ["Users", "Albums", "Images"],
        datasets: [
            {
                data: [
                    totalUsers,
                    totalAlbums,
                    totalImages
                ],
                backgroundColor: [
                    "#3B82F6",
                    "#8B5CF6",
                    "#10B981"
                ],
                hoverBackgroundColor: [
                    "#2563EB",
                    "#7C3AED",
                    "#059669"
                ],
                borderWidth: 0
            }
        ]
    };

    const doughnutOptions = {
        cutout: "70%",
        plugins: {
            legend: { position: "bottom" }
        }
    };

    // Bar Chart
    const barChartData = {
        labels: imageCountPerUser.map(
            (item) => item.name
        ),
        datasets: [
            {
                label: "Images Uploaded",
                data: imageCountPerUser.map(
                    (item) => item.imageCount
                ),
                backgroundColor: "#3B82F6",
                borderRadius: 8
            }
        ]
    };

    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Admin Dashboard
                </h1>

                <p className="text-gray-500 mt-1">
                    Welcome back, {user?.name}
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
                    <p className="text-sm opacity-80">
                        Total Users
                    </p>

                    <h2 className="text-4xl font-bold mt-3">
                        {totalUsers}
                    </h2>
                </div>

                <div className="bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6 shadow-lg">
                    <p className="text-sm opacity-80">
                        Total Albums
                    </p>

                    <h2 className="text-4xl font-bold mt-3">
                        {totalAlbums}
                    </h2>
                </div>

                <div className="bg-linear-to-r from-emerald-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
                    <p className="text-sm opacity-80">
                        Total Images
                    </p>

                    <h2 className="text-4xl font-bold mt-3">
                        {totalImages}
                    </h2>
                </div>

            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

                {/* Doughnut Chart */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-5">
                        Platform Overview
                    </h2>

                    <div className="max-w-sm mx-auto">
                        <Doughnut data={doughnutData} options={doughnutOptions} />
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-5">
                        Images Uploaded Per User
                    </h2>

                    <Bar data={barChartData} options={barChartOptions} />
                </div>

            </div>

        </div>
    );
};

export default AdminDashboard;