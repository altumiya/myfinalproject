"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { MdAdd, MdDeleteOutline, MdOutlineKeyboardArrowRight, MdRemove } from "react-icons/md";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { fetchCartbyId } from "@/redux/cartSlice"; 


import 'izitoast/dist/css/iziToast.min.css';
let iziToast;
if (typeof window !== 'undefined') {
  iziToast = require('izitoast');
}

export default function CartPage() {
   let dispatch = useDispatch();
   
   let cart = useSelector((myStore) => myStore.cartStore?.cart || []); 
   let total = cart.reduce((acc, obj) => acc += obj.qty * obj.productPrice, 0);

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 bg-gray-50">
      <section className="w-full mx-auto max-w-[1120px]">
        {/* Page Header */}
        <div className="grid grid-cols-1 place-items-center border-b border-gray-200 px-4 py-6 mb-4">
          <h2 className="font-playfair text-4xl font-semibold text-[#1f1f1f] sm:text-5xl">
            Shopping Cart
          </h2>
          <nav className="flex mt-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 p-3 px-6 text-sm md:space-x-2">
              <li className="font-rubik text-dark-gray hover:text-orange-dim transition-colors">
                <Link href="/">Home</Link>
              </li>
              <li className="font-rubik text-orange-dim">
                <div className="flex items-center">
                  <MdOutlineKeyboardArrowRight className="mr-2 text-gray-400" /> Shopping Cart
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {cart.length === 0 ? (
          <div className="w-full grid justify-center items-center text-center mt-12">
            <img src="/my-Order.jpg" alt="Empty Cart" className="mx-auto max-w-sm mb-6 rounded-lg" />
            <p className="text-xl text-gray-500 font-rubik">Your shopping cart is currently empty!</p>
            <Link 
              href="/product" 
              className="mt-6 inline-block rounded bg-orange-dim px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="w-full grid lg:grid-cols-[70%_25%] gap-8 items-start">
            
            {/* Cart Table Area */}
            <div className="mt-8 overflow-x-auto rounded-lg shadow-sm border border-gray-100 bg-white">
              <table className="w-full border-collapse bg-white text-sm">
                <thead className="bg-gray-50 border-b-2 border-orange-dim text-left">
                  <tr>
                    <th className="p-4 font-semibold text-gray-700 text-center">Image</th>
                    <th className="p-4 font-semibold text-gray-700">Product</th>
                    <th className="p-4 font-semibold text-gray-700 text-center">Price</th>
                    <th className="p-4 font-semibold text-gray-700 text-center">Quantity</th>
                    <th className="p-4 font-semibold text-gray-700 text-center">Total</th>
                    <th className="p-4 font-semibold text-gray-700 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((cartObj, index) => (
                    <CardData key={cartObj._id || index} item={cartObj} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Summary Sidebar */}
            <aside className="mt-8 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="font-playfair text-2xl font-semibold text-gray-900 border-b border-gray-100 pb-4">
                Order summary
              </h2>

              <div className="mt-6 space-y-4 text-sm text-gray-600 font-rubik">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{Math.round(total, 2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">₹150</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-4 text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-orange-dim">₹{Math.round(total, 2) + 150}</span>
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="mt-8 rounded-sm bg-gray-50 p-4 border border-gray-100">
                <label
                  htmlFor="coupon"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Coupon code
                </label>
                <div className="flex gap-2">
                  <input
                    id="coupon"
                    type="text"
                    placeholder="FURNITURE10"
                    className="w-full rounded-sm border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-dim focus:ring-1 focus:ring-orange-dim"
                  />
                  <button
                    type="button"
                    className="rounded-sm bg-orange-dim px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 block w-full text-center rounded-sm bg-orange-dim px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 shadow-sm"
              >
                Proceed to checkout
              </Link>

              <Link
                href={"/product"}
                className="mt-4 block text-center text-sm font-medium text-orange-dim hover:text-orange-700 transition"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}

// ==========================================
// CardData Component (Handles Individual Row Logic)
// ==========================================
function CardData({ item }) {
  let { _id, productImage, productName, productPrice, qty } = item;
  let dispatch = useDispatch(); 
  const apiBaseUrl = process.env.NEXT_PUBLIC_APIBASEURL;

  // Logic to completely remove an item from the cart
  let removeCart = () => {
    Swal.fire({
      title: "Are you sure to delete?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${apiBaseUrl}web/cart/delete-cart/${_id}`)
          .then((res) => res.data)
          .then((finalRes) => {
            if (finalRes.status) {
              dispatch(fetchCartbyId());
              Swal.fire({
                title: "Deleted!",
                text: "Your item was removed from the cart.",
                icon: "success",
                confirmButtonColor: "#f97316"
              });
            }
          })
          .catch((err) => {
             console.error("Delete error:", err);
             Swal.fire("Error", "Failed to delete item.", "error");
          });
      }
    });
  };

  // Logic to update item quantity with iziToast notifications
  let checkQty = (type) => {
    let finalQty = qty;
    
    if (type === "+") {
      finalQty = qty + 1;
    } else {
      if (qty > 1) {
        finalQty = qty - 1;
      } else {
        removeCart();
        return;
      }
    }

    axios
      .put(`${apiBaseUrl}web/cart/update-qty/${_id}`, { qty: finalQty })
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes.status) {
          dispatch(fetchCartbyId());
          // Show Success Toast
          if (iziToast) {
            iziToast.success({
              title: "Success",
              position: 'topRight',
              message: "Cart updated successfully",
            });
          }
        } else {
          // Show Error Toast if API fails logically
          if (iziToast) {
            iziToast.error({
              title: "Error",
              position: 'topRight',
              message: "Failed to update quantity.",
            });
          }
        }
      })
      .catch((err) => {
        console.error("Quantity update error:", err);
        // Show Error Toast if network fails
        if (iziToast) {
          iziToast.error({
            title: "Error",
            position: 'topRight',
            message: "Something went wrong.",
          });
        }
      });
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
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

      <td className="p-3 text-center text-gray-600 font-rubik">
        Rs. {productPrice}
      </td>

      <td className="p-3">
        <div className="flex items-center justify-center gap-3 rounded-full border border-gray-200 p-1.5 w-28 mx-auto bg-white">
          <button
            type="button"
            onClick={() => checkQty("-")}
            className="rounded-full p-1 text-gray-600 transition hover:bg-gray-100 hover:text-black"
          >
            <MdRemove />
          </button>
          <span className="min-w-6 text-center text-sm font-semibold text-gray-800 select-none">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => checkQty("+")}
            className="rounded-full p-1 text-gray-600 transition hover:bg-gray-100 hover:text-black"
          >
            <MdAdd />
          </button>
        </div>
      </td>

      <td className="p-3 text-center font-bold text-orange-dim font-rubik">
        Rs. {productPrice * qty}
      </td>

      <td className="p-3 text-center">
        <button
          onClick={removeCart}
          className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
          aria-label="Remove item"
        >
          <MdDeleteOutline className="text-2xl" />
        </button>
      </td>
    </tr>
  );
}