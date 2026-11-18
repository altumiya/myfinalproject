"use client";
import React, { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosSearch } from "react-icons/io";
import { FaHeart, FaChevronDown } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { deleteCart, fetchCartbyId } from "@/redux/cartSlice";
import { fetchWishlist } from "@/redux/wishlistSlice";
import { clearCart } from "@/redux/cartSlice";
import { clearWishlist } from "@/redux/wishlistSlice";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { logout } from "@/redux/userSlice";
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";
import { setToken } from "@/redux/userSlice";

const staticMenuItems = [
  { name: "Home", href: "/" },
  {
    name: "Pages",
    megaMenu: [
      {
        items: [
          { name: "About Us", href: "/about-us" },
          { name: "Cart", href: "/cart" },
          { name: "Checkout", href: "/checkout" },
          { name: "Frequently Questions", href: "/faq" },
        ],
      },
    ],
  },
  { name: "Contact US", href: "/contact-us" },
];

const subscribeToMount = () => () => {};
const getClientMountSnapshot = () => true;
const getServerMountSnapshot = () => false;

export default function Header() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMounted = useSyncExternalStore(
    subscribeToMount,
    getClientMountSnapshot,
    getServerMountSnapshot
  );
  const [categoryMenus, setCategoryMenus] = useState([]);
  const menuItems = [
    staticMenuItems[0],
    ...categoryMenus,
    ...staticMenuItems.slice(1),
  ];
  
  // State for dynamic company profile info
  const [adminContact, setAdminContact] = useState({
    mobile: "+91-98745612330",
    email: "furniture@gmail.com",
    logo: "/logo.png" // Default fallback logo
  });

  let dispatch = useDispatch();
  const router = useRouter();
  let cart = useSelector((myStore) => myStore.cartStore?.cart || []);
  let token = useSelector((myStore) => myStore.userStore?.token);
  let wishlist = useSelector((myStore) => myStore.wishlistStore?.items || []);

  let total = cart.reduce(
    (acc, obj) => (acc += obj.qty * obj.productPrice),
    0
  );

  useEffect(() => {
    const savedToken = Cookies.get("token");
    if (savedToken && !token) {
      dispatch(setToken({ token: savedToken }));
    }
  }, [dispatch, token]);

  useEffect(() => {
    const fetchMegaMenu = async () => {
      try {
        let baseUrl = process.env.NEXT_PUBLIC_APIBASEURL || "http://localhost:8000/api";
        if (baseUrl.endsWith("/")) {
          baseUrl = baseUrl.slice(0, -1);
        }

        const response = await fetch(`${baseUrl}/web/home/mega-menu`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.status || !Array.isArray(result.data)) {
          throw new Error(result.message || "Invalid mega menu response");
        }

        setCategoryMenus(
          result.data.map((category) => {
            const megaMenu = (category.subCategories || []).map((subcategory) => ({
              title: subcategory.name,
              titleHref: `/product?subcategory=${encodeURIComponent(subcategory.slug)}`,
              items: (subcategory.subSubCategories || []).map((item) => ({
                name: item.name,
                href: `/product?subsubcategory=${encodeURIComponent(item.slug)}`,
              })),
            }));

            return {
              name: category.name,
              href: `/product?category=${encodeURIComponent(category.slug)}`,
              megaMenu: megaMenu.length > 0 ? megaMenu : undefined,
            };
          })
        );
      } catch (error) {
        console.error("Failed to fetch mega menu:", error);
      }
    };

    fetchMegaMenu();
  }, []);

  useEffect(() => {
    if (token != "") {
      dispatch(fetchCartbyId());
      dispatch(fetchWishlist());
    }
  }, [dispatch, token]);

  // Fetch company profile data on mount
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        let baseUrl = process.env.NEXT_PUBLIC_APIBASEURL || "http://localhost:8000/api";
        if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.slice(0, -1);
        }

        // Updated endpoint to match the company profile route
        const response = await fetch(`${baseUrl}/admin/companyprofile/view`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Backend returns the object directly or an empty object {}
        if (result && Object.keys(result).length > 0) {
          // Get the base server URL for images (e.g., http://localhost:8000)
          const serverUrl = baseUrl.replace('/api', '');

          setAdminContact({
            mobile: result.mobile || "+91-98745612330",
            email: result.email || "furniture@gmail.com",
            // Use logoUrl from backend and prepend the server URL
            logo: result.logoUrl ? `${serverUrl}${result.logoUrl}` : "/logo.png" 
          });
        }
      } catch (error) {
        console.error("Failed to fetch company profile:", error);
      }
    };

    fetchCompanyProfile();
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    dispatch(logout());
    dispatch(clearCart());
    dispatch(clearWishlist());
    router.push("/login");
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 80);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full bg-white font-sans relative z-40">
      {/* Cart Popup */}
      <div
        className={`pointer-events-none fixed inset-0 z-50 overflow-hidden ${isCartOpen ? "pointer-events-auto" : ""}`}
      >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isCartOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsCartOpen(false)}
      />
      <div
        className={`pointer-events-auto absolute top-0 right-0 h-full w-80 bg-white p-4 shadow-xl transform transition-transform duration-300 ease-in-out sm:w-96
            ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="py-2 flex justify-between items-center border-b border-gray-100">
          <h3 className="text-lg font-bold capitalize font-playfair text-dark-gray">
            Cart
          </h3>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-2xl text-gray-500 hover:text-black"
          >
            <IoCloseOutline />
          </button>
        </div>
        {cart.length === 0 ? (
          <div className="grid grid-cols-1 items-center text-center mt-10">
            <Image src="/my-Order.jpg" alt="Not Found" width={240} height={180} sizes="240px" className="mx-auto" />
            <p className="text-gray-400 mb-2 border-t border-b border-gray-100 py-4 mt-4">
              Your shopping cart is empty!
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-80px)]">
            <div className="flex-1 overflow-y-auto">
              {cart.map((cartObj, index) => (
                <CartData key={index} item={cartObj} />
              ))}
            </div>
            <div className="mt-auto">
              <div className="flex justify-between py-4 border-t border-gray-200 font-bold">
                <div>Subtotal:</div>
                <div>Rs. {total}</div>
              </div>
              <div className="bg-gray-900 grid grid-cols-1 gap-2 p-4 w-full text-white uppercase text-sm">
                <Link
                  href={"/cart"}
                  onClick={() => setIsCartOpen(false)}
                  className="bg-gray-800 py-3 w-full block mb-2 text-center rounded-sm hover:bg-orange-dim transition-colors"
                >
                  View Cart
                </Link>
                <Link
                  href={"/checkout"}
                  onClick={() => setIsCartOpen(false)}
                  className="bg-orange-dim py-3 w-full block text-center rounded-sm transition-colors"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Top Bar */}
      <div className="lg:block hidden text-sm border-b border-gray-100 py-2 px-4">
        <div className="lg:max-w-[1140px] container mx-auto flex justify-between items-center">
          <p className="text-[12px] font-rubik text-gray-600">
            Contact Us 24/7 : {adminContact.mobile} / {adminContact.email}
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[12px] font-rubik text-gray-600">
              {isMounted && (token ? (
                <button
                  onClick={handleLogout}
                  className="hover:text-orange-dim transition-colors"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link href={"/login"} className="hover:text-orange-dim transition-colors">Login</Link> /
                  <Link href={"/register"} className="hover:text-orange-dim transition-colors">Register</Link>
                </>
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* Logo, Search and Cart Bar */}
      <div className="py-4 px-4 bg-white relative z-10">
        <div className="lg:max-w-[1140px] mx-auto flex justify-between items-center font-rubik">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="text-2xl text-gray-700 hover:text-black lg:hidden focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-slate-900"
            >
              {adminContact.logo && <Image src={adminContact.logo} alt="Company Logo" width={160} height={64} sizes="(max-width: 768px) 96px, 160px" unoptimized={adminContact.logo.startsWith("http://localhost:")} className="w-24 md:w-32 lg:w-40" />}
            </Link>
          </div>

          <div className="flex justify-end items-center gap-2 lg:gap-4">
            <div className="hidden lg:flex border border-gray-200 rounded-sm font-rubik text-sm items-center px-3 py-1 bg-gray-50">
              <form action="" className="flex items-center">
                <input
                  name="search"
                  placeholder="Search product..."
                  type="text"
                  className="bg-transparent outline-none px-2 w-48 lg:w-64"
                />
                <button type="submit" className="text-gray-500 hover:text-orange-dim text-lg">
                  <IoIosSearch />
                </button>
              </form>
            </div>

            <Link href={"/wishlist"} className="relative border border-gray-200 rounded-sm flex items-center p-2.5 hover:bg-gray-50 transition-colors">
              <span className="absolute -top-2 -left-2 bg-orange-dim text-white rounded-full w-5 h-5 flex justify-center items-center text-xs font-bold shadow-sm">
                {wishlist.length}
              </span>
              <FaHeart className="text-gray-500 hover:text-orange-dim text-lg" />
            </Link>

            <button
              className="relative border border-gray-200 rounded-sm flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors"
              onClick={() => setIsCartOpen(true)}
            >
              <span className="absolute -top-2 -left-2 bg-orange-dim text-white rounded-full w-5 h-5 flex justify-center items-center text-xs font-bold shadow-sm">
                {cart.length}
              </span>
              <div className="border-r border-gray-200 pr-2 text-xl text-gray-700">
                <IoMdCart />
              </div>
              <div className="text-sm font-bold flex items-center gap-1 text-gray-700 hidden sm:flex">
                Rs.{total} <FaAngleDown className="text-[10px] text-gray-400" />
              </div>
            </button>
          </div>
        </div>
      </div>

      <nav
        className={`hidden lg:block w-full transition-all duration-300 z-50 ${isScrolled
          ? "fixed top-0 left-0 bg-white shadow-md border-none"
          : "border-t border-b border-gray-100 relative"
          }`}
      >
        <div className="max-w-[1140px] mx-auto px-4 flex items-center justify-center relative">

          <div
            className={`transition-opacity duration-300 flex items-center shrink-0 ${isScrolled ? "opacity-100 visible w-[120px] mr-4 mb-2" : "opacity-0 invisible w-0 mr-0"
              }`}
          >
            <Link href="/">
              {adminContact.logo && <Image src={adminContact.logo} alt="Company Logo" width={160} height={64} sizes="120px" unoptimized={adminContact.logo.startsWith("http://localhost:")} className="w-24 object-contain py-2" />}
            </Link>
          </div>

          <ul
            className={`flex justify-center items-center gap-8 text-[12.5px] font-rubik font-semibold text-dark-gray uppercase transition-all duration-300 ${isScrolled ? "py-8" : "py-5"
              }`}
          >
            {menuItems.map((menu, index) => (
              <li
                key={index}
                className="relative group flex items-center h-full"
                onMouseEnter={() => menu.megaMenu && setActiveMenu(index)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  href={menu.href || "#"}
                  className="tracking-wide transition hover:text-orange-dim flex items-center gap-1 cursor-pointer"
                >
                  {menu.name}
                  {menu.megaMenu && <span className="text-[9px] text-gray-400 ml-1">▼</span>}
                </Link>

                <AnimatePresence>
                  {activeMenu === index && menu.megaMenu && (
                  <motion.div
                    key={`mega-menu-${index}`}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.99 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-[100%] left-1/2 z-50 flex w-auto min-w-max -translate-x-1/2 gap-8 rounded-b-lg border-t-2 border-orange-dim bg-white p-6 shadow-xl motion-reduce:!transform-none"
                  >
                    {menu.megaMenu.map((column, i) => (
                      <div key={i} className="min-w-[160px]">
                        {column.title && (
                          <h3 className="font-rubik font-bold text-sm mb-4 border-b border-gray-100 pb-2 text-gray-800 normal-case">
                            <Link href={column.titleHref || "/product"}>
                              {column.title}
                            </Link>
                          </h3>
                        )}
                        <ul className="space-y-2">
                          {column.items.map((item, j) => (
                            <li key={j}>
                              <Link
                                href={item.href || item.link || "#"}
                                className="block py-1 text-sm text-gray-500 hover:text-orange-dim transition-colors normal-case"
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Background Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 lg:hidden ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-100">
          <h3 className="text-lg font-bold uppercase tracking-wider text-gray-800">Menu</h3>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-2xl text-gray-500 hover:text-black"
          >
            <IoCloseOutline />
          </button>
        </div>

        {/* Dynamic Mobile Top Bar Info */}
        <div className="text-center text-dark-gray border-b border-gray-100 p-4 bg-gray-50">
          <p className="text-xs font-rubik text-gray-600 mb-1">Contact Us 24/7: {adminContact.mobile}</p>
          <p className="text-xs font-rubik text-gray-600">{adminContact.email}</p>
        </div>

        <nav>
          <ul className="flex flex-col p-4 text-sm font-semibold text-gray-800 uppercase tracking-wider space-y-2">
            {menuItems.map((menu, index) => (
              <li key={index} className="border-b border-gray-50 pb-2">
                {menu.megaMenu ? (
                  <>
                    <button
                      onClick={() => setOpenMenu(openMenu === index ? null : index)}
                      className="w-full flex justify-between items-center py-2 uppercase text-left transition hover:text-orange-dim"
                    >
                      <span>{menu.name}</span>
                      <FaChevronDown
                        className={`transform transition-transform ${openMenu === index ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                    {openMenu === index && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-2 space-y-2 overflow-hidden pl-4 text-xs font-medium normal-case tracking-normal text-gray-600 motion-reduce:!transform-none"
                      >
                        {menu.megaMenu.map((col, i) => (
                          <div key={i} className="mb-3">
                            {col.title && (
                              <li className="font-bold text-gray-800 mt-2 mb-1">
                                <Link href={col.titleHref || "/product"}>
                                  {col.title}
                                </Link>
                              </li>
                            )}
                            {col.items.map((item, j) => (
                              <li key={j}>
                                <Link
                                  href={item.href || item.link || "#"}
                                  onClick={() => setMobileOpen(false)}
                                  className="block py-1 pl-2 hover:text-orange-dim"
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </div>
                        ))}
                      </motion.ul>
                    )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href={menu.href || "#"}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 hover:text-orange-dim"
                  >
                    {menu.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

function CartData({ item }) {
  let { productId, productImage, productName, productPrice, qty, productCategory } = item;
  
  return (
    <div className="relative grid grid-cols-[30%_auto] gap-4 border-b border-gray-100 py-4 px-2 hover:bg-gray-50 transition-colors">
      <Link
        href={`/`}
        className="flex items-center justify-center bg-gray-100 rounded-sm p-1"
      >
        <Image src={productImage} alt={productName} width={120} height={80} sizes="120px" unoptimized={productImage.startsWith("http://localhost:")} className="w-full h-auto max-h-20 object-contain" />
      </Link>
      <div className="pr-6">
        <div className="mb-1">
          <Link
            href={`/`}
            className="font-playfair text-sm font-bold text-gray-800 hover:text-orange-dim line-clamp-2"
          >
            {productName}
          </Link>
        </div>
        <div className="mb-1">
          <span className="font-rubik text-[11px] text-gray-500 bg-gray-100 px-2 py-1 rounded-sm">
            Qty: {qty}
          </span>
        </div>
        <div className="flex gap-2 mt-2">
          <span className="font-rubik text-sm font-semibold text-orange-dim">
            Rs. {productPrice}
          </span>
        </div>
        <button
          className="absolute right-2 top-4 text-gray-400 hover:text-red-500 transition-colors p-1"
          aria-label="Remove item"
        >
          <IoCloseOutline className="text-xl" />
        </button>
      </div>
    </div>
  );
}