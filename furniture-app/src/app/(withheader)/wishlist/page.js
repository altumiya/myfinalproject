"use client"
import Link from 'next/link';
import React, { useEffect } from 'react'
import { MdDeleteOutline, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
import axios from "axios";

import { fetchWishlist } from '@/redux/wishlistSlice';
import { fetchCartbyId } from '@/redux/cartSlice';

import 'izitoast/dist/css/iziToast.min.css';
let iziToast;
if (typeof window !== 'undefined') {
  iziToast = require('izitoast');
}

export default function WishlistPage() {
  let dispatch = useDispatch();
  
  let wishlist = useSelector((store) => store.wishlistStore?.items || []);
  let token = useSelector((store) => store.userStore?.token);

  useEffect(() => {
    if (token && token !== "null" && token !== "undefined") {
      dispatch(fetchWishlist());
    }
  }, [token, dispatch]);

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full mx-auto max-w-[1120px]">
        <div className="grid grid-cols-1 place-items-center border-b border-gray-200 px-4 py-6 mb-6">
          <h2 className="font-playfair text-4xl font-semibold text-[#1f1f1f] sm:text-5xl">
            Wishlist
          </h2>
          <nav className="flex mt-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 p-3 px-6 text-sm md:space-x-2">
              <li className="font-rubik text-dark-gray hover:text-orange-dim transition-colors">
                <Link href="/">Home</Link>
              </li>
              <li className="font-rubik text-orange-dim">
                <div className="flex items-center">
                  <MdOutlineKeyboardArrowRight className="mr-2 text-gray-400" /> Wishlist
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {wishlist.length === 0 ? (
          <div className="w-full grid justify-center items-center text-center mt-12">
            <img src="/wishlist-Empty.jpg" alt="Empty Wishlist" className="mx-auto max-w-sm mb-6 rounded-lg" />
            <p className="text-xl text-gray-500 font-rubik">Your wishlist is empty!</p>
            <Link 
              href="/product" 
              className="mt-6 inline-block rounded bg-orange-dim px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-100 bg-white">
            <table className="w-full border-collapse bg-white text-sm">
              <thead className="bg-gray-50 border-b-2 border-orange-dim text-left">
                <tr>
                  <th className="p-4 font-semibold text-gray-700 text-center">Remove</th>
                  <th className="p-4 font-semibold text-gray-700 text-center">Image</th>
                  <th className="p-4 font-semibold text-gray-700">Product</th>
                  <th className="p-4 font-semibold text-gray-700 text-center">Price</th>
                  <th className="p-4 font-semibold text-gray-700 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {wishlist.map((wishlistObj, index) => (
                  <WishlistCard key={wishlistObj._id || index} item={wishlistObj} token={token} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function WishlistCard({ item, token }) {
  let { _id, productId, productImage, productName, productPrice, productCategory } = item;
  
  let dispatch = useDispatch(); 
  let cart = useSelector((store) => store.cartStore?.cart || []); 
  const apiBaseUrl = process.env.NEXT_PUBLIC_APIBASEURL;

  let checkItemInCart = cart.find((obj) => obj.productId === productId);

  let addtoCartItem = () => {
    let cartObj = {
      productName,
      productPrice,
      productId,
      productImage,
      qty: 1,
      productCategory: productCategory || "General"
    };

    if (token) {
      axios.post(`${apiBaseUrl}web/cart/add-to-cart`, cartObj, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes.status) {
          dispatch(fetchCartbyId());
          if (iziToast) iziToast.success({ title: "Success", position: 'topRight', message: "Item Added to Cart" });
        }
      })
      .catch((err) => console.log(err));
    } else {
      if (iziToast) iziToast.error({ title: "Error", position: 'topRight', message: "Please login first" });
    }
  }

  let removeCart = () => {
    if (checkItemInCart) {
      axios.delete(`${apiBaseUrl}web/cart/delete-cart/${checkItemInCart._id}`)
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes.status) {
          dispatch(fetchCartbyId());
          if (iziToast) iziToast.success({ title: "Removed", position: 'topRight', message: "Removed from Cart" });
        }
      })
      .catch((err) => console.log(err));
    }
  }

  let removeWishlist = () => {
    Swal.fire({
      title: "Remove from wishlist?",
      text: "You can add it back later.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`${apiBaseUrl}web/wishlist/toggle`, { productId }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          if (res.data.status) {
            dispatch(fetchWishlist()); // Refresh wishlist
            Swal.fire("Removed!", "Item removed from wishlist.", "success");
          }
        })
        .catch((err) => {
          console.error(err);
          Swal.fire("Error", "Failed to remove item.", "error");
        });
      }
    });
  }

  return(
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="p-3 text-center">
        <button
          onClick={removeWishlist}
          className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
          aria-label="Remove from Wishlist"
        >
          <MdDeleteOutline className="text-2xl mx-auto" />
        </button>
      </td>
      <td className="p-3 text-center">
        <div className="w-20 h-20 mx-auto rounded overflow-hidden border border-gray-200">
          <img
            src={productImage}
            alt={productName}
            className="w-full h-full object-cover"
          />
        </div>
      </td>

      <td className="p-3 font-medium text-gray-800">{productName}</td>

      <td className="p-3 text-center text-gray-600 font-rubik">Rs. {productPrice}</td>

      <td className="p-3 text-center">
        {checkItemInCart ? (
          <button 
            className="cursor-pointer text-sm font-semibold rounded bg-gray-200 text-gray-700 px-4 py-2 hover:bg-gray-300 transition-colors w-36"
            onClick={removeCart}
          >
            Remove from Cart
          </button>
        ) : (
          <button 
            className="cursor-pointer text-sm font-semibold rounded bg-orange-dim text-white px-4 py-2 hover:bg-orange-600 transition-colors w-36"
            onClick={addtoCartItem}
          >
            Add to Cart
          </button>
        )}
      </td>
    </tr>
  )
}