"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useState } from "react";
import "izitoast/dist/css/iziToast.min.css";

// Conditionally load iziToast only on the client side
let iziToast;
if (typeof window !== "undefined") {
  iziToast = require("izitoast");
}

export default function ResetPasswordForm() {
  const { id } = useParams();
  const apiBaseUrl = process.env.NEXT_PUBLIC_APIBASEURL;

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      setMessage("Please fill in both password fields.");
      return;
    }

    if (formData.password?.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    axios
      .post(`${apiBaseUrl}web/auth/reset-password/${id}`, {
        password: formData.password,
      })
      .then((response) => {
        if (response.data.status == 1) {
          if (iziToast) {
            iziToast.success({
              title: "Success",
              message: response.data.message || "Password reset successfully",
              position: "topRight",
            });
          }

          setFormData({ password: "", confirmPassword: "" });
          setMessage(""); 
          
          setTimeout(() => {
            window.location.href = "/login";
          }, 1500);
        } else {
          if (iziToast) {
            iziToast.error({
              title: "Error",
              // FIX: Safely fallback so iziToast never gets 'undefined'
              message: response.data.message || response.data.msg || "Failed to reset password.",
              position: "topRight",
            });
          }
        }
      })
      .catch((error) => {
        console.error("Error resetting password:", error);
        
        // Also ensure catch block handles iziToast safely
        if (iziToast) {
            iziToast.error({
              title: "Error",
              message: error.response?.data?.message || error.response?.data?.msg || "Network or server error.",
              position: "topRight",
            });
        }
        setMessage("Failed to reset password.");
      });
  };

  return (
    <div className="flex flex-1 items-center justify-center p-8 sm:p-10 lg:p-14">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <h2 className="font-playfair text-3xl font-semibold text-[#1f1f1f]">
            New password
          </h2>
          <p className="mt-2 text-sm text-dark-gray">
            Enter and confirm your new password.
          </p>
        </div>

        {message ? (
          <div className="mb-4 rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm text-orange-dim">
            {message}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              New password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full rounded-sm border border-gray-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-dim focus:ring-2 focus:ring-orange-dim/20"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className="w-full rounded-sm border border-gray-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-dim focus:ring-2 focus:ring-orange-dim/20"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-orange-dim px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-dim"
          >
            Reset password
          </button>
        </form>
      </div>
    </div>
  );
}