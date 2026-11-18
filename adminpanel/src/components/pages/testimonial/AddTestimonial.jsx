import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FaPlus, FaSave } from 'react-icons/fa';

export default function AddTestimonial() {
    const { id } = useParams();
    const navigate = useNavigate();

    const defPreviewImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/No_Preview_image_2.png/1280px-No_Preview_image_2.png?_=20200726064257';

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(defPreviewImage);
    const [data, setData] = useState(null);

    const apiBaseUrl = import.meta.env.VITE_APIBASEURL || 'http://localhost:8000/api/admin/';
    const baseUrl = apiBaseUrl.replace(/\/$/, '');

    // --- Fetch Existing Data for Update ---
    useEffect(() => {
        if (id) {
            axios.get(`${baseUrl}/testimonial/details/${id}`)
                .then((res) => res.data)
                .then((finalRes) => {
                    if (finalRes.status) {
                        setData(finalRes.data);
                        setPreviewUrl(finalRes.data.image ? finalRes.path + finalRes.data.image : defPreviewImage);
                    }
                })
                .catch((err) => console.error(err));
        } else {
            setData(null);
            setPreviewUrl(defPreviewImage);
        }
    }, [id, baseUrl]);

    // Image preview and validation handler
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith("image/")) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            toast.error("Please upload a valid image file (e.g., .jpg, .png, .gif).");
            setFile(null);
            setPreviewUrl(data?.image ? data.path + data.image : defPreviewImage);
            e.target.value = null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const submitUrl = id ? `${baseUrl}/testimonial/update/${id}` : `${baseUrl}/testimonial/create`;

        try {
            const res = await axios.post(submitUrl, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            const finalRes = res.data;

            if (finalRes.status || res.status === 200 || res.status === 201) {
                toast.success(finalRes.message || `Testimonial ${id ? 'updated' : 'added'} successfully`);
                setTimeout(() => {
                    navigate('/testimonial/view');
                }, 2000);
            } else {
                toast.error(finalRes.message || `Failed to ${id ? 'update' : 'add'} testimonial`);
            }
        } catch (err) {
            const message = err?.response?.data?.message || `Failed to ${id ? 'update' : 'add'} testimonial`;
            toast.error(message);
        }
    };

    return (
        <div className="max-w-2xl rounded-lg bg-white p-6 shadow-sm mx-auto my-8">
            <ToastContainer />
            <div className="mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-900">{id ? "Update Testimonial" : "Add Testimonial"}</h2>
                <p className="mt-1 text-sm text-gray-500">
                    {id ? "Update the customer testimonial details below." : "Create a new customer testimonial."}
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                    <input
                        type="text"
                        name="name"
                        defaultValue={data?.name || ""}
                        placeholder="e.g. John Doe"
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">Designation</label>
                    <input
                        type="text"
                        name="designation"
                        defaultValue={data?.designation || ""}
                        placeholder="e.g. CEO, Manager"
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">Message</label>
                    <textarea
                        name="message"
                        defaultValue={data?.message || ""}
                        placeholder="Enter customer testimonial..."
                        rows="5"
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">Rating</label>
                    <select
                        name="rating"
                        key={data?.rating || "default"} // Forces select re-render when data populates
                        defaultValue={data?.rating || "5"}
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
                    >
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Display Order</label>
                    <input
                        type="number"
                        name="order"
                        defaultValue={data?.order || ""}
                        placeholder="1"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Testimonial Image</label>
                    
                    {/* Image Preview Box */}
                    <div className="border border-gray-200 rounded-md p-2 mb-3 flex justify-center bg-gray-50">
                        <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="h-32 object-contain" 
                        />
                    </div>

                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 file:mr-4 file:border-0 file:bg-blue-700 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-blue-800"
                        required={!id} // Require image only when adding
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 transition-colors"
                    >
                        {id ? <FaSave /> : <FaPlus />}
                        {id ? "Update Testimonial" : "Save Testimonial"}
                    </button>
                </div>
            </form>
        </div>
    );
}