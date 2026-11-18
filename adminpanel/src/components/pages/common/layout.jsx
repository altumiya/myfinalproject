import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Sidebar from "./sidebar";
import Header from "./header";
import Footer from "./footer";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/');
  };

  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter((p) => p);
    
    const breadcrumbs = ['dashboard'];

    paths.forEach((path) => {
      if (path.toLowerCase() !== 'dashboard') {
        const formattedName = path
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        breadcrumbs.push(formattedName);
      }
    });

    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();

  return (
    <>
      <section className='grid grid-cols-[17.5%_auto] min-h-screen bg-gray-50'>
        <Sidebar />
        <div className='scrollbar-hide flex flex-col overflow-y-auto h-screen'>
          <Header />
          
          <div className="border-b border-gray-200 bg-white px-6 py-4">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                {breadcrumbItems.map((item, index) => (
                  <li key={`${item}-${index}`} className="flex items-center gap-2">
                    {index > 0 && <span aria-hidden="true">/</span>}
                    <span className={index === breadcrumbItems.length - 1 ? 'font-semibold text-gray-900' : ''}>
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
          
          <main className="flex-1 p-6">
            <Outlet />
          </main>
          
          <Footer />
        </div>
      </section>
    </>
  );
}