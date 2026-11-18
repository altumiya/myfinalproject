"use client";
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { FaFax } from "react-icons/fa";
// Import iziToast and its CSS
import 'izitoast/dist/css/iziToast.min.css';

export default function ContactUs() {
  // State for Company Details (Map, Phone, etc.)
  const [companyDetails, setCompanyDetails] = useState({
    address: 'Loading...',
    mobile: "98745612330",
    email: "furniture@gmail.com",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7155.251016816475!2d73.030606!3d26.273815!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39418c5b1dfafdd7%3A0xf992fd41c21a238e!2sLaxmi%20Dairy%20%26%20Provision%20Store!5e0!3m2!1sen!2sin!4v1781692221070!5m2!1sen!2sin"
  });

  // State for Form Submission
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get Base URL securely
  const getBaseUrl = () => {
    let baseUrl = process.env.NEXT_PUBLIC_APIBASEURL || "http://localhost:8000/api";
    if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.slice(0, -1);
    }
    return baseUrl;
  };

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await fetch(`${getBaseUrl()}/admin/companyprofile/view`, {
          cache: 'no-store'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        let dataObj = result;
        if (result.data) dataObj = result.data; 
        if (Array.isArray(dataObj)) dataObj = dataObj[0]; 

        dataObj = dataObj || {}; 
        
        setCompanyDetails({
          mobile: dataObj?.mobile || dataObj?.phone || "98745612330",
          email: dataObj?.email || "furniture@gmail.com",
          address: dataObj?.address || "No address provided",
          mapUrl: dataObj?.mapUrl || "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7155.251016816475!2d73.030606!3d26.273815!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39418c5b1dfafdd7%3A0xf992fd41c21a238e!2sLaxmi%20Dairy%20%26%20Provision%20Store!5e0!3m2!1sen!2sin!4v1781692221070!5m2!1sen!2sin"
        });
      } catch (error) {
        console.error("Failed to fetch company contact:", error);
      }
    };

    fetchCompanyDetails();
  }, []);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const iziToast = (await import('izitoast')).default;

    try {
      const response = await fetch(`${getBaseUrl()}/admin/contactenquiry/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        iziToast.success({
            title: 'Success',
            message: result.message || 'Your message has been sent successfully!',
            position: 'topRight',
        });
        
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          mobile: '',
          subject: '',
          message: ''
        });
      } else {
        iziToast.error({
            title: 'Error',
            message: result.message || 'Failed to send message. Please try again.',
            position: 'topRight',
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      iziToast.error({
          title: 'Error',
          message: 'Something went wrong. Please check your connection and try again.',
          position: 'topRight',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
        <section className='w-full max-w-[1120px] mx-auto px-2'>
            <div className='grid grid-cols-1 place-items-center border-b-1 border-gray-200 px-4 py-6' >
                <h2 className='font-playfair font-semibold text-4xl'>Contact Us</h2>
                <nav className="flex" aria-label="Breadcrumb">
                <ol className="p-3 px-6 inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <li className='font-rubik text-dark-gray text-sm'>
                        <Link href={"/"}>
                        Home
                        </Link>
                    </li>
                    <li className='font-rubik text-orange-dim text-sm'>
                        <div className="flex items-center">
                        <MdOutlineKeyboardArrowRight className='mr-2' /> Contact Us
                        </div>
                    </li> 
                </ol>
                </nav>
            </div>
        </section>

        <section className='w-full py-8 lg:py-16'>
           {companyDetails.mapUrl && (
             <iframe
              src={companyDetails.mapUrl}
              className="w-full"
              height={450}
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
             />
           )}
        </section>

        <section className='w-full max-w-[1120px] mx-auto py-4 px-2'>
            <div className='grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-8'>
                <div className=''>
                    <h2 className='text-2xl font-playfair font-bold border-b-1 border-gray-200 py-4'>
                        Contact Us
                    </h2>
                    <div className='grid grid-cols-1 justify-start items-start gap-3 font-rubik text-dark-gray text-sm'>
                        <div className='inline-flex items-center text-dark-gray border-b-1 border-gray-200 py-3'>
                            <FaFax className='mr-3'/> Address : {companyDetails.address}
                        </div>
                        <div className='inline-flex items-center text-dark-gray border-b-1 border-gray-200 py-3'>
                            <FaFax className='mr-3'/> {companyDetails.mobile}
                        </div>
                        <div className='inline-flex items-center text-dark-gray border-b-1 border-gray-200 py-3'>
                            <FaFax className='mr-3'/> {companyDetails.email}
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className='text-2xl font-playfair font-bold py-4 mb-3'>
                        Tell us your question
                    </h2>

                    <div>
                        <form onSubmit={handleSubmit}>
                          <div className='mb-3'>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                Your Name (required)
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="bg-white border-1 border-gray-200 text-gray-900 text-sm block w-full p-2.5 focus:outline-none focus:border-orange-dim"
                                placeholder="name *"
                                required
                            />
                          </div>  
                          <div className='mb-3'>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                Your Email (required)
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="bg-white border-1 border-gray-200 text-gray-900 text-sm block w-full p-2.5 focus:outline-none focus:border-orange-dim"
                                placeholder="email"
                                required
                            />
                          </div> 
                          <div className='mb-3'>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                Your Mobile Number (required)
                            </label>
                            <input
                                type="tel"
                                id="mobile"
                                value={formData.mobile}
                                onChange={handleInputChange}
                                className="bg-white border-1 border-gray-200 text-gray-900 text-sm block w-full p-2.5 focus:outline-none focus:border-orange-dim"
                                placeholder="Mobile Number"
                                required
                            />
                          </div>
                          <div className='mb-3'>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                Subject
                            </label>
                            <input
                                type="text"
                                id="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                className="bg-white border-1 border-gray-200 text-gray-900 text-sm block w-full p-2.5 focus:outline-none focus:border-orange-dim"
                                placeholder="Subject *"
                                required
                            />
                          </div>
                          <div className='mb-3'>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                Your Message
                            </label>
                            <textarea 
                                name="message" 
                                id="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder={'Message *'}
                                className="bg-white border-1 border-gray-200 text-gray-900 text-sm block w-full h-50 p-2.5 focus:outline-none focus:border-orange-dim"
                                required
                            />
                          </div>
                          <div>
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-8 py-3 text-sm text-white rounded transition-colors ${
                                  isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-orange-dim'
                                }`}
                            >
                                {isSubmitting ? 'Sending...' : 'Send'}
                            </button>
                          </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}