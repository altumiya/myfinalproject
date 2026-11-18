import React, { useEffect, useState } from 'react';
import { FaFilter, FaPowerOff, FaTrash, FaEdit, FaTimes, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ViewTestimonial() {
    const [data, setData] = useState([]);
    const [path, setPath] = useState('');
    const [ids, setIds] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const apiBaseUrl = import.meta.env.VITE_APIBASEURL;
    const baseUrl = apiBaseUrl ? apiBaseUrl.replace(/\/$/, '') : 'http://localhost:8000/api/admin';

    // Fetch Testimonials
    const getTestimonials = () => {
        axios
            .get(`${baseUrl}/testimonial/view`)
            .then((res) => res.data)
            .then((finalRes) => {
                if (finalRes.status) {
                    setData(finalRes.data);
                    setPath(finalRes.path || '');
                }
            })
            .catch((error) => console.error("Error fetching testimonials:", error));
    };

    useEffect(() => {
        getTestimonials();
    }, []);

    // Filter Logic (Frontend Search by name or title)
    const filteredTestimonials = data.filter((testimonial) =>
        testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            setIds(filteredTestimonials.map((obj) => String(obj._id)));
        } else {
            setIds([]);
        }
    };

    // Bulk Action Logic
    const multiDelete = () => {
        if (ids.length >= 1) {
            if(window.confirm("Are you sure you want to delete selected testimonials?")) {
                axios.post(`${baseUrl}/testimonial/multiDelete`, { ids })
                    .then((res) => res.data)
                    .then((finalRes) => {
                        if (finalRes.status) {
                            getTestimonials();
                            setIds([]);
                        }
                    })
                    .catch(err => console.error("Error deleting:", err));
            }
        }
    };

    const changeStatus = () => {
        if (ids.length >= 1) {
            axios.post(`${baseUrl}/testimonial/changeStatus`, { ids })
                .then((res) => res.data)
                .then((finalRes) => {
                    if (finalRes.status) {
                        getTestimonials();
                        setIds([]);
                    }
                })
                .catch(err => console.error("Error changing status:", err));
        }
    };

    const renderStars = (rating) => {
        const numRating = Number(rating) || 0; 
        
        return (
            <div className="flex gap-1 text-lg">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                        key={star} 
                        className={star <= numRating ? 'text-yellow-400' : 'text-gray-300'}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="rounded-lg bg-white p-6 shadow-sm">
            
            {/* Header Section */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">View Testimonials</h2>
                    <p className="mt-1 text-sm text-gray-500">Manage customer testimonials.</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={changeStatus}
                        className="inline-flex items-center gap-2 rounded-md bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800 shadow-sm hover:bg-amber-200 transition-colors"
                        disabled={ids.length === 0}
                    >
                        <FaPowerOff />
                        Change Status
                    </button>
                    <button
                        type="button"
                        onClick={multiDelete}
                        className="inline-flex items-center gap-2 rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-200 transition-colors"
                        disabled={ids.length === 0}
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
                        placeholder="Search by name or title..."
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
                                    checked={ids.length === filteredTestimonials.length && filteredTestimonials.length > 0}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                            </th>
                            <th scope="col" className="px-6 py-4">Sr.No</th>
                            <th scope="col" className="px-6 py-4">Image</th>
                            <th scope="col" className="px-6 py-4">Name</th>
                            <th scope="col" className="px-6 py-4">Designation</th>
                            <th scope="col" className="px-6 py-4">Message</th>
                            <th scope="col" className="px-6 py-4">Rating</th>
                            <th scope="col" className="px-6 py-4">Status</th>
                            <th scope="col" className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTestimonials.map((testimonial, index) => {
                            const isActive = testimonial.status === true || testimonial.status === 1 || String(testimonial.status).toLowerCase() === 'active';

                            return (
                                <tr key={testimonial._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            value={testimonial._id}
                                            onChange={getCheckedValue}
                                            checked={ids.includes(String(testimonial._id))}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                    </td>
                                    
                                    <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                                    
                                    <td className="px-6 py-4">
                                        <img
                                            src={testimonial.image ? path + testimonial.image : 'https://via.placeholder.com/80x60?text=No+Image'}
                                            alt={testimonial.name}
                                            className="h-12 w-12 rounded object-cover shadow-sm"
                                        />
                                    </td>
                                    
                                    <td className="px-6 py-4 font-medium text-gray-900">{testimonial.name}</td>
                                    <td className="px-6 py-4 text-gray-700">{testimonial.designation}</td>
                                    <td className="px-6 py-4 max-w-xs truncate text-gray-700" title={testimonial.message}>
                                        {testimonial.message}
                                    </td>
                                    <td className="px-6 py-4">
                                        {renderStars(testimonial.rating)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`rounded px-2 py-1 text-xs font-semibold ${
                                            isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link to={`/testimonial/edit-testimonial/${testimonial._id}`}>
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm hover:bg-blue-200 transition-colors"
                                            >
                                                <FaEdit />
                                                Edit
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredTestimonials.length === 0 && (
                            <tr>
                                <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                                    No testimonials found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}