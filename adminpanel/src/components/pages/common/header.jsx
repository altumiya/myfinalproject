import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Header({ setActiveTab, onLogout }) {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_APIBASEURL || "http://localhost:8000/api/";

  // 1. Setup state to hold the real admin data
  const [adminData, setAdminData] = useState({
    name: "Admin",
    email: "Loading...",
    logo: null
  });
  const [imagePath, setImagePath] = useState("");

  // 2. Fetch the profile data
  const fetchHeaderProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}adminprofile/view`, {
        method: "GET",
        credentials: "include", 
      });
      const result = await response.json();

      if (result.status) {
        setAdminData({
          name: result.data.name || "Admin",
          email: result.data.email || "admin@example.com",
          logo: result.data.logo || null,
        });
        setImagePath(result.path || "");
      }
    } catch (error) {
      console.error("Failed to fetch profile for header", error);
    }
  };

  // 3. Run fetch on mount AND listen for updates from the Profile page
  useEffect(() => {
    fetchHeaderProfile();

    // This listens for our custom signal to refresh instantly
    window.addEventListener('profileUpdated', fetchHeaderProfile);
    
    // Cleanup listener when component unmounts
    return () => window.removeEventListener('profileUpdated', fetchHeaderProfile);
  }, []);

  const handleAdminProfile = () => {
    if (typeof setActiveTab === 'function') setActiveTab('adminProfile');
    navigate('/profile');
  };

  const handleCompanyProfile = () => {
    if (typeof setActiveTab === 'function') setActiveTab('companyProfile');
    navigate('/company-profile');
  };

  const handleLogout = () => {
    if (typeof onLogout === 'function') {
      onLogout();
      return;
    }
    navigate('/');
  };

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
        <p className="text-sm text-gray-500">Manage users and colors</p>
      </div>
      <div className="relative group">
        <div className="flex cursor-pointer items-center gap-3 rounded-full px-3 py-2 hover:bg-gray-100">
          
          {/* Dynamically show Image or Name Initial */}
          {adminData.logo ? (
            <img 
              src={imagePath + adminData.logo} 
              alt="Admin" 
              className="h-10 w-10 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
              {adminData.name.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Render the actual Name and Email */}
          <div className="hidden min-w-[200px] flex-col gap-1 text-left sm:flex">
            <p className="text-sm font-medium text-gray-900">{adminData.name}</p>
            <p className="text-xs text-gray-500">{adminData.email}</p>
          </div>
        </div>

        <div className="absolute right-0 top-12 z-10 mt-2 hidden w-52 rounded-2xl border border-gray-200 bg-white shadow-lg transition duration-150 group-hover:block">
          <button
            type="button"
            onClick={handleAdminProfile}
            className="w-full rounded-t-2xl px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            Admin Profile
          </button>
          <button
            type="button"
            onClick={handleCompanyProfile}
            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            Company Profile
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-b-2xl px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}