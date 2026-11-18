"use client"
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "../product-component/ProductCard";

export default function BestSellingProduct({data}) {
    const product = data.data || [];
    const path = data.path || "";
     
  return (
    <>
      <div className="w-full max-w-[1140px] mx-auto px-2 py-10">
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2 text-center sm:flex-nowrap sm:justify-start sm:text-left">
          <h2 className="w-full text-2xl font-playfair font-bold sm:w-auto sm:text-3xl">
            Bestselling Products
          </h2>
          <div className="hidden h-[2px] flex-1 bg-gray-200 sm:mx-5 sm:block"></div>
          <div className="flex basis-full justify-center gap-2 sm:basis-auto">
            <button className="prev-btn flex items-end justify-center text-xl font-rubik">
              <MdKeyboardArrowLeft />
            </button>
            <button className="next-btn flex items-end justify-center text-xl font-rubik">
              <MdKeyboardArrowRight />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation={{
              nextEl: ".next-btn",
              prevEl: ".prev-btn"
          }}
          slidesPerView={5}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },

            640: {
              slidesPerView: 2,
            },

            1024: {
              slidesPerView: 4,
            },

            1280: {
              slidesPerView: 5,
            },
          }}
        >
            
            {
                product.map((obj, index)=>{
                  return(
                   <SwiperSlide key={obj.id || index}>
                        <ProductCard path={path} productData={obj} animationDelay={index * 0.1} />
                   </SwiperSlide>
                    )
                })
            }
            
        </Swiper>
      </div>
    </>
  );
}
