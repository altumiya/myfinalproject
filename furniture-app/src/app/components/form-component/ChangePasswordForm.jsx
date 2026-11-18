"use client";

import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import "izitoast/dist/css/iziToast.min.css"; 

let iziToast;
if (typeof window !== "undefined") {
  iziToast = require("izitoast");
}

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fetching token from Redux store
  const token = useSelector((store) => store.user?.token);

  // Getting base URL from environment variables
  const apiBaseUrl = process.env.NEXT_PUBLIC_APIBASEURL;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      setMessage("Please fill in both password fields.");
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    // Clear previous generic messages
    setMessage("");

    const obj = {
      oldPassword: formData.currentPassword,
      newPassword: formData.password,
      confirmPassword: formData.confirmPassword,
    };

    axios
      .post(`${apiBaseUrl}web/auth/change-password`, obj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes.status) {
          // Clear the form on success
          setFormData({ currentPassword: "", password: "", confirmPassword: "" });
          
          iziToast.success({
            title: "Success",
            message: finalRes.message,
          });

          // Uncomment if you want to redirect the user after a successful password change
          // setTimeout(() => {
          //   window.location.href = '/login'
          // }, 1500)
        } else {
          iziToast.error({
            title: "Error",
            message: finalRes.message,
          });
        }
      })
      .catch((error) => {
        iziToast.error({
          title: "Error",
          message: "Something went wrong. Please try again later.",
        });
        console.error(error);
      });
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full">
        <div className="mb-6">
          <h2 className="font-playfair text-xl font-semibold text-[#1f1f1f]">
            Change password
          </h2>
        </div>

        {message ? (
          <div className="mb-4 rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm text-orange-dim">
            {message}
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-sm border border-gray-100 p-5"
        >
          <div>
            <label
              htmlFor="currentPassword"
              className="mb-2 block text-sm font-medium"
            >
              Current password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter Current password"
              className="w-full rounded-sm border border-gray-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-dim focus:ring-2 focus:ring-orange-dim/20"
            />
          </div>
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
            className="rounded-sm bg-orange-dim px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-dim"
          >
            Change password
          </button>
        </form>
      </div>
    </div>
  );
}