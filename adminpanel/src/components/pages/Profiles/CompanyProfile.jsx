import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

export default function CompanyProfile() {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);

  // --- ADDED: States for handling the file upload and loading status ---
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- UPDATED: Initial state is now empty, will be filled by backend ---
  const [companyData, setCompanyData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    mapUrl: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    youtube: "",
  });
  const API_BASE_URL = import.meta.env.VITE_APIBASEURL;
  const IMAGE_BASE_URL = new URL(API_BASE_URL).origin;

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}companyprofile/view`, {
        credentials: "include",
      });

      const data = await response.json();

      if (data && Object.keys(data).length > 0) {
        setCompanyData({
          name: data.name || "",
          email: data.email || "",
          mobile: data.mobile || "",
          address: data.address || "",
          mapUrl: data.mapUrl || "",
          facebook: data.facebook || "",
          twitter: data.twitter || "",
          linkedin: data.linkedin || "",
          instagram: data.instagram || "",
          youtube: data.youtube || "",
        });

        // If the backend has a logoUrl, set it as the preview
        if (data.logoUrl) {
          setPreview(`${IMAGE_BASE_URL}${data.logoUrl}`);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load company profile data.");
    }
  };

  // --- UPDATED: Memory cleanup for Blob URLs only ---
  useEffect(() => {
    return () => {
      // Only revoke if it's a local object URL, not a backend URL
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);

    setPreview(URL.createObjectURL(file));
    setImageFile(file); // --- ADDED: Store the actual file to send to backend ---
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const handleInputChange = (event) => {
    const file = event.target.files[0];
    handleFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const handleInputUpdate = (field, value) => {
    setCompanyData((prev) => ({ ...prev, [field]: value }));
  };

  // --- ADDED: Submit Handler to send data to your specific POST route ---
  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const formData = new FormData();

      Object.keys(companyData).forEach((key) => {
        formData.append(key, companyData[key]);
      });

      if (imageFile) {
        formData.append("logo", imageFile);
      }

      const response = await fetch(`${API_BASE_URL}companyprofile/update`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Company Profile updated successfully!");
        fetchProfileData();
        setImageFile(null);
      } else {
        if (response.status === 401) {
          toast.error("Session expired. Please log in again.");
        } else {
          toast.error(result.message || "Failed to update profile");
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900">
          Company Profile
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Manage company information, location, and social media presence.
        </p>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-700">Company Logo</p>
            <div
              className={`group relative flex h-56 flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed text-center transition-all ${
                dragActive
                  ? "border-violet-500 bg-violet-50"
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Company logo"
                    className="h-full w-full object-contain p-2"
                  />

                  <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                      Change Image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="hidden"
                    />
                  </label>
                </>
              ) : (
                <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center space-y-3 px-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600 transition-transform duration-300 group-hover:scale-110">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Click to upload or drag and drop
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      SVG, PNG, JPG or GIF (max. 2MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={companyData.name}
                  onChange={(e) => handleInputUpdate("name", e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none"
                  placeholder="Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={companyData.email}
                  onChange={(e) => handleInputUpdate("email", e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none"
                  placeholder="Email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                type="text"
                value={companyData.mobile}
                onChange={(e) => handleInputUpdate("mobile", e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none"
                placeholder="Mobile Number"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                value={companyData.address}
                onChange={(e) => handleInputUpdate("address", e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none"
                placeholder="Address"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Google Map URL
              </label>
              <input
                type="text"
                value={companyData.mapUrl}
                onChange={(e) => handleInputUpdate("mapUrl", e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none"
                placeholder="Paste the src link from Google Maps embed"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold text-gray-700">
            Location Map
          </p>
          <div className="h-80 w-full overflow-hidden rounded-3xl border border-gray-200">
            {/* UPDATED: Dynamically render map if a URL exists */}
            {companyData.mapUrl ? (
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={companyData.mapUrl}
              ></iframe>
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-50 text-gray-400">
                No map URL provided
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-4 border-t border-gray-200 pt-6">
          <p className="text-sm font-semibold text-gray-700">
            Social Media Links
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FaFacebook className="text-blue-600" />
                Facebook
              </label>
              <input
                type="url"
                value={companyData.facebook}
                onChange={(e) => handleInputUpdate("facebook", e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none"
                placeholder="Facebook URL"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FaTwitter className="text-blue-400" />
                Twitter
              </label>
              <input
                type="url"
                value={companyData.twitter}
                onChange={(e) => handleInputUpdate("twitter", e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none"
                placeholder="Twitter URL"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FaLinkedin className="text-blue-700" />
                LinkedIn
              </label>
              <input
                type="url"
                value={companyData.linkedin}
                onChange={(e) => handleInputUpdate("linkedin", e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none"
                placeholder="LinkedIn URL"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FaInstagram className="text-pink-600" />
                Instagram
              </label>
              <input
                type="url"
                value={companyData.instagram}
                onChange={(e) => handleInputUpdate("instagram", e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none"
                placeholder="Instagram URL"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FaYoutube className="text-red-600" />
                YouTube
              </label>
              <input
                type="url"
                value={companyData.youtube}
                onChange={(e) => handleInputUpdate("youtube", e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none"
                placeholder="YouTube URL"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-start">
          {/* UPDATED: Added onClick to trigger handleSubmit and disabled state */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="inline-flex rounded-2xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:bg-violet-400"
          >
            {isLoading ? "Updating..." : "Update Company Profile"}
          </button>
        </div>
      </div>
    </section>
  );
}
