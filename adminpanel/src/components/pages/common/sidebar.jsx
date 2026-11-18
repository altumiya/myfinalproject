import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AiFillPieChart } from 'react-icons/ai'
import { IoMdRadioButtonOn } from "react-icons/io"
import { FaUser, FaExpandArrowsAlt, FaLocationArrow, FaUserEdit } from "react-icons/fa"
import { FaMessage, FaDroplet, FaClockRotateLeft, FaFilePen } from "react-icons/fa6"
import { GiShoppingBag } from "react-icons/gi"
import { RiArrowDownSLine, RiArrowUpSLine, RiMenu3Fill } from "react-icons/ri"
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2"
import { FcFaq } from "react-icons/fc"
import { BsFileEarmarkText } from "react-icons/bs"

export default function SideBar({ activeTab, setActiveTab }) {
  const [open, setOpen] = useState('')
  const [currentActiveTab, setCurrentActiveTab] = useState('dashboard')
  const navigate = useNavigate()
  const goTo = (path) => {
    navigate(path)
  }

  const location = useLocation()

  useEffect(() => {
    const p = location.pathname

    if (p.startsWith('/category/subsubcategory')) {
      setOpen('subsubcat')
      setCurrentActiveTab(p.includes('/view') ? 'viewSubSubCategory' : 'addSubSubCategory')
    } else if (p.startsWith('/category/subcategory')) {
      setOpen('subcat')
      setCurrentActiveTab(p.includes('/view') ? 'viewSubCategory' : 'addSubCategory')
    } else if (p.startsWith('/category')) {
      setOpen('parentcat')
      setCurrentActiveTab(p.includes('/view') ? 'viewCategory' : 'addCategory')
    } else if (p.startsWith('/color')) {
      setOpen('colors')
      setCurrentActiveTab(p.includes('/view') ? 'viewColor' : 'addColor')
    } else if (p.startsWith('/enquiry')) {
      setOpen('enquiry')
      setCurrentActiveTab(p.includes('/newsletter') ? 'newsletter' : 'contactEnquiry')
    } else if (p.startsWith('/material')) {
      setOpen('material')
      setCurrentActiveTab(p.includes('/view') ? 'viewMaterial' : 'addMaterial')
    } else if (p.startsWith('/product')) {
      setOpen('product')
      setCurrentActiveTab(p.includes('/view') ? 'viewProduct' : 'addProduct')
    } else if (p.startsWith('/why-choose-us')) {
      setOpen('whychooseus')
      setCurrentActiveTab(p.includes('/view') ? 'viewWhyChooseUs' : 'addWhyChooseUs')
    } else if (p.startsWith('/orders')) {
      setOpen('orders')
      setCurrentActiveTab('viewOrder')
    } else if (p.startsWith('/sliders')) {
      setOpen('sliders')
      setCurrentActiveTab(p.includes('/view') ? 'viewSlider' : 'addSlider')
    } else if (p.startsWith('/country')) {
      setOpen('country')
      setCurrentActiveTab(p.includes('/view') ? 'viewCountry' : 'addCountry')
    } else if (p.startsWith('/testimonial')) {
      setOpen('testimonial')
      setCurrentActiveTab(p.includes('/view') ? 'viewTestimonial' : 'addTestimonial')
    } else if (p.startsWith('/faqs')) {
      setOpen('faqs')
      setCurrentActiveTab(p.includes('/view') ? 'viewFAQ' : 'addFAQ')
    } else if (p.startsWith('/user')) {
      setOpen('User')
      setCurrentActiveTab('viewUser')
    } else if (p.startsWith('/dashboard')) {
      setOpen('')
      setCurrentActiveTab('dashboard')
    } else {
      setOpen('')
      setCurrentActiveTab('dashboard')
    }
  }, [location.pathname])

  const resolvedActiveTab = typeof activeTab === 'string' ? activeTab : currentActiveTab
  const isActive = (tab) => resolvedActiveTab === tab
  const handleMenuToggle = (menu) => setOpen((current) => (current === menu ? '' : menu))

  const activeClass = "bg-blue-50 text-blue-700 dark:bg-gray-700 dark:text-blue-400"
  const inactiveClass = "text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"

  return (
    <>
     <aside className="h-screen transition-transform -translate-x-full sm:translate-x-0 w-64">
        <div className='h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 scrollbar-hide'>
          
          <button 
            onClick={() => goTo('/dashboard')}
            className='w-full flex items-center ps-2.5 mb-5 border-b border-slate-400 pb-7 transition cursor-pointer'
          >
            <img src="https://www.wscubetech.com/images/wscube-tech-logo-2.svg" alt="logo" />
          </button>

          <ul className="space-y-1 font-[14px]">
            <li className="pb-3">
              <button
                onClick={() => goTo('/dashboard')}
                className={`w-full flex items-center p-2 rounded-lg group transition ${isActive('dashboard') ? activeClass : inactiveClass}`}
              >
                <AiFillPieChart />
                <span className="ms-3 text-[14px] font-medium">Dashboard</span>
              </button>
            </li>

            <li>
              <button 
                className={`w-full flex items-center justify-between p-2 rounded-lg group transition ${inactiveClass}`} 
                onClick={() => handleMenuToggle('User')} 
              >
                <div className="flex items-center">
                  <FaUser />
                  <span className="flex-1 ms-3 whitespace-nowrap text-[14px]">Users</span>
                </div>
                <span className="inline-flex items-center justify-center font-medium">
                  {open === "User" ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                </span>
              </button>
              {open === "User" && (
                <ul className="mt-1 space-y-1 pl-2">
                  <li>
                    <button 
                      onClick={() => goTo('/user')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('viewUser') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">View User</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <button 
                className={`w-full flex items-center justify-between p-2 rounded-lg group transition ${inactiveClass}`} 
                onClick={() => handleMenuToggle('enquiry')} 
              >
                <div className="flex items-center">
                  <FaMessage />
                  <span className="flex-1 ms-3 whitespace-nowrap text-[14px]">Enquirys</span>
                </div>
                <span className="inline-flex items-center justify-center font-medium">
                  {open === "enquiry" ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                </span>
              </button>
              {open === "enquiry" && (
                <ul className="mt-1 space-y-1 pl-2">
                  <li>
                    <button 
                      onClick={() => goTo('/enquiry/contact')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('contactEnquiry') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">Contact Enquiry</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => goTo('/enquiry/newsletter')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('newsletter') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">Newsletter</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Colors */}
            <li>
              <button 
                className={`w-full flex items-center justify-between p-2 rounded-lg group transition ${inactiveClass}`} 
                onClick={() => handleMenuToggle('colors')} 
              >
                <div className="flex items-center">
                  <FaDroplet />
                  <span className="flex-1 ms-3 whitespace-nowrap text-[14px]">Colors</span>
                </div>
                <span className="inline-flex items-center justify-center font-medium">
                  {open === "colors" ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                </span>
              </button>
              {open === "colors" && (
                <ul className="mt-1 space-y-1 pl-2">
                  <li>
                    <button 
                      onClick={() => goTo('/color/add')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('addColor') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">Add Color</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => goTo('/color/view')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('viewColor') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">View Color</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Materials */}
            <li>
              <button 
                className={`w-full flex items-center justify-between p-2 rounded-lg group transition ${inactiveClass}`} 
                onClick={() => handleMenuToggle('material')} 
              >
                <div className="flex items-center">
                  <FaExpandArrowsAlt />
                  <span className="flex-1 ms-3 whitespace-nowrap text-[14px]">Materials</span>
                </div>
                <span className="inline-flex items-center justify-center font-medium">
                  {open === "material" ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                </span>
              </button>
              {open === "material" && (
                <ul className="mt-1 space-y-1 pl-2">
                  <li>
                    <button 
                      onClick={() => goTo('/material/add')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('addMaterial') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">Add Material</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => goTo('/material/view')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('viewMaterial') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">View Material</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Parent Categories */}
            <li>
              <button 
                className={`w-full flex items-center justify-between p-2 rounded-lg group transition ${inactiveClass}`} 
                onClick={() => handleMenuToggle('parentcat')} 
              >
                <div className="flex items-center">
                  <RiMenu3Fill />
                  <span className="flex-1 ms-3 whitespace-nowrap text-[14px]">Parent Categorys</span>
                </div>
                <span className="inline-flex items-center justify-center font-medium">
                  {open === "parentcat" ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                </span>
              </button>
              {open === "parentcat" && (
                <ul className="mt-1 space-y-1 pl-2">
                  <li>
                    <button 
                      onClick={() => goTo('/category/add')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('addCategory') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">Add Category</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => goTo('/category/view')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('viewCategory') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">View Category</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Sub Categories */}
            <li>
              <button 
                className={`w-full flex items-center justify-between p-2 rounded-lg group transition ${inactiveClass}`} 
                onClick={() => handleMenuToggle('subcat')} 
              >
                <div className="flex items-center">
                  <RiMenu3Fill />
                  <span className="flex-1 ms-3 whitespace-nowrap text-[14px]">Sub Categorys</span>
                </div>
                <span className="inline-flex items-center justify-center font-medium">
                  {open === "subcat" ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                </span>
              </button>
              {open === "subcat" && (
                <ul className="mt-1 space-y-1 pl-2">
                  <li>
                    <button 
                      onClick={() => goTo('/category/subcategory/add')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('addSubCategory') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">Add SubCategory</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => goTo('/category/subcategory/view')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('viewSubCategory') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">View SubCategory</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Sub Sub Categories */}
            <li>
              <button 
                className={`w-full flex items-center justify-between p-2 rounded-lg group transition ${inactiveClass}`} 
                onClick={() => handleMenuToggle('subsubcat')} 
              >
                <div className="flex items-center">
                  <RiMenu3Fill />
                  <span className="flex-1 ms-3 whitespace-nowrap text-[14px]">Sub Sub Categorys</span>
                </div>
                <span className="inline-flex items-center justify-center font-medium">
                  {open === "subsubcat" ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                </span>
              </button>
              {open === "subsubcat" && (
                <ul className="mt-1 space-y-1 pl-2">
                  <li>
                    <button 
                      onClick={() => goTo('/category/subsubcategory/add')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('addSubSubCategory') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">Add SubSubCategory</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => goTo('/category/subsubcategory/view')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('viewSubSubCategory') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">View SubSubCategory</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Product */}
            <li>
              <button 
                className={`w-full flex items-center justify-between p-2 rounded-lg group transition ${inactiveClass}`} 
                onClick={() => handleMenuToggle('product')} 
              >
                <div className="flex items-center">
                  <GiShoppingBag />
                  <span className="flex-1 ms-3 whitespace-nowrap text-[14px]">Product</span>
                </div>
                <span className="inline-flex items-center justify-center font-medium">
                  {open === "product" ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                </span>
              </button>
              {open === "product" && (
                <ul className="mt-1 space-y-1 pl-2">
                  <li>
                    <button 
                      onClick={() => goTo('/product/add')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('addProduct') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">Add Product</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => goTo('/product/view')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('viewProduct') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">View Product</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Why Choose Us */}
            <li>
              <button 
                className={`w-full flex items-center justify-between p-2 rounded-lg group transition ${inactiveClass}`} 
                onClick={() => handleMenuToggle('whychooseus')} 
              >
                <div className="flex items-center">
                  <FaClockRotateLeft />
                  <span className="flex-1 ms-3 whitespace-nowrap text-[14px]">Why Choose Us</span>
                </div>
                <span className="inline-flex items-center justify-center font-medium">
                  {open === "whychooseus" ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                </span>
              </button>
              {open === "whychooseus" && (
                <ul className="mt-1 space-y-1 pl-2">
                  <li>
                    <button 
                      onClick={() => goTo('/why-choose-us/add')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('addWhyChooseUs') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">Add Why Choose Us</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => goTo('/why-choose-us/view')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('viewWhyChooseUs') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">View Why Choose Us</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Orders */}
            <li>
              <button 
                className={`w-full flex items-center justify-between p-2 rounded-lg group transition ${inactiveClass}`} 
                onClick={() => handleMenuToggle('orders')} 
              >
                <div className="flex items-center">
                  <FaFilePen />
                  <span className="flex-1 ms-3 whitespace-nowrap text-[14px]">Orders</span>
                </div>
                <span className="inline-flex items-center justify-center font-medium">
                  {open === "orders" ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                </span>
              </button>
              {open === "orders" && (
                <ul className="mt-1 space-y-1 pl-2">
                  <li>
                    <button 
                      onClick={() => goTo('/orders/view')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('viewOrder') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">Orders</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Sliders */}
            <li>
              <button 
                className={`w-full flex items-center justify-between p-2 rounded-lg group transition ${inactiveClass}`} 
                onClick={() => handleMenuToggle('sliders')} 
              >
                <div className="flex items-center">
                  <HiOutlineAdjustmentsHorizontal />
                  <span className="flex-1 ms-3 whitespace-nowrap text-[14px]">Sliders</span>
                </div>
                <span className="inline-flex items-center justify-center font-medium">
                  {open === "sliders" ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                </span>
              </button>
              {open === "sliders" && (
                <ul className="mt-1 space-y-1 pl-2">
                  <li>
                    <button 
                      onClick={() => goTo('/sliders/add')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('addSlider') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">Add Slider</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => goTo('/sliders/view')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('viewSlider') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">View Slider</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Country */}
            <li>
              <button 
                className={`w-full flex items-center justify-between p-2 rounded-lg group transition ${inactiveClass}`} 
                onClick={() => handleMenuToggle('country')} 
              >
                <div className="flex items-center">
                  <FaLocationArrow />
                  <span className="flex-1 ms-3 whitespace-nowrap text-[14px]">Country</span>
                </div>
                <span className="inline-flex items-center justify-center font-medium">
                  {open === "country" ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                </span>
              </button>
              {open === "country" && (
                <ul className="mt-1 space-y-1 pl-2">
                  <li>
                    <button 
                      onClick={() => goTo('/country/add')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('addCountry') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">Add Country</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => goTo('/country/view')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('viewCountry') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">View Country</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Testimonials */}
            <li>
              <button 
                className={`w-full flex items-center justify-between p-2 rounded-lg group transition ${inactiveClass}`} 
                onClick={() => handleMenuToggle('testimonial')} 
              >
                <div className="flex items-center">
                  <FaUserEdit />
                  <span className="flex-1 ms-3 whitespace-nowrap text-[14px]">Testimonials</span>
                </div>
                <span className="inline-flex items-center justify-center font-medium">
                  {open === "testimonial" ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                </span>
              </button>
              {open === "testimonial" && (
                <ul className="mt-1 space-y-1 pl-2">
                  <li>
                    <button 
                      onClick={() => goTo('/testimonial/add')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('addTestimonial') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">Add Testimonial</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => goTo('/testimonial/view')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('viewTestimonial') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">View Testimonial</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* FAQs */}
            <li>
              <button 
                className={`w-full flex items-center justify-between p-2 rounded-lg group transition ${inactiveClass}`} 
                onClick={() => handleMenuToggle('faqs')} 
              >
                <div className="flex items-center">
                  <FcFaq />
                  <span className="flex-1 ms-3 whitespace-nowrap text-[14px]">FAQs</span>
                </div>
                <span className="inline-flex items-center justify-center font-medium">
                  {open === "faqs" ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                </span>
              </button>
              {open === "faqs" && (
                <ul className="mt-1 space-y-1 pl-2">
                  <li>
                    <button 
                      onClick={() => goTo('/faqs/add')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('addFAQ') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">Add FAQ</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => goTo('/faqs/view')}
                      className={`flex items-center p-2 w-full rounded-lg group transition ${isActive('viewFAQ') ? activeClass : inactiveClass}`}
                    >
                      <IoMdRadioButtonOn />
                      <span className="font-semibold ms-4 text-[13px] whitespace-nowrap">View FAQ</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Terms & Condition */}
            <li className="pt-2 pb-3">
              <button
                onClick={() => {
                  setActiveTab('termsCondition')
                  setOpen('')
                }}
                className={`w-full flex items-center p-2 rounded-lg group transition ${isActive('termsCondition') ? activeClass : inactiveClass}`}
              >
                <BsFileEarmarkText />
                <span className="ms-3 text-[14px] font-medium">Terms & Condition</span>
              </button>
            </li>

          </ul>
        </div>
      </aside>
    </>
  )
}
