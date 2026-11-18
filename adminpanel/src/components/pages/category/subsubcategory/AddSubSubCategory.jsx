import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiBaseUrl = import.meta.env.VITE_APIBASEURL || 'http://localhost:8000/api/admin/';
const baseUrl = apiBaseUrl.replace(/\/$/, '');

export default function AddSubSubCategory() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [parentData, setParentData] = useState([]);
    const [subCategoryData, setSubCategoryData] = useState([]);
    
    const [parentCategory, setParentCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [name, setName] = useState("");
    const [order, setOrder] = useState("");
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. Fetch Parent Categories
    const getParentCategory = async () => {
        try {
            const res = await axios.get(`${baseUrl}/subsubcategory/parent`);
            if (res.data.status) {
                setParentData(res.data.data);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch parent categories");
        }
    };

    // 2. Fetch Subcategories based on Parent ID (Returns data array)
    const fetchSubCategories = async (parentID) => {
        try {
            const res = await axios.get(`${baseUrl}/subsubcategory/subcategory/${parentID}`);
            if (res.data.status) {
                setSubCategoryData(res.data.data);
                return res.data.data; // Return array so getDetails can wait for it
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch subcategories");
        }
        return [];
    };

    // 3. Fetch Details for Editing
    const getDetails = async () => {
        try {
            const res = await axios.get(`${baseUrl}/subsubcategory/details/${id}`);
            if (res.data.status && res.data.data) {
                const subsub = res.data.data;

                setName(subsub.name || "");
                setOrder(subsub.order || "");

                // Safely extract string IDs whether populated or raw string
                const pId = String(subsub.parent?._id || subsub.parent || "");
                const subId = String(subsub.subcategory?._id || subsub.subcategory || "");

                setParentCategory(pId);

                // Fetch subcategories for this parent and WAIT for response
                if (pId) {
                    const subList = await fetchSubCategories(pId);
                    
                    // Match string IDs explicitly
                    const matchedSub = subList.find(item => String(item._id) === subId);
                    if (matchedSub) {
                        setSubCategory(String(matchedSub._id));
                    } else {
                        setSubCategory(subId);
                    }
                }

                if (subsub.image) {
                    const staticPath = res.data.path || "";
                    setPreviewUrl(`${staticPath}${subsub.image}`);
                }
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load sub-subcategory details");
        }
    };

    useEffect(() => {
        const initData = async () => {
            await getParentCategory();
            if (id) {
                await getDetails();
            }
        };
        initData();
    }, [id]);

    const handleParentChange = (e) => {
        const selectedParentId = e.target.value;
        setParentCategory(selectedParentId);
        setSubCategory(""); 
        if (selectedParentId) {
            fetchSubCategories(selectedParentId);
        } else {
            setSubCategoryData([]);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            toast.error("Please upload an image file (e.g., .jpg, .png, .gif).");
            setImage(null);
            setPreviewUrl(null);
            e.target.value = null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("parent", parentCategory);
        formData.append("subcategory", subCategory);
        formData.append("name", name);
        formData.append("order", order);
        
        if (image) {
            formData.append("image", image);
        }

        try {
            const url = id 
                ? `${baseUrl}/subsubcategory/update/${id}` 
                : `${baseUrl}/subsubcategory/create`;

            // Match HTTP verb to route definition: PUT for update, POST for create
            const method = id ? 'put' : 'post';

            const res = await axios[method](url, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            const finalRes = res.data;

            if (finalRes.status || res.status === 200 || res.status === 201) {
                toast.success(finalRes.message || `Sub-subcategory ${id ? 'updated' : 'created'} successfully!`);
                
                setTimeout(() => {
                    navigate('/category/subsubcategory/view'); 
                }, 2000);
            } else {
                setError(finalRes.error || null);
                toast.error(finalRes.message || `Failed to ${id ? 'update' : 'add'} sub-subcategory`);
            }
        } catch (err) {
            const message = err?.response?.data?.message || "An error occurred during submission.";
            setError(err?.response?.data?.error || null);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl rounded-lg bg-white p-6 shadow-sm">
            <ToastContainer />
            
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {id ? "Edit Sub-Subcategory" : "Add Sub-Subcategory"}
                </h2>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="grid gap-6 md:grid-cols-2">
                
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Parent Category</label>
                    <select
                        name="parent"
                        value={parentCategory}
                        onChange={handleParentChange}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select a category</option>
                        {parentData.map((obj) => (
                            <option key={obj._id} value={obj._id}>
                                {obj.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Sub Category</label>
                    <select 
                        name="subcategory"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        required
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">Select Sub Category</option>
                        {subCategoryData.map((obj) => (
                            <option key={obj._id} value={obj._id}>
                                {obj.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Sub-Subcategory Name</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="e.g. Graphic T-Shirts"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Display Order</label>
                    <input
                        type="number"
                        name="order"
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        required
                        placeholder="1"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-900">Sub-Subcategory Image</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 file:mr-4 file:border-0 file:bg-blue-700 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-blue-800"
                    />
                    
                    {previewUrl && (
                        <div className="mt-4">
                            <p className="text-xs text-gray-500 mb-1">Image Preview:</p>
                            <img src={previewUrl} alt="Preview" className="h-32 rounded border border-gray-200 object-contain p-1" />
                        </div>
                    )}
                </div>

                {error && (
                    <div className="md:col-span-2 text-sm text-red-600">
                        {typeof error === 'string' ? error : JSON.stringify(error)}
                    </div>
                )}

                <div className="md:col-span-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-md bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
                    >
                        {loading
                            ? id
                                ? "Updating..."
                                : "Saving..."
                            : id
                            ? "Edit Sub-Subcategory"
                            : "Add Sub-Subcategory"}
                    </button>
                </div>
            </form>
        </div>
    );
}