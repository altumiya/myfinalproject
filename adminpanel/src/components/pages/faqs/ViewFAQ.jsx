import { FaFilter, FaPowerOff, FaTrash, FaEdit, FaTimes, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ViewFAQ() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const apiBaseUrl = import.meta.env.VITE_APIBASEURL || 'http://localhost:8000/api/admin/';
    const baseUrl = apiBaseUrl.replace(/\/$/, '');
    const [ids, setIds] = useState([]);

    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const getFAQs = async () => {
        setLoading(true);
        const endpoints = [`${baseUrl}/faq/view`, `${baseUrl}/faq/all`, `${baseUrl}/faq`, `${baseUrl}/faqs`];

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
                console.warn(`ViewFAQ: endpoint ${url} failed`, err?.response?.status);

                if (err?.response?.status !== 404) {
                    setFetchError(`${err?.response?.data?.message || err.message || 'Unable to fetch FAQs.'} (${url})`);
                    setData([]);
                    setLoading(false);
                    return;
                }
            }
        }

        setFetchError(`No working FAQ endpoint found. Tried: ${endpoints.join(', ')}`);
        setData([]);
        setLoading(false);
    };

    useEffect(() => {
        getFAQs();
    }, [baseUrl]);

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
            setIds(data.map((obj) => obj._id || obj.id));
        } else {
            setIds([]);
        }
    };

    const multiDelete = () => {
        if (ids.length >= 1) {
            axios.post(`${baseUrl}/faq/multiDelete`, { ids })
                .then((res) => res.data)
                .then((finalRes) => {
                    if (finalRes.status) {
                        setIds([]);
                        getFAQs();
                    }
                });
        }
    };

    const changeStatus = () => {
        if (ids.length >= 1) {
            axios.post(`${baseUrl}/faq/changeStatus`, { ids })
                .then((res) => res.data)
                .then((finalRes) => {
                    if (finalRes.status) {
                        setIds([]);
                        getFAQs();
                    }
                });
        }
    };

    return (
        <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">View FAQs</h2>
                    <p className="mt-1 text-sm text-gray-500">Manage frequently asked questions.</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={changeStatus}
                        className="inline-flex items-center gap-2 rounded-md bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-200 shadow-sm"
                    >
                        <FaPowerOff />
                        Change Status
                    </button>
                    <button
                        type="button"
                        onClick={multiDelete}
                        className="inline-flex items-center gap-2 rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 shadow-sm"
                    >
                        <FaTrash />
                        Delete
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowSearch(!showSearch)}
                        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
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
                        placeholder="Search FAQs..."
                        autoFocus
                        className="w-full border-none px-4 py-2 text-sm focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && getFAQs()}
                    />
                    <button 
                        type="button"
                        onClick={getFAQs}
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
                            setTimeout(getFAQs, 0); 
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
                    <p className="text-sm text-gray-600">Loading FAQs...</p>
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
                                <th scope="col" className="px-6 py-4">Question</th>
                                <th scope="col" className="px-6 py-4">Answer</th>
                                <th scope="col" className="px-6 py-4">Order</th>
                                <th scope="col" className="px-6 py-4">Status</th>
                                <th scope="col" className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((faq, index) => {
                                const faqId = faq._id || faq.id;
                                const isActive =
                                    faq.status === true ||
                                    faq.status === 1 ||
                                    String(faq.status).toLowerCase() === 'active';

                                return (
                                    <tr key={faqId || index} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                value={faqId}
                                                onChange={getCheckedValue}
                                                checked={ids.includes(String(faqId))}
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4">{index + 1}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">{faq.question}</td>
                                        <td className="px-6 py-4 max-w-sm truncate text-gray-700">{faq.answer}</td>
                                        <td className="px-6 py-4">
                                            <span className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                                                {faq.order}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`rounded px-2 py-1 text-xs font-semibold ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link to={`/faqs/edit-faq/${faq._id}`}>
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center gap-2 rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 shadow-sm"
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