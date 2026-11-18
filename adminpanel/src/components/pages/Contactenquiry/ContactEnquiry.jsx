"use client";
import React, { useState, useEffect } from 'react';
import { FaFilter, FaPowerOff, FaTrash, FaSearch, FaTimes } from 'react-icons/fa';

export default function ContactEnquiry() {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Search & Filter State
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Bulk Selection State
    const [selectedIds, setSelectedIds] = useState([]);

    // Environment-safe Base URL getter
    const getBaseUrl = () => {
        let baseUrl = "http://localhost:8000/api";
        if (import.meta && import.meta.env && import.meta.env.VITE_APIBASEURL) {
            baseUrl = import.meta.env.VITE_APIBASEURL;
        }
        if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.slice(0, -1);
        }
        return baseUrl;
    };

    // Fetch Data
    const fetchEnquiries = async () => {
        try {
            const response = await fetch(`${getBaseUrl()}/contactenquiry/view`, {
                cache: 'no-store'
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const result = await response.json();
            let dataArray = result.data || result || [];
            setEnquiries(Array.isArray(dataArray) ? dataArray : []);
        } catch (error) {
            console.error("Failed to fetch contact enquiries:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, []);

    // Filter Logic
    const filteredEnquiries = enquiries.filter(enquiry => {
        const query = searchQuery.toLowerCase();
        return (
            enquiry.name?.toLowerCase().includes(query) ||
            enquiry.email?.toLowerCase().includes(query) ||
            enquiry.subject?.toLowerCase().includes(query) ||
            enquiry.mobile?.toLowerCase().includes(query)
        );
    });

    // --- Checkbox Logic ---
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(filteredEnquiries.map(enq => enq._id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (e, id) => {
        if (e.target.checked) {
            setSelectedIds([...selectedIds, id]);
        } else {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        }
    };

    // --- Bulk Action Handlers ---
    const handleBulkStatusChange = async () => {
        if (selectedIds.length === 0) return;
        
        try {
            await Promise.all(
                selectedIds.map(id =>
                    fetch(`${getBaseUrl()}/contactenquiry/status/${id}`, { method: 'PUT' })
                )
            );

            setEnquiries(enquiries.map(enquiry => 
                selectedIds.includes(enquiry._id)
                    ? { ...enquiry, status: enquiry.status === 'Active' ? 'Inactive' : 'Active' } 
                    : enquiry
            ));
            
            setSelectedIds([]);
        } catch (error) {
            console.error("Error with bulk status update:", error);
            alert("Something went wrong while updating statuses.");
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) return;

        try {
            await Promise.all(
                selectedIds.map(id =>
                    fetch(`${getBaseUrl()}/contactenquiry/delete/${id}`, { method: 'DELETE' })
                )
            );

            setEnquiries(enquiries.filter(enquiry => !selectedIds.includes(enquiry._id)));
            setSelectedIds([]);
        } catch (error) {
            console.error("Error with bulk delete:", error);
            alert("Something went wrong while deleting items.");
        }
    };

    return (
        <div className="rounded-lg bg-white p-6 shadow-sm">
            {/* Header Section */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Contact Enquiry</h2>
                    {selectedIds.length > 0 && (
                        <p className="text-sm text-gray-500 mt-1">{selectedIds.length} item(s) selected</p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleBulkStatusChange}
                        className="inline-flex items-center gap-2 rounded-md bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800 shadow-sm hover:bg-amber-200 transition-colors"
                    >
                        <FaPowerOff />
                        Change Status
                    </button>
                    <button
                        type="button"
                        onClick={handleBulkDelete}
                        className="inline-flex items-center gap-2 rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-200 transition-colors"
                    >
                        <FaTrash />
                        Delete
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <FaFilter />
                        Filter
                    </button>
                </div>
            </div>

            {/* Search Bar UI */}
            {isSearchOpen && (
                <div className="mb-6 flex max-w-md items-center overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                    <input
                        type="text"
                        placeholder="Search enquiries..."
                        autoFocus
                        className="w-full border-none px-4 py-2 text-sm focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                            setIsSearchOpen(false);
                            setSearchQuery('');
                        }}
                        className="flex items-center justify-center border-l border-gray-300 bg-gray-50 px-4 py-2.5 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                        title="Close Search"
                    >
                        <FaTimes />
                    </button>
                </div>
            )}

            {/* Table Section */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 uppercase text-gray-500 border-b border-gray-200">
                        <tr>
                            <th scope="col" className="px-6 py-4 w-12">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                    onChange={handleSelectAll}
                                    checked={filteredEnquiries.length > 0 && selectedIds.length === filteredEnquiries.length}
                                />
                            </th>
                            <th scope="col" className="px-6 py-4">ID</th>
                            <th scope="col" className="px-6 py-4">Name</th>
                            <th scope="col" className="px-6 py-4">Email</th>
                            <th scope="col" className="px-6 py-4">Phone</th>
                            <th scope="col" className="px-6 py-4">Subject</th>
                            <th scope="col" className="px-6 py-4">Message</th> 
                            <th scope="col" className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                    Loading enquiries...
                                </td>
                            </tr>
                        ) : filteredEnquiries.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                    {searchQuery ? "No matching enquiries found." : "No enquiries found."}
                                </td>
                            </tr>
                        ) : (
                            filteredEnquiries.map((enquiry, index) => (
                                <tr 
                                    key={enquiry._id} 
                                    className={`hover:bg-gray-50 transition-colors ${selectedIds.includes(enquiry._id) ? 'bg-blue-50/30' : ''}`}
                                >
                                    <td className="px-6 py-4">
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                            checked={selectedIds.includes(enquiry._id)}
                                            onChange={(e) => handleSelectOne(e, enquiry._id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{enquiry.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{enquiry.email}</td>
                                    <td className="px-6 py-4 text-gray-600">{enquiry.mobile}</td>
                                    <td className="px-6 py-4 text-gray-700">{enquiry.subject}</td>
                                    <td className="px-6 py-4 text-gray-700 max-w-[200px] truncate" title={enquiry.message}>
                                        {enquiry.message}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            enquiry.status === 'Active' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                            {enquiry.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}