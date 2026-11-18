import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoPencil, IoTrash, IoArrowBack } from "react-icons/io5";
import { Link, useParams, useNavigate } from "react-router-dom"; // Fixed import to react-router-dom

export default function ProductDetails() {
  let { id } = useParams();
  const navigate = useNavigate();

  // Initialize as null since we expect an object, not an array
  let [data, setData] = useState(null); 
  let [path, setPath] = useState("");
  
  let apiBaseUrl = import.meta.env.VITE_APIBASEURL;
  const baseUrl = apiBaseUrl ? apiBaseUrl.replace(/\/$/, '') : 'http://localhost:8000/api/admin';

  useEffect(() => {
    if (id) {
      axios
        .get(`${baseUrl}/product/details/${id}`) // Ensure slash is present
        .then((res) => res.data)
        .then((finalRes) => {
          if (finalRes.status) {
            setData(finalRes.data);
            setPath(finalRes.path);
          }
        })
        .catch((err) => console.error("Error fetching details:", err));
    }
  }, [id, baseUrl]);

  const handleDelete = () => {
    if(window.confirm("Are you sure you want to delete this product?")) {
        axios.delete(`${baseUrl}/product/delete/${id}`)
            .then(res => res.data)
            .then(finalRes => {
                if(finalRes.status) {
                    navigate('/product/view');
                }
            })
            .catch(err => console.error("Error deleting:", err));
    }
  };

  // Calculate discount percentage safely
  const calculateDiscount = (price, salePrice) => {
    if (!price || !salePrice || price <= salePrice) return 0;
    return Math.round(((price - salePrice) / price) * 100);
  };

  if (!data) {
    return <div className="p-6 bg-white rounded-lg shadow-md text-center">Loading product details...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Header Section */}
      <div>
        <div className="mb-6 pb-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Product Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Home / Products / {data.name}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/product/view">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200">
                <IoArrowBack className="text-lg" />
                Back
              </button>
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 transition-colors duration-200">
              <IoPencil className="text-lg" />
              Edit
            </button>
            <button 
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              <IoTrash className="text-lg" />
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images */}
          <div className="lg:col-span-1">
            {/* Main Image */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center min-h-[20rem]">
              {data.image ? (
                <img
                    src={path + data.image}
                    alt={data.name}
                    className="w-full h-80 object-cover"
                />
              ) : (
                <span className="text-gray-400">No Image Available</span>
              )}
            </div>

            {/* Front / Back */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Front Image
                </p>
                <img
                  src={data.image ? path + data.image : 'https://via.placeholder.com/150?text=No+Front'}
                  alt="Front thumbnail"
                  className="h-24 w-full object-cover rounded-md border border-gray-200 bg-gray-50"
                />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Back Image
                </p>
                <img
                  src={data.backImage ? path + data.backImage : 'https://via.placeholder.com/150?text=No+Back'}
                  alt="Back thumbnail"
                  className="h-24 w-full object-cover rounded-md border border-gray-200 bg-gray-50"
                />
              </div>
            </div>

            {/* Gallery */}
            {data.gallery && data.gallery.length > 0 && (
                <div className="mt-6">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Gallery
                </p>
                <div className="grid grid-cols-4 gap-2">
                    {data.gallery.map((src, index) => (
                        <img 
                            key={index} 
                            src={path + src} 
                            alt={`Gallery ${index + 1}`} 
                            className="h-16 w-full object-cover rounded-md border border-gray-200 bg-gray-50"
                        />
                    ))}
                </div>
                </div>
            )}
          </div>

          {/* Right Column - Info */}
          <div className="lg:col-span-2">
            {/* Name + Status */}
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold text-gray-800">
                {data.name}
              </h3>
              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${data.status !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {data.status !== false ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Price Row */}
            <div className="mt-4 flex items-center gap-4">
              <span className="text-2xl font-bold text-gray-900">
                ₹ {data.salePrice || data.price}
              </span>
              {data.salePrice && data.salePrice < data.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                        ₹ {data.price}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold rounded-md bg-red-100 text-red-800">
                        {calculateDiscount(data.price, data.salePrice)}% OFF
                    </span>
                  </>
              )}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actual Price
                </p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  ₹ {data.price || 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sale Price
                </p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {data.salePrice ? `₹ ${data.salePrice}` : 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </p>
                <p className={`mt-1 text-lg font-semibold ${data.stock <= 10 ? 'text-red-600' : 'text-gray-900'}`}>
                  {data.stock || 0}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Priority
                </p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{data.order || 0}</p>
              </div>
            </div>

            {/* Categories */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
                Category Details
              </h4>
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parent Category
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{data.parent?.name || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sub Category
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{data.subCategory?.name || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sub Sub Category
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{data.subsubCategory?.name || 'N/A'}</dd>
                </div>
              </dl>
            </div>

            {/* Attributes */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
                Attributes
              </h4>

              {/* Colors */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Colors
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {data.color && data.color.length > 0 ? (
                      data.color.map((item) => (
                        <span
                          key={item._id}
                          className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                        >
                          {item.name}
                        </span>
                      ))
                  ) : (
                      <span className="text-sm text-gray-500">No colors specified</span>
                  )}
                </div>
              </div>

              {/* Material */}
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Material
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {data.material && data.material.length > 0 ? (
                      data.material.map((item) => (
                        <span
                          key={item._id}
                          className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800"
                        >
                          {item.name}
                        </span>
                      ))
                  ) : (
                    <span className="text-sm text-gray-500">No materials specified</span>
                  )}
                </div>
              </div>
            </div>

            {/* Flags */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
                Product Settings
              </h4>
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Type
                  </dt>
                  <dd className="mt-1">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {data.productType || 'Standard'}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Best Selling
                  </dt>
                  <dd className="mt-1">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${data.bestSelling ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {data.bestSelling ? 'Yes' : 'No'}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Up Sell
                  </dt>
                  <dd className="mt-1">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${data.upSell ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}>
                      {data.upSell ? 'Yes' : 'No'}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(data.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Description */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
                Description
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">
                {data.description || 'No description provided.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}