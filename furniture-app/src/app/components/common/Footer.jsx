"use client";
import Link from 'next/link';
import Image from "next/image";
import React, { useState, useEffect } from 'react'
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaTelegram } from "react-icons/fa";
import Reveal from "../animations/Reveal";
import StaggerContainer from "../animations/StaggerContainer";
import StaggerItem from "../animations/StaggerItem";

const navFooterLinks = [
  { href: "/", label: "Home" },
  { href: "/product", label: "Online Store" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/term-of-use", label: "Terms Of Use" },
];

export default function Footer() {
  const [companyDetails, setCompanyDetails] = useState({
    address: 'Loading...',
    mobile: "98745612330",
    email: "furniture@gmail.com",
  });
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        let baseUrl = process.env.NEXT_PUBLIC_APIBASEURL || "http://localhost:8000/api";
        
        if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.slice(0, -1);
        }

        const response = await fetch(`${baseUrl}/admin/companyprofile/view`,{
          cache: 'no-store'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
       let dataObj = result;
        if (result.data) dataObj = result.data; // Unpack 'data' if it exists
        if (Array.isArray(dataObj)) dataObj = dataObj[0]; // Grab first item if it's an array

        // 2. If dataObj is somehow still undefined, force it to be an empty object
        dataObj = dataObj || {}; 
        
        // 3. Set the state using optional chaining (?.) so it NEVER crashes
        setCompanyDetails({
          mobile: dataObj?.mobile || dataObj?.phone || "98745612330",
          email: dataObj?.email || "furniture@gmail.com",
          address: dataObj?.address || "No address provided",
        });
      } catch (error) {
        console.error("Failed to fetch company contact:", error);
      }
    };

    fetchCompanyDetails();
  }, []);
  return (
    
    <Reveal
      as="footer"
      amount={0.05}
      duration={0.7}
      className="bg-neutral-primary border-t border-gray-200 py-6"
    >
      <div className="mx-auto lg:max-w-[1140px] px-4 py-4">
        <StaggerContainer
          className="grid grid-cols-1 gap-8 px-4 py-6 text-center sm:grid-cols-2 md:grid-cols-[30%_auto_auto_30%] md:text-left"
          amount={0.1}
          stagger={0.12}
        >
          <StaggerItem>
            <h2 className="mb-6 text-xl font-semibold font-playfair">
              Contact Us
            </h2>
            <p className='font-rubik text-sm/8 text-dark-gray tracking-wide'>Address: {companyDetails.address}</p>
            <p className='font-rubik text-sm/8 text-dark-gray tracking-wide'>Phone: {companyDetails.mobile}</p>
            <p className='font-rubik text-sm/8 text-dark-gray tracking-wide'>Email: {companyDetails.email}</p>
            <Reveal as="div" delay={0.18} amount={0.1} className="mt-4 flex justify-center gap-2 text-lg md:justify-start">
              <Link href={'/'} className='border border-gray-200 hover:border-orange-dim hover:text-dim-orange rounded-full p-2'>
                <FaFacebookF className='text-gray-400 hover:text-orange-dim' />
              </Link>
              <Link href={'/'} className='border border-gray-200 hover:border-orange-dim hover:text-dim-orange rounded-full p-2'>
                <FaInstagram className='text-gray-400 hover:text-orange-dim' />
              </Link>
              <Link href={'/'} className='border border-gray-200 hover:border-orange-dim hover:text-dim-orange rounded-full p-2'>
                <FaTwitter className='text-gray-400 hover:text-orange-dim' />
              </Link>
              <Link href={'/'} className='border border-gray-200 hover:border-orange-dim hover:text-dim-orange rounded-full p-2'>
                <FaYoutube className='text-gray-400 hover:text-orange-dim' />
              </Link>
              <Link href={'/'} className='border border-gray-200 hover:border-orange-dim hover:text-dim-orange rounded-full p-2'>
                <FaTelegram className='text-gray-400 hover:text-orange-dim' />
              </Link>   
            </Reveal>
          </StaggerItem>
          <StaggerItem>
            <h2 className="mb-6 text-xl font-semibold font-playfair">
              Information
            </h2>
            <ul className="font-rubik text-sm/8 text-dark-gray">
              <li>
                <Link href={"/about-us"} className="hover:text-orange-dim">
                  About Us
                </Link>
              </li>
              <li>
                <Link href={"/contact-us"} className="hover:text-orange-dim">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href={"/faq"} className="hover:text-orange-dim">
                  Frequently Questions
                </Link>
              </li>
            </ul>
          </StaggerItem>
          <StaggerItem>
            <h2 className="mb-6 text-xl font-semibold font-playfair">
              My Account
            </h2>
            <ul className="font-rubik text-sm/8 text-dark-gray">
              <li>
                <Link href={"/dashboard"} className="hover:text-orange-dim">
                  My Dashboard
                </Link>
              </li>
              <li>
                <Link href={"/wishlist"} className="hover:text-orange-dim">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href={"/cart"} className="hover:text-orange-dim">
                  Cart
                </Link>
              </li>
              <li>
                <Link href={"/checkout"} className="hover:text-orange-dim">
                  Checkout
                </Link>
              </li>
            </ul>
          </StaggerItem>
          <StaggerItem>
            <h2 className="mb-6 text-xl font-semibold font-playfair">
              Top Rated Products
            </h2>
            <ul>
              <li>
                <div className="grid grid-cols-[30%_auto] gap-2">
                  <div className="simple_product_thumb">
                      <Link href="/product">
                          <Image src="https://wscubetech.co/Assignments/furniture/storage/app/public/uploads/images/products/1661762520951Group%201.jpg" alt="" width={100} height={100} sizes="100px" />
                      </Link>
                  </div>
                  <div className="simple_product_content">
                      <div className="font-rubik text-sm text-dark-gray">
                        <Link href="/product">L Shape Sofa</Link>
                      </div>
                      <div className="product_name">
                          <h3 className='font-playfair text-base text-gray-700 mb-2'>
                            <Link href="/product">
                              Harper L Shaped Wooden Sofa with Drawer
                            </Link>
                          </h3>
                      </div>
                      <div className="flex gap-2">
                          <span className="font-rubik text-sm font-normal text-dark-gray line-through">Rs. 85,000</span>
                          <span className="font-rubik text-sm font-semibold text-orange-dim">Rs. 76,000</span>
                      </div>
                  </div>
                </div>
              </li>
            </ul>
          </StaggerItem>
        </StaggerContainer>
        
      </div>
      <div className="mx-auto lg:max-w-[1140px] px-4 py-4 border-y border-gray-200">
        <nav className="hidden md:flex items-center justify-center gap-8">
          {/* {Desktop Menu} */}
          {navFooterLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-md tracking-wide font-rubik transition text-dark-gray hover:text-orange-dim"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div>
        <div className="mx-auto lg:max-w-[1140px] grid grid-cols-1 place-items-center px-4 py-6">
          <span className='font-rubik text-sm/8 text-dark-gray tracking-wide mb-2'>
            All Rights Reserved By Furniture | © 2026
          </span>
          <Reveal as="div" delay={0.2} amount={0.1}>
            <Image src="/papyel2.png" alt="Payment Methods" width={240} height={48} sizes="240px" />
          </Reveal>
        </div>
      </div>
    </Reveal>


  )
}
