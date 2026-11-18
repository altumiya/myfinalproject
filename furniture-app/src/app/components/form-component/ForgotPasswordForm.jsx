"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import "izitoast/dist/css/iziToast.min.css"; 

let iziToast;
if (typeof window !== "undefined") {
  iziToast = require("izitoast");
}

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); 
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_APIBASEURL || "/api/"; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); 
    
    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${apiBaseUrl}web/auth/forgot-password`, { email });
      const data = response.data;

      if (data.status === 1) {
        if (iziToast) {
          iziToast.success({
            title: "Success",
            position: "topRight",
            // 2. FIX: Added fallback to prevent iziToast undefined crashes
            message: data.message || "Reset link sent successfully.",
          });
        }
        
        setMessage(`Password reset instructions were sent to ${email}. Redirecting to login...`);

        // setTimeout(() => {
        //   window.location.href = '/login'
        // }, 1500)
      } else {
        if (iziToast) {
          iziToast.error({
            title: "Error",
            position: "topRight",
            // FIX: Fallback in case your API sends data.msg instead of data.message
            message: data.message || data.msg || "Failed to send reset link.",
          });
        }
        setMessage(data.message || data.msg || "Failed to send reset link."); 
      }
    } catch (error) {
      if (iziToast) {
        iziToast.error({
          title: "Error",
          position: "topRight",
          message: error.response?.data?.message || error.response?.data?.msg || "Something went wrong. Please try again later.",
        });
      }
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-8 sm:p-10 lg:p-14">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <h2 className="font-playfair text-3xl font-semibold">
            Reset password
          </h2>
          <p className="mt-2 text-sm text-dark-gray">
            We’ll send a reset link to your email.
          </p>
        </div>

        {message ? (
          <div className="mb-4 rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm text-orange-dim">
            {message}
          </div>
        ) : null}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-dark-gray"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isSubmitting}
              className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-dim focus:ring-2 focus:ring-orange-dim/20 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-orange-dim px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-dim disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-dark-gray">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-orange-dim hover:text-orange-dim"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}