import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function AddSlider() {
    const { id } = useParams();
    const navigate = useNavigate();

    const defPreviewImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/No_Preview_image_2.png/1280px-No_Preview_image_2.png?_=20200726064257';

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(defPreviewImage);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const apiBaseUrl = import.meta.env.VITE_APIBASEURL || 'http://localhost:8000/api/admin/';
    const baseUrl = apiBaseUrl.replace(/\/$/, '');

    // --- Fetch Existing Data for Update ---
    useEffect(() => {
        if (id) {
            axios.get(`${baseUrl}/slider/details/${id}`)
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

    // Updated handleFileChange for image preview and validation
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith("image/")) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            toast.error("Please upload an image file (e.g., .jpg, .png, .gif).");
            setFile(null);
            setPreviewUrl(data?.image ? data.path + data.image : defPreviewImage);
            e.target.value = null; // Clear the input if not an image
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const submitUrl = id ? `${baseUrl}/slider/update/${id}` : `${baseUrl}/slider/create`;

        try {
            const res = await axios.post(submitUrl, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            const finalRes = res.data;

            if (finalRes.status || res.status === 200 || res.status === 201) {
                setError(null);
                toast.success(finalRes.message || `Slider ${id ? 'updated' : 'added'} successfully`);
                setTimeout(() => {
                    navigate('/sliders/view');
                }, 2000);
            } else {
                setError(finalRes.error || null);
                toast.error(finalRes.message || `Failed to ${id ? 'update' : 'add'} slider`);
            }
        } catch (err) {
            const message = err?.response?.data?.message || `Failed to ${id ? 'update' : 'add'} slider`;
            setError(err?.response?.data?.error || null);
            toast.error(message);
        }
    };
   

    return (
        <div className="max-w-3xl rounded-lg bg-white p-6 shadow-sm mx-auto my-8">
            <ToastContainer />
            <div className="mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-900">{id ? "Update Slider" : "Add Slider"}</h2>
            </div>

            <form key={data ? data._id : 'new-form'} onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Slider Title</label>
                    <input
                        type="text"
                        name="name"
                        defaultValue={data?.name || ""}
                        placeholder="e.g. New Summer Collection"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 outline-none"
                        required
                    />
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

                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-900">Slider Image</label>
                    
                    {/* Consistent Image Preview Box */}
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
                        required={!id} // Required only when adding a new slider
                    />
                </div>

                <div className="md:col-span-2">
                    <button
                        type="submit"
                        className="rounded-md bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 transition-colors"
                    >
                        {id ? "Update Slider" : "Save Slider"}
                    </button>
                </div>
            </form>
        </div>
    );
}