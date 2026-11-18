"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { MdClose } from "react-icons/md"; // Make sure react-icons is installed

export default function OrderTable() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // State for handling the modal
    const [selectedOrder, setSelectedOrder] = useState(null);
    
    // Get token from Redux store
    const token = useSelector((store) => store.userStore?.token);
    const apiBaseUrl = process.env.NEXT_PUBLIC_APIBASEURL;

    useEffect(() => {
        if (token) {
            fetchUserOrders();
        } else {
            setIsLoading(false);
        }
    }, [token]);

    const fetchUserOrders = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}web/order/user-orders`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.data.status === 1) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setSelectedOrder(null);
    };

    if (isLoading) {
        return <div className="text-center py-10 font-rubik">Loading your orders...</div>;
    }

    return (
        <div className="overflow-x-auto relative">
            <table className="w-full border-collapse bg-white shadow-sm rounded border border-gray-100">
                <thead className="bg-gray-50 border-b-2 border-orange-dim font-playfair text-sm text-left">
                    <tr>
                        <th className="p-4 text-gray-700">Order ID</th>
                        <th className="p-4 text-gray-700">Date</th>
                        <th className="p-4 text-gray-700">Status</th>
                        <th className="p-4 text-gray-700">Total</th>
                        <th className="p-4 text-center text-gray-700">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center p-8 text-gray-500 font-rubik">
                                You haven't placed any orders yet.
                            </td>
                        </tr>
                    ) : (
                        orders.map((item) => (
                            <tr key={item._id} className="border-b border-gray-100 text-sm hover:bg-gray-50 transition-colors font-rubik">
                                <td className="p-4 text-gray-600 font-mono">
                                    #{item._id.slice(-6).toUpperCase()}
                                </td>
                                
                                <td className="p-4 font-medium text-gray-700">
                                    {new Date(item.createdAt).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </td>
                                
                                <td className="p-4 font-medium">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        item.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                        item.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                        'bg-orange-100 text-orange-700'
                                    }`}>
                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                    </span>
                                </td>
                                
                                <td className="p-4 font-medium text-gray-700">
                                    ₹{item.totalAmount} <span className="text-gray-400 text-xs">({item.items?.length || 0} items)</span>
                                </td>
                                
                                <td className="p-4 text-center">
                                    {/* Trigger Modal on Click */}
                                    <button 
                                        onClick={() => setSelectedOrder(item)}
                                        className="px-4 py-2 rounded border border-orange-dim text-orange-dim hover:bg-orange-dim hover:text-white font-semibold transition"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* View Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                        
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
                            <h2 className="font-playfair text-2xl font-semibold text-gray-800">
                                Order #{selectedOrder._id.slice(-6).toUpperCase()}
                            </h2>
                            <button 
                                onClick={closeModal}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                            >
                                <MdClose size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 font-rubik">
                            
                            {/* Status & Date */}
                            <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded border border-gray-100 text-sm">
                                <div>
                                    <p className="text-gray-500">Placed on</p>
                                    <p className="font-semibold text-gray-800">
                                        {new Date(selectedOrder.createdAt).toLocaleString('en-IN', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short'
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-500">Payment Method</p>
                                    <p className="font-semibold text-gray-800 uppercase">
                                        {selectedOrder.paymentMethod} 
                                        <span className={`ml-2 text-xs px-2 py-0.5 rounded ${selectedOrder.paymentStatus === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {selectedOrder.paymentStatus}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Products List */}
                            <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">Items in this order</h3>
                            <div className="space-y-4 mb-6">
                                {selectedOrder.items?.map((product, index) => (
                                    <div key={index} className="flex items-center gap-4 border border-gray-100 p-3 rounded shadow-sm">
                                        <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="font-medium text-gray-800">{product.name}</h4>
                                            <p className="text-sm text-gray-500">Qty: {product.qty}</p>
                                        </div>
                                        <div className="font-bold text-orange-dim text-right">
                                            ₹{product.price * product.qty}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Shipping & Billing Info */}
                            <div className="grid md:grid-cols-2 gap-6 mb-6 text-sm">
                                <div className="border border-gray-100 p-4 rounded shadow-sm">
                                    <h3 className="font-semibold text-gray-800 mb-2 border-b pb-1">Shipping Address</h3>
                                    <p className="font-medium">{selectedOrder.shippingAddress?.fullName}</p>
                                    <p className="text-gray-600 mt-1">{selectedOrder.shippingAddress?.billingAddress}</p>
                                    <p className="text-gray-600">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                                    <p className="text-gray-600">{selectedOrder.shippingAddress?.country} - {selectedOrder.shippingAddress?.pincode}</p>
                                    <p className="text-gray-600 mt-2 font-medium">Phone: {selectedOrder.shippingAddress?.mobileNumber}</p>
                                </div>

                                <div className="border border-gray-100 p-4 rounded shadow-sm flex flex-col justify-center">
                                    <h3 className="font-semibold text-gray-800 mb-2 border-b pb-1">Order Summary</h3>
                                    <div className="flex justify-between text-gray-600 mb-1">
                                        <span>Subtotal</span>
                                        <span>₹{selectedOrder.totalAmount - 150}</span> {/* Assuming flat 150 shipping from checkout */}
                                    </div>
                                    <div className="flex justify-between text-gray-600 mb-3">
                                        <span>Shipping</span>
                                        <span>₹150</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-2">
                                        <span>Total</span>
                                        <span className="text-orange-dim">₹{selectedOrder.totalAmount}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}