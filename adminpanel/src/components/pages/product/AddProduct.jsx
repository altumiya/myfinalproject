import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const defPreviewImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/No_Preview_image_2.png/1280px-No_Preview_image_2.png?_=20200726064257';

    // --- State for Image Previews ---
    const [previewImage, setPreviewImage] = useState(defPreviewImage);
    const [previewBack, setPreviewBackImage] = useState(defPreviewImage);
    const [galleryPreview, setGalleryPreview] = useState([defPreviewImage]);

    // --- State for API Data Options ---
    const [parent, setParent] = useState([]);
    const [subCategoryData, setSubCategoryData] = useState([]);
    const [subsubCategoryData, setsubSubCategoryData] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [colors, setColors] = useState([]);

    // --- State to hold fetched product data for updates ---
    const [data, setData] = useState(null);

    const apiBaseUrl = import.meta.env.VITE_APIBASEURL;
    const baseUrl = apiBaseUrl.replace(/\/$/, '');

    // --- API Calls for Dropdowns ---
    useEffect(() => {
        getParentCategory();
        getColors();
        getMaterials();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getColors = () => {
        axios.get(`${baseUrl}/product/color`)
            .then((res) => setColors(res.data.data || []))
            .catch((err) => console.error(err));
    };

    const getMaterials = () => {
        axios.get(`${baseUrl}/product/material`)
            .then((res) => setMaterials(res.data.data || []))
            .catch((err) => console.error(err));
    };

    const getParentCategory = () => {
        axios.get(`${baseUrl}/product/parent`)
            .then((res) => setParent(res.data.data || []))
            .catch((err) => console.error(err));
    };

    const getSubCategory = (parentId) => {
        if (!parentId) return setSubCategoryData([]);
        axios.get(`${baseUrl}/product/subcategory/${parentId}`)
            .then((res) => setSubCategoryData(res.data.data || []))
            .catch((err) => console.error(err));
    };

    const getsubSubCategory = (parentId) => {
        if (!parentId) return setsubSubCategoryData([]);
        axios.get(`${baseUrl}/product/subsubcategory/${parentId}`)
            .then((res) => setsubSubCategoryData(res.data.data || []))
            .catch((err) => console.error(err));
    };

    // --- Fetch Existing Data for Update ---
    useEffect(() => {
        if (id) {
            axios.get(`${baseUrl}/product/details/${id}`)
                .then((res) => res.data)
                .then((finalRes) => {
                    if (finalRes.status) {
                        setData(finalRes.data);

                        // Trigger cascade dropdowns
                        if (finalRes.data.parent?._id) getSubCategory(finalRes.data.parent._id);
                        if (finalRes.data.subCategory?._id) getsubSubCategory(finalRes.data.subCategory._id);

                        // Set image previews from server
                        setPreviewImage(finalRes.data.image ? finalRes.path + finalRes.data.image : defPreviewImage);
                        setPreviewBackImage(finalRes.data.backImage ? finalRes.path + finalRes.data.backImage : defPreviewImage);

                        if (finalRes.data.gallery && finalRes.data.gallery.length > 0) {
                            const finalGalArray = finalRes.data.gallery.map((imageName) => finalRes.path + imageName);
                            setGalleryPreview(finalGalArray);
                        } else {
                            setGalleryPreview([]);
                        }
                    }
                });
        } else {
            // Reset form if no ID
            setData(null);
            setPreviewImage(defPreviewImage);
            setPreviewBackImage(defPreviewImage);
            setGalleryPreview([defPreviewImage]);
        }
    }, [id, baseUrl]);

    // --- Form Submission using FormData ---
    const saveProduct = async (event) => {
        event.preventDefault();

        // Native FormData handles all inputs automatically using their 'name' attributes
        let formData = new FormData(event.target);

        const submitUrl = id ? `${baseUrl}/product/update/${id}` : `${baseUrl}/product/create`;

        try {
            const res = await axios.post(submitUrl, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            const finalRes = res.data;

            if (finalRes.status || res.status === 200 || res.status === 201) {
                toast.success(finalRes.message || `Product ${id ? 'updated' : 'created'} successfully!`);
                setTimeout(() => navigate('/product/view'), 2000);
            } else {
                toast.error(finalRes.message || `Failed to ${id ? 'update' : 'add'} product`);
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "An error occurred during submission.");
        }
    };

    return (
        <div className="max-w-5xl mx-auto rounded-lg bg-white p-6 shadow-sm my-8">
            <ToastContainer />
            <div className="mb-6 border-b pb-4">
                <h2 className="text-2xl font-semibold text-gray-800">{id ? "Update Product" : "Add Product"}</h2>
            </div>

            {/* IMPORTANT: Removed all individual state variables. Relies on `name` attributes and `defaultValue` */}
            <form onSubmit={saveProduct} encType="multipart/form-data" className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* --- Left Column: Image Uploads --- */}
                <div className="col-span-1 flex flex-col space-y-6">
                    {/* Front Image */}
                    <div>
                        <label className="text-sm font-medium text-gray-900 block mb-2">Front Image</label>
                        <div className="border border-gray-200 rounded-md p-2 mb-2 flex justify-center">
                            <img src={previewImage} className="h-32 object-contain" alt="Front Preview" />
                        </div>
                        <input
                            type="file"
                            name="image"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            onChange={(event) => {
                                if (event.target.files[0]) setPreviewImage(URL.createObjectURL(event.target.files[0]));
                            }}
                        />
                    </div>

                    {/* Back/Bulk Image */}
                    <div>
                        <label className="text-sm font-medium text-gray-900 block mb-2">Back Image</label>
                        <div className="border border-gray-200 rounded-md p-2 mb-2 flex justify-center">
                            <img src={previewBack} className="h-32 object-contain" alt="Back Preview" />
                        </div>
                        <input
                            type="file"
                            name="backImage"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            onChange={(event) => {
                                if (event.target.files[0]) setPreviewBackImage(URL.createObjectURL(event.target.files[0]));
                            }}
                        />
                    </div>

                    {/* Gallery Images */}
                    <div>
                        <label className="text-sm font-medium text-gray-900 block mb-2">Gallery Images</label>
                        <div className="border border-gray-200 rounded-md p-2 mb-2 flex flex-wrap gap-2 justify-center">
                            {galleryPreview.map((path, idx) => (
                                <img key={idx} src={path} className="h-32 w-32 object-cover rounded border shadow-sm" alt={`Gallery ${idx}`} />
                            ))}
                        </div>
                        <input
                            type="file"
                            multiple
                            name="gallery"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            onChange={(event) => {
                                let myArray = [];
                                for (let key in event.target.files) {
                                    if (key !== "length" && key !== "item") {
                                        myArray.push(URL.createObjectURL(event.target.files[key]));
                                    }
                                }
                                if (myArray.length > 0) setGalleryPreview(myArray);
                            }}
                        />
                    </div>
                </div>

                {/* --- Right Columns: Form Fields --- */}
                <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 h-min">

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-900">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={data?.name || ""}
                            placeholder="e.g. Classic Cotton Shirt"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-900">Parent Category</label>
                        <select
                            name="parent"
                            value={data?.parent?._id || ""}
                            onChange={(e) => {
                                // Update local mock state just to trigger cascades safely
                                setData(prev => ({ ...prev, parent: { _id: e.target.value } }));
                                getSubCategory(e.target.value);
                            }}
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select category</option>
                            {parent.map((obj) => (
                                <option key={obj._id} value={obj._id}>{obj.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-900">Sub Category</label>
                        <select
                            name="subCategory"
                            value={data?.subCategory?._id || ""}
                            onChange={(e) => {
                                setData(prev => ({ ...prev, subCategory: { _id: e.target.value } }));
                                getsubSubCategory(e.target.value);
                            }}
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select subcategory</option>
                            {subCategoryData.map((obj) => (
                                <option key={obj._id} value={obj._id}>{obj.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-900">Sub-Sub Category</label>
                        <select
                            name="subsubCategory"
                            // This forces the dropdown to re-render when the options finish loading
                            key={`subsub-${subsubCategoryData.length}`}
                            defaultValue={data?.subsubCategory?._id || ""}
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select sub-subcategory</option>
                            {subsubCategoryData.map((obj) => (
                                <option key={obj._id} value={obj._id}>{obj.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-900">
                            Material
                        </label>
                        <select
                            multiple
                            name="material"
                            // FIX: This key ensures the dropdown waits for both APIs to finish loading
                            key={`material-${data?.material?.length || 0}-${materials.length}`}

                            // React automatically matches these saved IDs to the options below
                            defaultValue={data?.material?.map(m => m._id) || []}

                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 outline-none h-24"
                        >
                            {materials.map((obj) => (
                                <option key={obj._id} value={obj._id}>
                                    {obj.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-900">
                            Select Color
                        </label>
                        <select
                            id="color"
                            name="color"
                            // FIX 1: Safely check both singular (color) and plural (colors)
                            key={`colors-${(data?.colors || data?.color)?.length || 0}-${colors.length}`}

                            // FIX 2: Check both singular and plural from your database
                            defaultValue={(data?.colors || data?.color)?.map((c) => c._id) || []}

                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 outline-none h-24"
                            multiple
                        >
                            {/* FIX 3: Removed the <option value="">Nothing Selected</option> which breaks multiple selects in React */}

                            {colors.map((obj) => (
                                <option key={obj._id} value={obj._id}>
                                    {obj.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="productType" className="text-gray-700 font-medium block mb-1">
                            Select Product Type
                        </label>
                        <select
                            id="productType"
                            name="productType"
                            key={`type-${data?.productType || 'empty'}`}
                            // FIX: Moved to defaultValue
                            defaultValue={data?.productType || ""}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                            <option value="">Nothing Selected</option>
                            {/* FIX: Removed 'selected' from options */}
                            <option value="Featured">Featured</option>
                            <option value="New Arrivals">New Arrivals</option>
                            <option value="On Sale">On Sale</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="isBestSelling" className="text-gray-700 font-medium block mb-1">
                            Is Best Selling
                        </label>
                        <select
                            id="isBestSelling"
                            name="bestSelling"
                            key={`best-${data?.bestSelling}`}
                            // FIX: Moved logic to defaultValue
                            defaultValue={data?.bestSelling === true ? "1" : data?.bestSelling === false ? "0" : ""}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                            <option value="">Nothing Selected</option>
                            {/* FIX: Removed 'selected' from options */}
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-900">
                            Is Top Rated
                        </label>
                        <select
                            name="topRated"
                            key={`top-${data?.topRated}`}
                            // FIX: Moved logic to defaultValue
                            defaultValue={data?.topRated === true || data?.topRated === "yes" ? "yes" : data?.topRated === false || data?.topRated === "no" ? "no" : ""}
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select</option>
                            {/* FIX: Removed 'selected' from options */}
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="isUpSell" className="text-gray-700 font-medium block mb-1">
                            Is UpSell
                        </label>
                        <select
                            id="isUpSell"
                            name="upSell"
                            key={`up-${data?.upSell}`}
                            // FIX: Moved logic to defaultValue
                            defaultValue={data?.upSell === true ? "1" : data?.upSell === false ? "0" : ""}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                            <option value="">Nothing Selected</option>
                            {/* FIX: Removed 'selected' from options */}
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-900">Actual Price</label>
                        <input
                            type="number"
                            name="price"
                            defaultValue={data?.price || ""}
                            placeholder="999"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-900">Sale Price</label>
                        <input
                            type="number"
                            name="salePrice"
                            defaultValue={data?.salePrice || ""}
                            placeholder="799"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-900">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            defaultValue={data?.stock || ""}
                            placeholder="50"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-900">Order</label>
                        <input
                            type="number"
                            name="order"
                            defaultValue={data?.order || ""}
                            placeholder="e.g. 1"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Description span full width of the right column */}
                    <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-900">Description</label>
                        <textarea
                            name="description"
                            rows="5"
                            defaultValue={data?.description || ""}
                            placeholder="Enter product description"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="sm:col-span-2 mt-4">
                        <button
                            type="submit"
                            className="rounded-md bg-blue-700 px-6 py-3 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 transition-colors shadow-md"
                        >
                            {id ? "Update Product" : "Create Product"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}