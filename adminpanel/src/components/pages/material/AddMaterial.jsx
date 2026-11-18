import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

export default function AddMaterial({ setActiveTab }) {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [order, setOrder] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams();
    
    const apiBaseUrl = import.meta.env.VITE_APIBASEURL || 'http://localhost:8000/api/admin/';
    const baseUrl = apiBaseUrl.replace(/\/$/, '');

    // Fetch highest order if adding a new material
    useEffect(() => {
        if (id) return; // Skip if we are in edit mode
        
        const fetchMaterials = async () => {
            const endpoints = [`${baseUrl}/material/view`, `${baseUrl}/material/all`, `${baseUrl}/material`, `${baseUrl}/materials`];
            
            for (const url of endpoints) {
                try {
                    const res = await axios.get(url);
                    const materials = Array.isArray(res.data) ? res.data : (res.data.data || []);

                    if (materials.length > 0) {
                        const highestOrder = Math.max(...materials.map(m => Number(m.order) || 0));
                        setOrder(String(highestOrder + 1));
                    } else {
                        setOrder('1');
                    }
                    return;
                } catch (err) {
                    console.warn(`AddMaterial fetch failed on endpoint: ${url}`);
                }
            }
            setOrder('1');
        };
        fetchMaterials();
    }, [baseUrl, id]);

    // Fetch specific material details if editing
    useEffect(() => {
        if (id) {
            axios.get(`${baseUrl}/material/details/${id}`)
            .then((res) => res.data)
            .then((finalRes) => {
                const { name, order } = finalRes.data || {};
                setName(name || '');
                setOrder(order || '');
            })
            .catch((err) => {
                toast.error('Failed to fetch material details.');
                console.error(err);
            });
        } else {
            setName('');
            setOrder('');
        }
    }, [id, baseUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const trimmedName = String(name).trim();
        const orderValue = String(order).trim();
        const parsedOrder = Number(orderValue);

        // Validations
        if (!trimmedName) {
            setError({ name: 'Material name is required.' });
            return;
        }
        if (!orderValue || isNaN(parsedOrder)) {
            setError({ order: 'Order must be a valid number.' });
            return;
        }

        const payload = {
            name: trimmedName,
            order: parsedOrder,
        };

        setLoading(true);

        if (id) {
            // Update Existing Material
            axios.put(`${baseUrl}/material/update/${id}`, payload)
            .then((res) => res.data)
            .then((finalRes) => {
                if (finalRes.status || finalRes.success) {
                    toast.success('Material updated successfully!');
                    if (typeof setActiveTab === 'function') {
                        setTimeout(() => setActiveTab('viewMaterial'), 2000);
                    } else {
                        setTimeout(() => navigate('/material/view'), 2000);
                    }
                } else {
                    setError(finalRes.error || null);
                    toast.error(finalRes.error?.message || 'Failed to update material.');
                }
            })
            .catch((err) => {
                const message = err?.response?.data?.message || err.message || 'Cannot connect to the server.';
                const backendErrors = err?.response?.data?.error || err?.response?.data || null;
                setError(backendErrors);
                toast.error(message);
            })
            .finally(() => {
                setLoading(false);
            });
        } else {
            // Create New Material
            try {
                let res;
                const createEndpoints = [`${baseUrl}/material/create`, `${baseUrl}/material/add`, `${baseUrl}/material/store`];
                let success = false;
                
                for (const url of createEndpoints) {
                    try {
                        res = await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } });
                        success = true;
                        break;
                    } catch (err) {
                        console.warn(`Failed endpoint: ${url}`);
                    }
                }
                
                if (!success) throw new Error("Could not find a valid create endpoint.");

                const finalResp = res.data;
                const apiSuccess = finalResp && (
                    finalResp.status === true ||
                    finalResp.status === 1 ||
                    finalResp.success === true ||
                    finalResp.success === 1 ||
                    String(finalResp.status).toLowerCase() === 'success' ||
                    String(finalResp.success).toLowerCase() === 'success'
                );

                if (apiSuccess || res.status === 200 || res.status === 201) {
                    toast.success('Material added successfully!');
                    setName('');
                    setOrder(String(parsedOrder + 1));
                    
                    if (typeof setActiveTab === 'function') {
                        setTimeout(() => setActiveTab('viewMaterial'), 2000);
                    } else {
                        setTimeout(() => navigate('/material/view'), 2000);
                    }
                } else {
                    setError(finalResp.error || null);
                    toast.error(finalResp.error?.message || finalResp?.message || 'Failed to add material.');
                }
            } catch (err) {
                const message = err?.response?.data?.message || err.message || 'Cannot connect to the server.';
                const backendErrors = err?.response?.data?.error || err?.response?.data || null;
                setError(backendErrors);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="max-w-2xl rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {id ? 'Edit Material' : 'Add New Material'}
                </h2>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    {error?.name && <span className="mb-1 block text-sm text-red-500">{error.name}</span>}
                    <label className="mb-2 block text-sm font-medium text-gray-900">Material Name</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Cotton Fabric"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                
                <div>
                    {error?.order && <span className="mb-1 block text-sm text-red-500">{error.order}</span>}
                    <label className="mb-2 block text-sm font-medium text-gray-900">Sorting Order</label>
                    <input
                        type="number"
                        name="order"
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        placeholder="e.g. 1"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">Determines the display sequence (lowest first).</p>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`rounded-md px-6 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-4 focus:ring-blue-300 
                            ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {id ? 'Update Material' : 'Add Material'}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => setActiveTab('viewMaterial')}
                        className="ml-4 rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}