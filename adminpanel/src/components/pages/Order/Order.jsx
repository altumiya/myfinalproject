import React, { useState, useEffect } from 'react';
import { FaEye, FaTimes, FaFilter, FaPowerOff, FaTrash, FaSearch } from 'react-icons/fa';
import axios from 'axios';

export default function Order() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [ids, setIds] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const apiBaseUrl = import.meta.env.VITE_APIBASEURL 
        ? import.meta.env.VITE_APIBASEURL.replace(/\/$/, '') 
        : 'http://localhost:8000/api/admin';

    // Fetch Orders from Backend
    const getOrders = () => {
        axios.get(`${apiBaseUrl}/order/view`)
            .then((res) => {
                if (res.data.status) {
                    setOrders(res.data.orders || res.data.data || []);
                }
            })
            .catch((error) => console.error("Error fetching orders:", error));
    };

    useEffect(() => {
        getOrders();
    }, []);

    // Update Single Order Status
    const handleStatusChange = (orderId, newStatus) => {
        // Assuming you have an admin route to update status
        axios.post(`${apiBaseUrl}/order/update-status`, { orderId, status: newStatus })
            .then((res) => {
                if (res.data.status) {
                    // Update local state immediately without full refetch
                    setOrders(orders.map(order => 
                        order._id === orderId ? { ...order, status: newStatus } : order
                    ));
                }
            })
            .catch((error) => console.error("Error updating status:", error));
    };

    // Filter Logic (Frontend Search)
    const filteredOrders = orders.filter((order) => {
        const searchStr = searchTerm.toLowerCase();
        const buyerName = order.userId?.name || order.buyerName || '';
        return (
            buyerName.toLowerCase().includes(searchStr) ||
            String(order._id).toLowerCase().includes(searchStr)
        );
    });

    // Checkbox Selection Logic
    const getCheckedValue = (e) => {
        const checkValue = e.target.value;
        if (e.target.checked) {
            setIds([...ids, checkValue]);
        } else {
            setIds(ids.filter((v) => v !== checkValue));
        }
    };

    const allSelect = (e) => {
        if (e.target.checked) {
            setIds(filteredOrders.map((obj) => String(obj._id)));
        } else {
            setIds([]);
        }
    };

    // Bulk Action Logic
    const multiDelete = () => {
        if (ids.length >= 1) {
            axios.post(`${apiBaseUrl}/order/multiDelete`, { ids })
                .then((res) => {
                    if (res.data.status) {
                        getOrders();
                        setIds([]);
                    }
                })
                .catch(err => console.error("Error deleting:", err));
        }
    };

    const changeStatus = () => {
        if (ids.length >= 1) {
            axios.post(`${apiBaseUrl}/order/changeStatus`, { ids })
                .then((res) => {
                    if (res.data.status) {
                        getOrders();
                        setIds([]);
                    }
                })
                .catch(err => console.error("Error changing status:", err));
        }
    };

    // Helper for Status Colors
    const getStatusColor = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'delivered' || s === 'success') return 'bg-green-100 text-green-800 border-green-200';
        if (s === 'cancelled' || s === 'failed') return 'bg-red-100 text-red-800 border-red-200';
        if (s === 'processing') return 'bg-blue-100 text-blue-800 border-blue-200';
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'; // pending
    };

    return (
        <div className="rounded-lg bg-white p-6 shadow-sm">
            {/* Header Section */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={changeStatus}
                        className="inline-flex items-center gap-2 rounded-md bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800 shadow-sm hover:bg-amber-200 transition-colors"
                    >
                        <FaPowerOff />
                        Change Status
                    </button>
                    <button
                        type="button"
                        onClick={multiDelete}
                        className="inline-flex items-center gap-2 rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-200 transition-colors"
                    >
                        <FaTrash />
                        Delete
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowSearch(!showSearch)}
                        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <FaFilter />
                        Filter
                    </button>
                </div>
            </div>

            {/* Search Bar UI */}
            {showSearch && (
                <div className="mb-6 flex max-w-md items-center overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                    <input
                        type="text"
                        placeholder="Search by ID or Buyer Name..."
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
                            <th scope="col" className="px-6 py-4">
                                <input
                                    type="checkbox"
                                    onChange={allSelect}
                                    checked={ids.length === filteredOrders.length && filteredOrders.length > 0}
                                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </th>
                            <th scope="col" className="px-6 py-4">Sr.No</th>
                            <th scope="col" className="px-6 py-4">Order ID</th>
                            <th scope="col" className="px-6 py-4">Buyer Name</th>
                            <th scope="col" className="px-6 py-4">Price</th>
                            <th scope="col" className="px-6 py-4">Order Status</th>
                            <th scope="col" className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order, index) => (
                            <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        value={order._id}
                                        onChange={getCheckedValue}
                                        checked={ids.includes(String(order._id))}
                                        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </td>
                                <td className="px-6 py-4 font-medium">{index + 1}</td>
                                <td className="px-6 py-4 font-mono text-gray-700">
                                    #{order._id.slice(-6).toUpperCase()}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {order.userId?.name || order.buyerName || 'Guest'}
                                </td>
                                <td className="px-6 py-4 text-gray-700 font-medium">₹{order.totalAmount}</td>
                                <td className="px-6 py-4">
                                    {/* Dropdown for Status */}
                                    <select
                                        value={(order.status || 'pending').toLowerCase()}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        className={`rounded border px-2 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors ${getStatusColor(order.status)}`}
                                    >
                                        <option value="pending" className="bg-white text-gray-800">Pending</option>
                                        <option value="processing" className="bg-white text-gray-800">Processing</option>
                                        <option value="delivered" className="bg-white text-gray-800">Delivered</option>
                                        <option value="cancelled" className="bg-white text-gray-800">Cancelled</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedOrder(order)}
                                        className="inline-flex items-center gap-2 rounded-md bg-blue-100 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-200"
                                    >
                                        <FaEye />
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredOrders.length === 0 && (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* View Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white flex items-start justify-between border-b border-gray-200 px-6 py-4 z-10">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                                <p className="mt-1 text-sm text-gray-500 font-mono">
                                    #{selectedOrder._id}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedOrder(null)}
                                className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-gray-50 rounded border border-gray-100 text-sm">
                                    <p className="text-gray-500 mb-1">Customer</p>
                                    <p className="font-medium">{selectedOrder.userId?.name || selectedOrder.buyerName || 'Guest'}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded border border-gray-100 text-sm text-right">
                                    <p className="text-gray-500 mb-1">Payment & Total</p>
                                    <p className="font-medium uppercase">{selectedOrder.paymentMethod} - ₹{selectedOrder.totalAmount}</p>
                                </div>
                            </div>

                            <table className="min-w-full text-left text-sm border-collapse">
                                <thead className="bg-gray-50 uppercase text-gray-500">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">Image</th>
                                        <th scope="col" className="px-4 py-3">Product</th>
                                        <th scope="col" className="px-4 py-3 text-center">Qty</th>
                                        <th scope="col" className="px-4 py-3 text-right">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items?.map((product, idx) => (
                                        <tr key={product._id || idx} className="border-b border-gray-100">
                                            <td className="px-4 py-3">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-12 w-12 rounded object-cover border border-gray-200"
                                                />
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                                            <td className="px-4 py-3 text-gray-700 text-center">{product.qty}</td>
                                            <td className="px-4 py-3 text-gray-900 font-semibold text-right">₹{product.price * product.qty}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="mt-6 flex justify-end pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setSelectedOrder(null)}
                                    className="rounded-md bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}