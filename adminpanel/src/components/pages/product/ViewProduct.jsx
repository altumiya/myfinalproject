import React, { useEffect, useState } from 'react';
import { FaFilter, FaPowerOff, FaTrash, FaSearch, FaTimes, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ViewProduct() {
    const [ids, setIds] = useState([]);
    const [data, setData] = useState([]);
    const [path, setPath] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const apiBaseUrl = import.meta.env.VITE_APIBASEURL;
    const baseUrl = apiBaseUrl ? apiBaseUrl.replace(/\/$/, '') : 'http://localhost:8000/api/admin';

    // Fetch Products
    const getProducts = () => {
        axios
            .get(`${baseUrl}/product/view`)
            .then((res) => res.data)
            .then((finalRes) => {
                if (finalRes.status) {
                    setData(finalRes.data);
                    setPath(finalRes.path || '');
                }
            })
            .catch((error) => console.error("Error fetching products:", error));
    };

    useEffect(() => {
        getProducts();
    }, []);

    // Filter Logic (Frontend Search)
    const filteredProducts = data.filter((product) => {
        const name = product.name || '';
        const categoryName = product.parent?.name || '';
        return `${name}  ${categoryName}`.toLowerCase().includes(searchTerm.toLowerCase());
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
            setIds(filteredProducts.map((obj) => String(obj._id)));
        } else {
            setIds([]);
        }
    };

    // Action Logic (Triggered via Bulk Actions using Checked Values)
    const multiDelete = () => {
        if (ids.length >= 1) {
            axios.post(`${baseUrl}/product/multiDelete`, { ids })
                .then((res) => res.data)
                .then((finalRes) => {
                    if (finalRes.status) {
                        getProducts();
                        setIds([]); 
                    }
                });
        }
    };
     const changeStatus = () => {
        if (ids.length >= 1) {
            axios.post(`${baseUrl}/product/changeStatus`, { ids })
                .then((res) => res.data)
                .then((finalRes) => {
                    if (finalRes.status) {
                        getProducts();
                        setIds([]); 
                    }
                });
        }
    };

  

    return (
        <div className="rounded-lg bg-white p-6 shadow-sm">

            {/* Header & Bulk Actions (Working via Checked Value) */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">View Product</h2>
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
                        placeholder="Search product, sku, category..."
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

            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-50 uppercase text-gray-500">
                        <tr>
                            <th scope="col" className="px-6 py-4">
                                <input
                                    type="checkbox"
                                    onChange={allSelect}
                                    checked={ids.length === filteredProducts.length && filteredProducts.length > 0}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                            </th>
                            <th scope="col" className="px-6 py-4">ID</th>
                            <th scope="col" className="px-6 py-4">Image</th>
                            <th scope="col" className="px-6 py-4">Name</th>
                            <th scope="col" className="px-6 py-4">Category</th>
                            <th scope="col" className="px-6 py-4">Price</th>
                            <th scope="col" className="px-6 py-4">Stock</th>
                            <th scope="col" className="px-6 py-4">Status</th>
                            <th scope="col" className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product, index) => (
                            <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        value={product._id}
                                        onChange={getCheckedValue}
                                        checked={ids.includes(String(product._id))}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                </td>
                                <td className="px-6 py-4">{index + 1}</td>
                                <td className="px-6 py-4">
                                    <img
                                        src={product.image ? path + product.image : 'https://via.placeholder.com/80x60?text=No+Image'}
                                        alt={product.name}
                                        className="h-12 w-16 rounded object-cover shadow-sm"
                                    />
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 text-gray-600">{product.parent?.name || 'N/A'}</td>
                                <td className="px-6 py-4 text-gray-700">{product.price || 'N/A'}</td>
                                <td className="px-6 py-4 text-gray-700">{product.stock || 0}</td>
                               <td className="px-6 py-4">
                                        <span className={`rounded px-2 py-1 text-xs font-semibold ${
                                            product.status !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {product.status !== false ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {/* Restored exact original button logic */}
                                        <Link to={`/product/product-details/${product._id}`}>
                                            <button className='inline-flex items-center gap-2 rounded-md bg-blue-100 px-3 py-2 text-xs font-semibold text-blue-800 hover:bg-blue-200'>
                                                Details
                                            </button>
                                        </Link>
                                        <Link to={`/product/edit-product/${product._id}`}>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm hover:bg-blue-200 transition-colors"
                                        >
                                            <FaEdit />
                                            Edit
                                        </button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {/* Empty State */}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
