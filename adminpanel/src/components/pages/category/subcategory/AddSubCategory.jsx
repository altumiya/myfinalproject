import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddSubCategory() {
    // --- State Management ---
    const [parentCategories, setParentCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [order, setOrder] = useState("");
    const [file, setFile] = useState(null);
    const [existingImage, setExistingImage] = useState("");
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [errors, setErrors] = useState(null);

    // --- Router Params & Setup ---
    const { id } = useParams(); // Fetch ID from URL path (e.g., /subcategory/edit/:id)
    const navigate = useNavigate();

    const apiBaseUrl = import.meta.env.VITE_APIBASEURL || "http://localhost:8000/api/admin/";
    const baseUrl = apiBaseUrl.replace(/\/$/, "");
    const staticPath = import.meta.env.VITE_STATIC_PATH || "http://localhost:8000/uploads/subcategory/";

    // --- API Fetch: Parent Categories & Subcategory Details ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                setFetchingData(true);

                // 1. Fetch active parent categories
                const parentRes = await axios.get(`${baseUrl}/subcategory/parent`);
                if (parentRes.data?.status && parentRes.data?.data) {
                    setParentCategories(parentRes.data.data);
                }

                // 2. Fetch existing subcategory details if ID exists
                if (id) {
                    const detailRes = await axios.get(`${baseUrl}/subcategory/details/${id}`);
                    if (detailRes.data?.status && detailRes.data?.data) {
                        const data = detailRes.data.data;
                        setCategoryName(data.name || "");
                        setOrder(data.order || "");
                        // Handle parent populated as object or string ID
                        setParentCategory(typeof data.parent === "object" ? data.parent._id : data.parent || "");
                        if (data.image) {
                            setExistingImage(data.image);
                        }
                    }
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load subcategory data");
            } finally {
                setFetchingData(false);
            }
        };

        fetchData();

        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [id]);

    // --- Image Preview Handler ---
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith("image/")) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            toast.error("Please upload a valid image file.");
            setFile(null);
            setPreviewUrl(null);
            e.target.value = null;
        }
    };

    // --- Form Submission Handler ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors(null);

        const formData = new FormData();
        formData.append("parent", parentCategory);
        formData.append("name", categoryName);
        formData.append("order", order);
        if (file) {
            formData.append("image", file);
        }

        try {
            const endpoint = id
                ? `${baseUrl}/subcategory/update/${id}`
                : `${baseUrl}/subcategory/create`;

            const res = await axios.post(endpoint, formData);

            if (res.data?.status) {
                toast.success(res.data.message || (id ? "Subcategory updated successfully" : "Subcategory added successfully"));
                setTimeout(() => {
                    navigate("/category/subcategory/view");
                }, 1500);
            }
        } catch (err) {
            const responseData = err?.response?.data;
            const message = responseData?.message || (id ? "Failed to update subcategory" : "Failed to add subcategory");

            if (responseData?.error) {
                setErrors(responseData.error);
            }

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (fetchingData) {
        return <div className="p-6 text-gray-600">Loading subcategory details...</div>;
    }

    return (
        <div className="max-w-3xl rounded-lg bg-white p-6 shadow-sm">
            <ToastContainer />

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {id ? "Edit SubCategory" : "Add SubCategory"}
                </h2>
            </div>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="grid gap-6 md:grid-cols-2">
                {/* Parent Category */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Parent Category</label>
                    <select
                        name="parent"
                        value={parentCategory}
                        onChange={(e) => setParentCategory(e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select a category</option>
                        {parentCategories.map((obj) => (
                            <option key={obj._id} value={obj._id}>
                                {obj.name}
                            </option>
                        ))}
                    </select>
                    {errors?.parent && <p className="mt-1 text-xs text-red-600">{errors.parent}</p>}
                </div>

                {/* Subcategory Name */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Sub Category Name</label>
                    <input
                        type="text"
                        name="name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="e.g. Men Fashion"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                    {errors?.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>

                {/* Display Order */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Display Order</label>
                    <input
                        type="number"
                        name="order"
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        placeholder="1"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                    {errors?.order && <p className="mt-1 text-xs text-red-600">{errors.order}</p>}
                </div>

                {/* File Upload */}
                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-900">Sub Category Image</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 file:mr-4 file:border-0 file:bg-blue-700 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-blue-800"
                    />

                    {/* New Image Preview vs. Existing Stored Image */}
                    <div className="mt-4 flex items-center gap-4">
                        {previewUrl ? (
                            <div>
                                <p className="mb-1 text-xs text-gray-500">New Image Preview:</p>
                                <img src={previewUrl} alt="New Preview" className="h-32 rounded border border-gray-200 object-contain p-1" />
                            </div>
                        ) : existingImage ? (
                            <div>
                                <p className="mb-1 text-xs text-gray-500">Current Image:</p>
                                <img src={`${staticPath}${existingImage}`} alt="Current" className="h-32 rounded border border-gray-200 object-contain p-1" />
                            </div>
                        ) : null}
                    </div>
                    {errors?.image && <p className="mt-1 text-xs text-red-600">{errors.image}</p>}
                </div>

                {/* Errors render */}
                {errors && typeof errors === "string" && (
                    <div className="md:col-span-2 text-sm text-red-600">{errors}</div>
                )}

                {/* Submit Button */}
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
                                ? "Update Sub-Subcategory"
                                : "Add Sub-Subcategory"}
                    </button>

                </div>
            </form>
        </div>
    );
}