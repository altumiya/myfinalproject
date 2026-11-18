import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserCheck, FaShoppingBag } from 'react-icons/fa';
import axios from 'axios';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalOrders: 0
    });

    const apiBaseUrl = import.meta.env.VITE_APIBASEURL 
        ? import.meta.env.VITE_APIBASEURL.replace(/\/$/, '') 
        : 'http://localhost:8000/api/admin';

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const cleanApiUrl = apiBaseUrl.replace('/admin', ''); 
                const usersRes = await axios.get(`${cleanApiUrl}/web/auth/view`);
                
                let usersCount = 0;
                let activeCount = 0;
                
                if (usersRes.data.status) {
                    const users = usersRes.data.users || [];
                    usersCount = users.length;
                    activeCount = users.filter(u => (u.status || 'Active') === 'Active').length;
                }

                let ordersCount = 0;
                try {
                    const ordersRes = await axios.get(`${apiBaseUrl}/order/view`);
                    if (ordersRes.data.status) {
                        ordersCount = (ordersRes.data.orders || ordersRes.data.data || []).length;
                    }
                } catch (orderErr) {
                    console.warn("Order route might not be ready yet.", orderErr.message);
                }

                setStats({
                    totalUsers: usersCount,
                    activeUsers: activeCount,
                    totalOrders: ordersCount
                });

            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                <p className="mt-1 text-sm text-gray-500">Quick overview of your admin data.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Total Users Card */}
                <div className="flex items-center rounded-lg bg-white p-5 shadow-sm border border-gray-100">
                    <div className="rounded-full bg-blue-100 p-3 text-blue-600 mr-4">
                        <FaUsers size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Users</p>
                        <p className="mt-1 text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                    </div>
                </div>
                
                {/* Active Users Card */}
                <div className="flex items-center rounded-lg bg-white p-5 shadow-sm border border-gray-100">
                    <div className="rounded-full bg-green-100 p-3 text-green-600 mr-4">
                        <FaUserCheck size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Active Users</p>
                        <p className="mt-1 text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                    </div>
                </div>

                {/* Total Orders Card */}
                <div className="flex items-center rounded-lg bg-white p-5 shadow-sm border border-gray-100">
                    <div className="rounded-full bg-amber-100 p-3 text-amber-600 mr-4">
                        <FaShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Orders</p>
                        <p className="mt-1 text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}