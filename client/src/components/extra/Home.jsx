import React from 'react'
import { useSelector } from 'react-redux';
import Dashboard from '../../pages/Dashboard';
import AdminDashboard from '../../pages/AdminDashboard';

const Home = () => {
    const { user } = useSelector((store) => store.auth);

    const role = user?.role?.toLowerCase();
    return (
        <div>
            {role === 'user' ? <Dashboard /> : <AdminDashboard />}

        </div>
    )
}

export default Home