import React from "react";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from "./components/pages/Login/login";
import Layout from "./components/pages/common/layout";

import Dashboard from "./components/pages/common/dashboard";
import ViewUser from "./components/pages/User/User";
import ContactEnquiry from './components/pages/Contactenquiry/ContactEnquiry';
import Newsletter from './components/pages/Newsletter/Newsletter';
import ViewColor from "./components/pages/color/ViewColor";
import AddColor from './components/pages/color/AddColor';
import ViewMaterial from "./components/pages/material/ViewMaterial";
import AddMaterial from "./components/pages/material/AddMaterial";
import AddCategory from './components/pages/category/AddCategory';
import ViewCategory from './components/pages/category/ViewCategory';
import AddSubCategory from './components/pages/category/subcategory/AddSubCategory';
import ViewSubCategory from './components/pages/category/subcategory/ViewSubCategory';
import AddSubSubCategory from './components/pages/category/subsubcategory/AddSubSubCategory';
import ViewSubSubCategory from './components/pages/category/subsubcategory/ViewSubSubCategory';
import ViewProduct from "./components/pages/product/ViewProduct";
import AddProduct from "./components/pages/product/AddProduct";
import AddWhyChooseUs from './components/pages/why-choose-us/AddWhyChooseUs';
import ViewWhyChooseUs from './components/pages/why-choose-us/ViewWhyChooseUs';
import Orders from "./components/pages/Order/Order";
import ViewSlider from "./components/pages/slider/ViewSlider";
import AddSlider from "./components/pages/slider/AddSlider";
import ViewCountry from "./components/pages/country/ViewCountry";
import AddCountry from "./components/pages/country/AddCountry";
import ViewTestimonial from "./components/pages/testimonial/ViewTestimonial";
import AddTestimonial from "./components/pages/testimonial/AddTestimonial";
import AddFAQS from './components/pages/faqs/AddFAQ';
import ViewFAQS from './components/pages/faqs/ViewFAQ';
import Profile from "./components/pages/Profiles/AdminProfile";
import CompanyProfile from "./components/pages/Profiles/CompanyProfile";
import ProductDetails from "./components/pages/product/ProductDetails";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user" element={<ViewUser />} />

            <Route path="/enquiry">
              <Route path="contact" element={<ContactEnquiry />} />
              <Route path="newsletter" element={<Newsletter />} />
            </Route>

            <Route path="/color">
              <Route path="add" element={<AddColor />} />
              <Route path="edit-color/:id" element={<AddColor />} />
              <Route path="view" element={<ViewColor />} />
            </Route>

            <Route path="/material">
              <Route path="add" element={<AddMaterial />} />
              <Route path="edit-material/:id" element={<AddMaterial />} />
              <Route path="view" element={<ViewMaterial />} />
            </Route>

            <Route path="/category">
              <Route path="add" element={<AddCategory />} />
              <Route path="view" element={<ViewCategory />} />
              <Route path="edit-category/:id" element={<AddCategory />} />
              <Route path="subcategory">
                <Route path="add" element={<AddSubCategory />} />
                <Route path="view" element={<ViewSubCategory />} />
                <Route path="edit-subcategory/:id" element={<AddSubCategory />} />
              </Route>
              <Route path="subsubcategory">
                <Route path="add" element={<AddSubSubCategory />} />
                <Route path="view" element={<ViewSubSubCategory />} />
                <Route path="edit-subsubcategory/:id" element={<AddSubSubCategory />} />

              </Route>
            </Route>

            <Route path="/product">
              <Route path="add" element={<AddProduct />} />
              <Route path="view" element={<ViewProduct />} />
              <Route path="edit-product/:id" element={<AddProduct />} />

              <Route path="product-details/:id" element={<ProductDetails />} />
            </Route>

            <Route path="/why-choose-us">
              <Route path="add" element={<AddWhyChooseUs />} />
              <Route path="view" element={<ViewWhyChooseUs />} />
            </Route>

            <Route path="/orders">
              <Route path="view" element={<Orders />} />
            </Route>

            <Route path="/sliders">
              <Route path="add" element={<AddSlider />} />
              <Route path="view" element={<ViewSlider />} />
              <Route path="edit-slider/:id" element={<AddSlider />} />
            </Route>

            <Route path="/country">
              <Route path="add" element={<AddCountry />} />
              <Route path="edit-country/:id" element={<AddCountry />} />
              <Route path="view" element={<ViewCountry />} />
            </Route>

            <Route path="/testimonial/add" element={<AddTestimonial />} />
            <Route path="/testimonial/view" element={<ViewTestimonial />} />
            <Route path="/testimonial/edit-testimonial/:id" element={<AddTestimonial />} />

            <Route path="/faqs">
              <Route path="add" element={<AddFAQS />} />
              <Route path="edit-faq/:id" element={<AddFAQS />} />
              <Route path="view" element={<ViewFAQS />} />
            </Route>

            <Route path="/profile" element={<Profile />} />
            <Route path="/company-profile" element={<CompanyProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}