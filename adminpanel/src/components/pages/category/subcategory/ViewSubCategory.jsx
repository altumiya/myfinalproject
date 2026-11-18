import React, { useEffect, useState } from 'react';
import { FaFilter, FaPowerOff, FaTrash, FaSearch, FaTimes, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ViewSubCategory() {
    const [data, setData] = useState([]);
    const [path, setPath] = useState('');
    const [ids, setIds] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const apiBaseUrl = import.meta.env.VITE_APIBASEURL;
    const baseUrl = apiBaseUrl ? apiBaseUrl.replace(/\/$/, '') : 'http://localhost:8000/api/admin';

    // Fetch SubCategories
    const getSubCategory = () => {
        axios
            .get(`${baseUrl}/subcategory/view`)
            .then((res) => res.data)
            .then((finalRes) => {
                if (finalRes.status) {
                    setData(finalRes.data);
                    setPath(finalRes.path);
                }
            })
            .catch((error) => console.error("Error fetching subcategories:", error));
    };

    useEffect(() => {
        getSubCategory();
    }, []);

    // Filter Logic
    const filteredSubCategories = data.filter((subCat) => {
        const parentName = subCat.parent?.name || '';
        const subName = subCat.name || '';
        return `${parentName} ${subName}`.toLowerCase().includes(searchTerm.toLowerCase());
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
            setIds(filteredSubCategories.map((obj) => String(obj._id)));
        } else {
            setIds([]);
        }
    };

    // Action Logic (Bulk & Single)
    const handleAction = (actionUrl, targetIds) => {
        if (!targetIds || targetIds.length === 0) {
            alert("Please select at least one subcategory.");
            return;
        }

        const backendAction = actionUrl === 'multiDelete' ? 'multidelete' : actionUrl === 'changeStatus' ? 'changestatus' : actionUrl;
        
        axios.post(`${baseUrl}/subcategory/${backendAction}`, { ids: targetIds })
            .then((res) => res.data)
            .then((finalRes) => {
                if (finalRes.status) {
                    getSubCategory();
                    setIds([]); // Clear selections
                }
            })
            .catch(err => console.error(`Error performing ${actionUrl}:`, err));
    };

    const multiDelete = () => handleAction('multiDelete', ids);
    const changeStatus = () => handleAction('changeStatus', ids);
    
    // Row-level inline actions
    const singleDelete = (id) => handleAction('multiDelete', [String(id)]);
    const singleChangeStatus = (id) => handleAction('changeStatus', [String(id)]);

    return (
        <div className="rounded-lg bg-white p-6 shadow-sm">
            {/* Header Section */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">View Subcategory</h2>
                </div>
                
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={changeStatus}
                        className="inline-flex items-center gap-2 rounded-md bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800 shadow-sm hover:bg-amber-200 transition-colors"
                    >
                        <FaPowerOff />
                        Change Status ({ids.length})
                    </button>
                    <button
                        type="button"
                        onClick={multiDelete}
                        className="inline-flex items-center gap-2 rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-200 transition-colors"
                    >
                        <FaTrash />
                        Delete ({ids.length})
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
                        placeholder="Search subcategory or parent..."
                        autoFocus
                        className="w-full border-none px-4 py-2 text-sm focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button 
                        type="button"
                        className="flex items-center justify-center border-l border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
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
                                    checked={ids.length === filteredSubCategories.length && filteredSubCategories.length > 0}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                            </th>
                            <th scope="col" className="px-6 py-4">S.No</th>
                            <th scope="col" className="px-6 py-4">Image</th>
                            <th scope="col" className="px-6 py-4">Name</th>
                            <th scope="col" className="px-6 py-4">Parent Category</th>
                            <th scope="col" className="px-6 py-4">Order</th>
                            <th scope="col" className="px-6 py-4">Status</th>
                            <th scope="col" className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSubCategories.map((subcategory, index) => {
                            const isActive = subcategory.status === true || subcategory.status === 1 || String(subcategory.status).toLowerCase() === 'active';

                            return (
                                <tr key={subcategory._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            value={subcategory._id}
                                            onChange={getCheckedValue}
                                            checked={ids.includes(String(subcategory._id))}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <img
                                            src={subcategory.image ? path + subcategory.image : 'https://via.placeholder.com/80x60?text=No+Image'}
                                            alt={subcategory.name}
                                            className="h-12 w-16 rounded object-cover shadow-sm"
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{subcategory.name}</td>
                                    <td className="px-6 py-4 text-gray-700">{subcategory.parent?.name}</td>
                                    <td className="px-6 py-4 text-gray-700">{subcategory.order}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            type="button"
                                            onClick={() => singleChangeStatus(subcategory._id)}
                                            className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                                                isActive ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        <Link to={`/category/subcategory/edit-subcategory/${subcategory._id}`}>
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 shadow-sm hover:bg-blue-200 transition-colors"
                                            >
                                                <FaEdit /> Edit
                                            </button>
                                        </Link>
                                        
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredSubCategories.length === 0 && (
                            <tr>
                                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                    No subcategories found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}