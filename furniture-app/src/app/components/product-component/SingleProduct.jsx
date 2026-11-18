"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { motion } from "framer-motion";
import { useParams } from 'next/navigation';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartbyId } from '@/redux/cartSlice';
import { fetchWishlist } from '@/redux/wishlistSlice';
import axios from "axios";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import ProductCard from './ProductCard'; // Assuming this is in the same folder

// --- IziToast Imports ---
import 'izitoast/dist/css/iziToast.min.css';
const MotionImage = motion(Image);
let iziToast;
if (typeof window !== 'undefined') {
  iziToast = require('izitoast');
}

// Note: keeping pdata as a prop just in case you use it for the Related Products section at the bottom
export default function SingleProduct({ pdata = [] }) {
    let { pid } = useParams(); 
    
    // --- State for Data Fetching ---
    const [product, setProduct] = useState(null);
    const [imagePath, setImagePath] = useState("");
    const [selectedImage, setSelectedImage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    let dispatch = useDispatch();
    let apiBaseUrl = process.env.NEXT_PUBLIC_APIBASEURL;

    // --- Redux Store ---
    let cart = useSelector((myStore) => myStore.cartStore?.cart || []);
    let token = useSelector((allStore) => allStore.userStore?.token || null);
    let wishlist = useSelector((myStore) => myStore.wishlistStore?.items || []);

    // Check if current loaded product is in cart/wishlist
    let checkItemInCart = product ? cart.find((obj) => obj.productId === product._id) : false;
    let isWishlisted = product ? wishlist.some((obj) => obj.productId === product._id) : false;

    // --- Fetch Single Product ---
    useEffect(() => {
        if (pid) {
            // Hitting your newly configured web route
            axios.get(`${apiBaseUrl}web/product/details/${pid}`)
                .then((res) => {
                    if (res.data.status) {
                        setProduct(res.data.data);
                        setImagePath(res.data.path);
                        setSelectedImage(res.data.data.image);
                    }
                })
                .catch((err) => console.error("Error fetching product details:", err))
                .finally(() => setIsLoading(false));
        }
    }, [pid, apiBaseUrl]);

    // --- Add To Cart Logic ---
    let addtoCartItem = () => {
        let cartObj = {
            productName: product.name,
            productPrice: product.salePrice || product.price,
            productId: product._id,
            productImage: imagePath + product.image,
            qty: 1,
            productCategory: product.parent?.name || "Uncategorized"
        };

        if (token && token !== "null" && token !== "undefined") {
            axios.post(`${apiBaseUrl}web/cart/add-to-cart`, cartObj, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => res.data)
            .then((finalRes) => {
                if (finalRes.status) {
                    dispatch(fetchCartbyId());
                    if (iziToast) iziToast.success({ title: "Success", position: 'topRight', message: "Item Added in Cart" });
                }
            });
        } else {
            if (iziToast) iziToast.error({ title: "Error", position:'topRight', message: "Please login to add items to cart" });
        }
    };

    // --- Remove From Cart Logic ---
    let removeCart = () => {
        if (checkItemInCart) {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#f97316", // matches orange-dim
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete(`${apiBaseUrl}web/cart/delete-cart/${checkItemInCart._id}`)
                        .then((res) => {
                            if (res.data.status) {
                                dispatch(fetchCartbyId());
                                Swal.fire("Deleted!", "Your item has been deleted.", "success");
                            }
                        })
                        .catch((err) => console.error("Error removing item", err));
                }
            });
        }
    };

    // --- Wishlist Toggle Logic ---
    let toggleWishlistItem = () => {
        if (token && token !== "null" && token !== "undefined") {
            let wishlistObj = {
                productName: product.name,
                productPrice: product.salePrice || product.price,
                productId: product._id,
                productImage: imagePath + product.image,
                productCategory: product.parent?.name || "Uncategorized"
            };

            axios.post(`${apiBaseUrl}web/wishlist/toggle`, wishlistObj, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => res.data)
            .then((finalRes) => {
                if (finalRes.status) {
                    dispatch(fetchWishlist()); 
                    if (finalRes.action === "added") {
                        if (iziToast) iziToast.success({ title: "Success", position: 'topRight', message: "Added to wishlist!" });
                    } else {
                        if (iziToast) iziToast.info({ title: "Removed", position: 'topRight', message: "Removed from wishlist." });
                    }
                }
            })
            .catch((err) => console.log(err));
        } else {
            if (iziToast) iziToast.error({ title: "Error", position: 'topRight', message: "Please login to add to wishlist" });
        }
    };

    // --- Loading & Error States ---
    if (isLoading) return <div className="min-h-screen flex items-center justify-center font-rubik text-xl text-gray-500">Loading Product...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center font-rubik text-xl text-gray-500">Product Not Found</div>;

    return (
        <>
            <div className="min-h-screen bg-white font-rubik" key={product._id}>
                
                {/* Header / Breadcrumb */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className='grid grid-cols-1 place-items-center border-b border-gray-200 px-4 py-6 motion-reduce:!transform-none'
                >
                    <h2 className='font-playfair font-semibold text-4xl'>{product.name}</h2>
                    <nav className="flex mt-3" aria-label="Breadcrumb">
                        <ol className="p-3 px-6 inline-flex items-center space-x-1 md:space-x-2">
                            <li className='inline-flex items-center font-rubik text-dark-gray text-sm'>
                                <Link href={"/"}>Home</Link>
                                <MdOutlineKeyboardArrowRight className='ml-2 mr-2' /> {product.parent?.name || 'Category'}
                            </li>
                            <li className='font-rubik text-orange-dim text-sm'> 
                                <div className="flex items-center">
                                    <MdOutlineKeyboardArrowRight className='mr-2' /> {product.name}
                                </div>
                            </li> 
                        </ol>
                    </nav>
                </motion.div>

                {/* Main Product Section */}
                <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-2 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        
                        {/* Product Image Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -18 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col gap-4 motion-reduce:!transform-none"
                        >
                            <div className="bg-gray-100 rounded-lg overflow-hidden h-96 md:h-[500px] flex items-center justify-center relative group border border-gray-100">
                                <MotionImage
                                    key={selectedImage}
                                    src={imagePath + selectedImage} 
                                    alt={product.name}
                                    width={1200}
                                    height={1200}
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    unoptimized={imagePath.startsWith("http://localhost:")}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                            </div>
                            
                            {/* Image Thumbnails (Dynamically mapped if gallery exists) */}
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                <motion.button
                                    type="button"
                                    onClick={() => setSelectedImage(product.image)}
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={{ duration: 0.16 }}
                                    className={`w-20 h-20 bg-gray-200 border-2 rounded-lg cursor-pointer flex-shrink-0 ${selectedImage === product.image ? "border-orange-dim" : "border-transparent hover:border-orange-dim"}`}
                                    aria-label="Show main product image"
                                >
                                    <Image
                                        src={imagePath + product.image}
                                        alt={`${product.name} thumbnail`}
                                        width={80}
                                        height={80}
                                        sizes="80px"
                                        unoptimized={imagePath.startsWith("http://localhost:")}
                                        className="h-full w-full rounded-lg object-cover"
                                    />
                                </motion.button>
                                {product.gallery?.map((imgStr, idx) => (
                                    <motion.button
                                        type="button"
                                        key={imgStr || idx}
                                        onClick={() => setSelectedImage(imgStr)}
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.97 }}
                                        transition={{ duration: 0.16 }}
                                        className={`w-20 h-20 bg-gray-200 rounded-lg cursor-pointer border-2 transition flex-shrink-0 ${selectedImage === imgStr ? "border-orange-dim" : "border-transparent hover:border-orange-dim"}`}
                                        aria-label={`Show gallery image ${idx + 1}`}
                                    >
                                        <Image
                                            src={imagePath + imgStr}
                                            alt={`${product.name} gallery image ${idx + 1}`}
                                            width={80}
                                            height={80}
                                            sizes="80px"
                                            unoptimized={imagePath.startsWith("http://localhost:")}
                                            className="h-full w-full rounded-lg object-cover"
                                        />
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Product Details Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 18 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col gap-4 motion-reduce:!transform-none"
                        >
                            <div>
                                <h1 className="text-2xl font-bold font-playfair text-gray-900 mb-2">
                                    {product.name}
                                </h1>
                            </div>

                            {/* Pricing */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-baseline gap-2">
                                    {product.salePrice && product.salePrice < product.price && (
                                        <span className="text-md text-gray-400 line-through">
                                            Rs. {product.price}
                                        </span>
                                    )}
                                    <span className="text-xl font-bold text-orange-dim">
                                        Rs. {product.salePrice || product.price}
                                    </span>
                                </div>
                                {product.salePrice && product.salePrice < product.price && (
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-semibold">
                                        Save ₹{product.price - product.salePrice}
                                    </span>
                                )}
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center gap-2">
                                {product.stock > 0 ? (
                                    <>
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        <span className="text-green-700 text-sm font-semibold">In Stock ({product.stock} available)</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                                        <span className="text-red-700 text-sm font-semibold">Out of Stock</span>
                                    </>
                                )}
                            </div>

                            {/* Short Description */}
                            <p className="text-dark-gray leading-7 text-sm font-rubik line-clamp-3">
                                {product.description}
                            </p>

                            {/* Features / Attributes */}
                            <div className="rounded-lg mt-2">
                                <ul className='leading-7 text-sm font-rubik text-dark-gray'>
                                    <li><span className="font-semibold text-gray-700">Category:</span> {product.parent?.name || 'N/A'}</li>
                                    {product.color?.length > 0 && <li><span className="font-semibold text-gray-700">Color:</span> {product.color.map((color) => color.name).filter(Boolean).join(", ")}</li>}
                                    {product.material?.length > 0 && <li><span className="font-semibold text-gray-700">Material:</span> {product.material.map((material) => material.name).filter(Boolean).join(", ")}</li>}
                                    <li><span className="font-semibold text-gray-700">Est. Delivery:</span> 5-7 Business Days</li>
                                </ul>
                            </div>

                            {/* Actions (Add to Cart / Wishlist) */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 mt-auto">
                                {checkItemInCart ? (
                                    <button 
                                        className="cursor-pointer flex-1 bg-dark-gray text-white rounded-sm px-4 py-3 hover:bg-black transition duration-300"
                                        onClick={removeCart}
                                    >
                                        Remove from Cart
                                    </button>
                                ) : (
                                    <button 
                                        className={`cursor-pointer flex-1 text-white rounded-sm px-4 py-3 transition duration-300 ${product.stock > 0 ? 'bg-orange-dim hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'}`}
                                        onClick={product.stock > 0 ? addtoCartItem : null}
                                        disabled={product.stock <= 0}
                                    >
                                        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                    </button>
                                )}

                                <button 
                                    onClick={toggleWishlistItem}
                                    className={`px-4 py-3 border-2 rounded transition duration-300 flex items-center justify-center ${isWishlisted ? 'border-red-500 bg-red-50' : 'border-orange-dim text-orange-dim hover:bg-orange-dim hover:text-white'}`}
                                >
                                    {isWishlisted ? (
                                        <FaHeart className="text-red-500 text-xl" />
                                    ) : (
                                        <FaRegHeart className="text-xl" />
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
                
                {/* Full Description Section */}
                <div className="bg-white px-4 sm:px-6 lg:px-8 py-2">
                    <div className="max-w-[1120px] mx-auto">
                        <h2 className="text-2xl font-bold font-playfair text-orange-dim mb-2 border-b border-gray-200 pb-3">
                            Description
                        </h2>
                        <p className="text-dark-gray leading-7 text-sm font-rubik whitespace-pre-wrap">
                            {product.description}
                        </p>
                    </div>
                </div>
                
                {/* Related Products Section */}
                {/* Keeping your original related products logic here if pdata is still passed down */}
                {pdata && pdata.length > 0 && (
                    <div className="bg-white px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100 mt-8">
                        <div className="max-w-[1120px] mx-auto">
                            <h2 className="text-2xl font-bold font-playfair text-gray-900 mb-8">
                                Related Products
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {pdata
                                    .filter(item => [6,10,15,19].includes(item.id)) // Your custom filter
                                    .map((products, index) => (
                                        <ProductCard key={index} productData={products} /> 
                                    ))
                                }
                            </div> 
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
