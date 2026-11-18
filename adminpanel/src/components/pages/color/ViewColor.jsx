import { FaFilter, FaPowerOff, FaTrash, FaEdit, FaTimes, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


export default function ViewColor({ setActiveTab }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const apiBaseUrl = import.meta.env.VITE_APIBASEURL || 'http://localhost:8000/api/admin/';
    const baseUrl = apiBaseUrl.replace(/\/$/, '');
    const [ids, setIds] = useState([]);
   
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const getColors = async () => {
        setLoading(true);
        const endpoints = [`${baseUrl}/color/view`, `${baseUrl}/color/all`, `${baseUrl}/color`, `${baseUrl}/colors`];
        
        for (const url of endpoints) {
            try {
                const res = await axios.get(url, {
                    params: searchQuery ? { search: searchQuery } : {} 
                });
                const finalRes = res.data;

                if (finalRes?.status) {
                    setData(finalRes.data || []);
                } else if (Array.isArray(finalRes)) {
                    setData(finalRes);
                } else {
                    setData([]);
                }
                setFetchError(null);
                setLoading(false);
                return;

            } catch (err) {
                console.warn(`ViewColor: endpoint ${url} failed`, err?.response?.status);

                if (err?.response?.status !== 404) {
                    setFetchError(`${err?.response?.data?.message || err.message || 'Unable to fetch colors.'} (${url})`);
                    setData([]);
                    setLoading(false);
                    return;
                }
            }
        }

        setFetchError(`No working color endpoint found. Tried: ${endpoints.join(', ')}`);
        setData([]);
        setLoading(false);
    };

    useEffect(() => {
        getColors();
    }, []);

    const getCheckedValue = (e) => {
        const checkValue = e.target.value;
        if (e.target.checked) {
            setIds([...ids, checkValue]);
        } else {
            setIds(ids.filter((v) => v !== checkValue));
        }
    }

    const allSelect = (e) => {
        if (e.target.checked) {
            setIds(data.map((obj) => obj._id));
        } else {
            setIds([]);
        }
    }

    const multiDelete = () => {
        if (ids.length >= 1) {
            axios.post(`${baseUrl}/color/multiDelete`, { ids })
                .then((res) => res.data)
                .then((finalRes) => {
                    if (finalRes.status) {
                        getColors();
                        setIds([]);
                    }
                })
        }
    };

    const changeStatus = () => {
        if (ids.length >= 1) {
            axios.post(`${baseUrl}/color/changeStatus`, { ids })
                .then((res) => res.data)
                .then((finalRes) => {
                    if (finalRes.status) {
                        getColors();
                        setIds([]);
                    }
                })
        }
    };
   

    return (
        <div className="rounded-lg bg-white p-6 shadow-sm">
            
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">View Color</h2>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={changeStatus}
                        className="inline-flex items-center gap-2 rounded-md bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800 shadow-sm hover:bg-amber-200"
                    >
                        <FaPowerOff />
                        Change Status
                    </button>
                    <button
                        type="button"
                        onClick={multiDelete}
                        className="inline-flex items-center gap-2 rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-200"
                    >
                        <FaTrash />
                        Delete
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowSearch(!showSearch)}
                        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                        <FaFilter />
                        Filter
                    </button>
                </div>
            </div>

            {showSearch && (
                <div className="mb-6 flex max-w-md items-center overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                    <input
                        type="text"
                        placeholder="Search colors..."
                        autoFocus
                        className="w-full border-none px-4 py-2 text-sm focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && getColors()}
                    />
                    <button 
                        type="button"
                        onClick={getColors}
                        className="flex items-center justify-center border-l border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        title="Search"
                    >
                        <FaSearch />
                    </button>
                    <button 
                        type="button"
                        onClick={() => {
                            setShowSearch(false);
                            setSearchQuery('');
                            setTimeout(getColors, 0); 
                        }}
                        className="flex items-center justify-center border-l border-gray-300 bg-gray-50 px-4 py-2.5 text-red-500 hover:bg-red-50 hover:text-red-700"
                        title="Close Search"
                    >
                        <FaTimes />
                    </button>
                </div>
            )}

            {loading ? (
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-600">Loading colors...</p>
                </div>
            ) : fetchError ? (
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <p className="text-sm text-red-600">{fetchError}</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gray-50 uppercase text-gray-500">
                            <tr>
                                <th scope="col" className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        onChange={allSelect}
                                        checked={ids.length === data.length && data.length > 0}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                                <th scope="col" className="px-6 py-4">ID</th>
                                <th scope="col" className="px-6 py-4">Name</th>
                                <th scope="col" className="px-6 py-4">Preview</th>
                                <th scope="col" className="px-6 py-4">Hex Code</th>
                                <th scope="col" className="px-6 py-4">Order</th>
                                <th scope="col" className="px-6 py-4">Status</th>
                                <th scope="col" className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((color, index) => {
                                const isActive =
                                    color.status === true ||
                                    color.status === 1 ||
                                    String(color.status).toLowerCase() === 'active';

                                return (
                                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                value={color._id}
                                                onChange={getCheckedValue}
                                                checked={ids.includes(color._id)}
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4">{index + 1}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{color.name}</td>
                                        <td className="px-6 py-4">
                                            <div className="h-9 w-14 rounded border shadow-sm" style={{ backgroundColor: color.code }} />
                                        </td>
                                        <td className="px-6 py-4 font-mono text-gray-700">{color.code}</td>
                                        <td className="px-6 py-4">{color.order}</td>
                                        <td className="px-6 py-4">
                                            <span className={`rounded px-2 py-1 text-xs font-semibold ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        
                                        <td className="px-6 py-4">
                                            <Link to={`/color/edit-color/${color._id}`}>
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm hover:bg-blue-200"
                                            >
                                                <FaEdit />
                                                Edit
                                            </button>
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}