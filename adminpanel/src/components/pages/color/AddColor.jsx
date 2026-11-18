import { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

export default function AddColor({ setActiveTab }) {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#2563eb');
    const [order, setOrder] = useState('');
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const apiBaseUrl = import.meta.env.VITE_APIBASEURL || 'http://localhost:8000/api/admin/';
    const baseUrl = apiBaseUrl.replace(/\/$/, '');
    

    useEffect(() => {
        const fetchColorData = async () => {
            const endpoints = [`${baseUrl}/color/view`, `${baseUrl}/color/all`, `${baseUrl}/color`, `${baseUrl}/colors`];
            
            for (const url of endpoints) {
                try {
                    const res = await axios.get(url);
                    const colors = Array.isArray(res.data) ? res.data : (res.data.data || []);

                    if (colors.length > 0) {
                        const highestOrder = Math.max(...colors.map(c => c.order || 0));
                        setOrder(highestOrder + 1);
                    } else {
                        setOrder(1);
                    }
                    return; 
                } catch (err) {
                    console.warn(`AddColor fetch failed on endpoint: ${url}`);
                }
            }
            setOrder(1);
        };
        
        fetchColorData();
    }, [baseUrl]);

    const handleColorChange = (newColor) => {
        setColor(newColor.hex);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError({ name: "Color name is required." });
            return;
        }
        if (order === '' || isNaN(order)) {
            setError({ order: "Order must be a valid number." });
            return; 
        }

        const payload = {
            name: name.trim(),
            code: color,
            order: Number(order),
        };

        setLoading(true);
       if (id) {
        axios.put(`${baseUrl}/color/update/${id}`, payload)
        .then((res) => res.data)
        .then((finalRes) => {
            if (finalRes.status) {
                toast.success('Color updated successfully!');
                if (typeof setActiveTab === 'function') {
                    setTimeout(() => setActiveTab('viewColor'), 2000);
                } else {
                    setTimeout(() => navigate('/color/view'), 2000);
                }
            } else {
                setError(finalRes.error || null);
                toast.error(finalRes.error?.message || 'Failed to update color.');
            }
        })}
       else{
          try {
            const res = await axios.post(`${baseUrl}/color/create`, payload);
            const finalResp = res.data;

            if (finalResp.status === true) {
                toast.success(finalResp.message || 'Color added successfully!');
                setShowColorPicker(false);
                setName('');
                setColor('#2563eb');
                setOrder(prev => Number(prev) + 1);
                if (typeof setActiveTab === 'function') {
                    setTimeout(() => setActiveTab('viewColor'), 2000);
                } else {
                    setTimeout(() => navigate('/color/view'), 2000);
                }
            } else {
                setError(finalResp.error || null);
                toast.error(
                    finalResp.error?.message ||
                    finalResp.error?.name ||
                    finalResp.message ||
                    'Failed to add color.'
                );
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
     useEffect(() => {
        if (id) {
            axios.get(`${baseUrl}/color/details/${id}`)
            .then((res) => res.data)
            .then((finalRes) => {
                const { name, code, order } = finalRes.data || {};
                setName(name);
                setColor(code);
                setOrder(order);
            });
        } else {
           setName('');
           setColor('#2563eb');
           setOrder('');
        }
    }, [id]);

    return (
        <div className="max-w-2xl rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {id ? 'Edit Color' : 'Add New Color'}
                </h2>
            </div>
        
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    {error?.name && <span className="mb-1 block text-sm text-red-500">{error.name}</span>}
                    <label className="block mb-2 text-sm font-medium text-gray-900">Color Name</label>
                    <input
                        type="text"
                        name="colorName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Midnight Blue"
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                </div>
                
                <div>
                    {error?.code && <span className="mb-1 block text-sm text-red-500">{error.code}</span>}
                    <label className="block mb-2 text-sm font-medium text-gray-900">Pick a Color Code</label>
                    <div className=" flex items-center gap-4 ">
                        <div 
                            className="h-10 w-16 cursor-pointer rounded border border-gray-300 shadow-sm transition-transform hover:scale-105"
                            style={{ backgroundColor: color }}
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            title="Click to pick a color"
                        />
                        <span className="font-mono text-gray-700 font-medium bg-gray-50 px-3 py-1.5 rounded border border-gray-200">
                            {color.toUpperCase()}
                        </span>

                        {showColorPicker && (
                            <div className="absolute mt-2 z-50">
                                <div className="fixed inset-0" onClick={() => setShowColorPicker(false)} />
                                <div className="relative z-10 shadow-lg rounded-lg bg-white p-2">
                                    <SketchPicker 
                                        color={color} 
                                        onChange={handleColorChange} 
                                        disableAlpha={true} >

                                        </SketchPicker>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                <div>
                    {error?.order && <span className="mb-1 block text-sm text-red-500">{error.order}</span>}
                    <label className="block mb-2 text-sm font-medium text-gray-900">Sorting Order</label>
                    <input
                        type="number" 
                        name="order"
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        placeholder="e.g. 1"
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                        {id ? 'Update Color' : 'Add Color'}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => setActiveTab('viewColor')}
                        className="ml-4 rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}