import React, { useState, useEffect } from 'react';
import { FaPowerOff, FaTrash, FaFilter, FaSearch, FaTimes } from 'react-icons/fa';
import axios from 'axios';

export default function User() {
    const [users, setUsers] = useState([]);
    const [ids, setIds] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Define your API base URL
    const apiBaseUrl = import.meta.env.VITE_APIBASEURL 
        ? import.meta.env.VITE_APIBASEURL.replace(/\/$/, '') 
        : 'http://localhost:8000/api'; // Update the fallback to match your environment

    // Fetch users from the backend
    const getUsers = () => {
        const cleanApiUrl = apiBaseUrl.replace('/admin', '');
        axios.get(`${cleanApiUrl}/web/auth/view`) // Make sure this matches your actual Express route
            .then((res) => {
                if (res.data.status) {
                    setUsers(res.data.users || []);
                }
            })
            .catch((error) => console.error("Error fetching users:", error));
    };

    useEffect(() => {
        getUsers();
    }, []);

    // Filter Logic
    const filteredUsers = users.filter((user) => {
        const searchStr = searchTerm.toLowerCase();
        const userName = user.name || '';
        const userEmail = user.email || '';
        const userId = String(user._id || '');

        return (
            userName.toLowerCase().includes(searchStr) ||
            userEmail.toLowerCase().includes(searchStr) ||
            userId.toLowerCase().includes(searchStr)
        );
    });

    // Handle individual checkbox selection (using MongoDB _id as String)
    const getCheckedValue = (e) => {
        const checkValue = e.target.value;
        if (e.target.checked) {
            setIds([...ids, checkValue]);
        } else {
            setIds(ids.filter((v) => v !== checkValue));
        }
    };

    // Handle 'Select All' checkbox
    const allSelect = (e) => {
        if (e.target.checked) {
            setIds(filteredUsers.map((obj) => obj._id));
        } else {
            setIds([]);
        }
    };

    return (
        <div className="rounded-lg bg-white p-6 shadow-sm">
            {/* Header Section */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">User</h2>
                </div>
                
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-md bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800 shadow-sm hover:bg-amber-200 transition-colors"
                    >
                        <FaPowerOff /> Change Status
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-200 transition-colors"
                    >
                        <FaTrash /> Delete
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => setShowSearch(!showSearch)}
                        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <FaFilter /> Filter
                    </button>

                </div>
            </div>

            {/* Search Bar */}
            {showSearch && (
                <div className="mb-6 flex max-w-md items-center overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                    <input
                        type="text"
                        placeholder="Search by ID, Name or Email..."
                        autoFocus
                        className="w-full border-none px-4 py-2 text-sm focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        type="button"
                        className="flex items-center justify-center border-l border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        title="Search"
                    >
                        <FaSearch />
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setShowSearch(false);
                            setSearchTerm('');
                        }}
                        className="flex items-center justify-center border-l border-gray-300 bg-gray-50 px-4 py-2.5 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                        title="Close Search"
                    >
                        <FaTimes />
                    </button>
                </div>
            )}

            {/* Table Section */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-50 uppercase text-gray-500">
                        <tr>
                            {/* Select All Checkbox */}
                            <th scope="col" className="px-6 py-4">
                                <input
                                    type="checkbox"
                                    onChange={allSelect}
                                    checked={ids.length === filteredUsers.length && filteredUsers.length > 0}
                                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </th>
                            <th scope="col" className="px-6 py-4">ID</th>
                            <th scope="col" className="px-6 py-4">Name</th>
                            <th scope="col" className="px-6 py-4">Email</th>
                            <th scope="col" className="px-6 py-4">Phone</th>
                            <th scope="col" className="px-6 py-4">Role</th>
                            <th scope="col" className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        value={user._id}
                                        onChange={getCheckedValue}
                                        checked={ids.includes(user._id)}
                                        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </td>
                                <td className="px-6 py-4 font-mono text-gray-600">
                                    {/* Displaying last 6 chars of MongoDB ID for cleaner UI */}
                                    #{String(user._id).slice(-6).toUpperCase()}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                <td className="px-6 py-4 text-gray-600">{user.phone || 'N/A'}</td>
                                <td className="px-6 py-4">
                                    <span className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                                        {user.role || 'User'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`rounded px-2 py-1 text-xs font-semibold ${
                                        (user.status || 'Active') === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {user.status || 'Active'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}