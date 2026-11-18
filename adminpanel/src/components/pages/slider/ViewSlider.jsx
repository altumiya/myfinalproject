import React, { useEffect, useState } from 'react';
import { FaFilter, FaPowerOff, FaTrash, FaTimes, FaSearch, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ViewSlider() {
    const [data, setData] = useState([]);
    const [path, setPath] = useState('');
    const [ids, setIds] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    const apiBaseUrl = import.meta.env.VITE_APIBASEURL;
    const baseUrl = apiBaseUrl ? apiBaseUrl.replace(/\/$/, '') : 'http://localhost:8000/api/admin';

    // Fetch Sliders
    const getSlider = () => {
        axios
            .get(`${baseUrl}/slider/view`)
            .then((res) => res.data)
            .then((finalRes) => {
                if (finalRes.status) {
                    setData(finalRes.data);
                    setPath(finalRes.path);
                }
            })
            .catch((error) => console.error("Error fetching sliders:", error));
    };

    useEffect(() => {
        getSlider();
    }, []);

    // Filter Logic (Frontend Search)
    const filteredSliders = data.filter((slider) =>
        (String(slider.name || slider.title || '')).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const _placeholderImage = 'https://via.placeholder.com/120x60?text=No+Image';
    const resolveImageSrc = (img) => {
        if (!img) return _placeholderImage;
        const s = String(img).trim();
        if (/^https?:\/\//i.test(s)) return s;
        const clean = s.replace(/^\/+/, '');
        const encoded = encodeURIComponent(clean);
        if (path) return `${path.replace(/\/$/, '')}/${encoded}`;
        return `${baseUrl.replace(/\/$/, '')}/${encoded}`;
    };

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
            setIds(filteredSliders.map((obj) => String(obj._id || obj.id)));
        } else {
            setIds([]);
        }
    };

    // Bulk Action Logic
    const multiDelete = () => {
        if (ids.length >= 1) {
            axios.post(`${baseUrl}/slider/multiDelete`, { ids })
                .then((res) => res.data)
                .then((finalRes) => {
                    if (finalRes.status) {
                        getSlider();
                        setIds([]);
                    }
                })
                .catch(err => console.error("Error deleting:", err));
        }
    };

    const changeStatus = () => {
        if (ids.length >= 1) {
            axios.post(`${baseUrl}/slider/changeStatus`, { ids })
                .then((res) => res.data)
                .then((finalRes) => {
                    if (finalRes.status) {
                        getSlider();
                        setIds([]);
                    }
                })
                .catch(err => console.error("Error changing status:", err));
        }
    };

    return (
        <div className="rounded-lg bg-white p-6 shadow-sm">
            
            {/* Header Section */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">View Slider</h2>
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
                        placeholder="Search slider..."
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
                                    checked={ids.length === filteredSliders.length && filteredSliders.length > 0}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                            </th>
                            <th scope="col" className="px-6 py-4">S.No</th>
                            <th scope="col" className="px-6 py-4">Image</th>
                            <th scope="col" className="px-6 py-4">Title</th>
                            <th scope="col" className="px-6 py-4">Order</th>
                            <th scope="col" className="px-6 py-4">Status</th>
                            {/* Added Missing Action Header */}
                            <th scope="col" className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSliders.map((slider, index) => {
                            const sliderId = String(slider._id || slider.id || index);
                            const isActive = slider.status === true || slider.status === 1 || String(slider.status).toLowerCase() === 'active';

                            return (
                                <tr key={slider._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            value={slider._id}
                                            onChange={getCheckedValue}
                                            checked={ids.includes(String(slider._id))}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                    </td>
                                    
                                    <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                                    
                                    <td className="px-6 py-4">
                                        <img
                                            src={slider.image ? path + slider.image : 'https://via.placeholder.com/80x60?text=No+Image'}
                                            alt={slider.name}
                                            className="h-12 w-16 rounded object-cover shadow-sm"
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{slider.name}</td>
                                    <td className="px-6 py-4 text-gray-700">{slider.order}</td>
                                    <td className="px-6 py-4">
                                        <span className={`rounded px-2 py-1 text-xs font-semibold ${
                                            isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link to={`/sliders/edit-slider/${slider._id}`}>
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
                        {filteredSliders.length === 0 && (
                            <tr>
                                {/* Updated colSpan from 6 to 7 to account for the new Action column */}
                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                    No sliders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}