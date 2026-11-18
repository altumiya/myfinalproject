"use client"
import React, { useState } from 'react'
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from "framer-motion";
import Image from "next/image";
import 'swiper/css';
import 'swiper/css/bundle';
import { FaStar } from "react-icons/fa";

export default function CustomerFeedback({ data }) {
    const [activeIndex, setActiveIndex] = useState(0);
    // Base path for images. (Adjust if your backend runs on a different port/URL)
    const imageBasePath = 'http://localhost:8000/uploads/testimonial/';

    // Fallback if data hasn't loaded or is empty
    if (!data || data.length === 0) {
        return <p className="text-center text-gray-500 py-10">Loading testimonials...</p>;
    }

    return (
        <div>
            <div className="mb-4">
                <h2 className="text-2xl font-playfair font-bold mb-2">
                    What Our Customers Say ?
                </h2>
            </div>
            
            <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                speed={600}
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            >
                {data.map((item, index) => (
                    <SwiperSlide key={item._id || index}>
                        <motion.div
                            animate={{ scale: activeIndex === index ? 1 : 0.98 }}
                            className="motion-reduce:!opacity-100 motion-reduce:!transform-none"
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <p className='px-2 text-base/7 font-rubik text-dark-gray'>
                                {item.message}
                            </p>
                            <div className='flex place-content-center'>
                                <div className='mt-6 grid grid-cols-1 justify-items-center gap-3'>
                                    <Image
                                        width={96}
                                        height={96}
                                        sizes="96px"
                                        unoptimized={imageBasePath.startsWith("http://localhost:")}
                                        className="mb-2 h-24 w-24 rounded-full object-cover"
                                        src={item.image ? `${imageBasePath}${item.image}` : "/testimonial1.png"}
                                        alt={item.name}
                                    />
                                    <h5 className="text-base font-semibold tracking-tight font-playfair uppercase">
                                        {item.name}
                                    </h5>
                                    <span className="text-sm font-rubik text-dark-gray">
                                        {item.designation}
                                    </span>
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.5 }}
                                        transition={{ duration: 0.4, delay: 0.15 }}
                                        className='mb-4 flex justify-center gap-1 text-sm motion-reduce:!opacity-100 motion-reduce:!transform-none'
                                    >
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                className={star <= (item.rating || 5) ? 'text-orange-dim' : 'text-gray-300'}
                                            />
                                        ))}
                                    </motion.div>
                                    <div className='p-4' />
                                </div>
                            </div>
                        </motion.div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}