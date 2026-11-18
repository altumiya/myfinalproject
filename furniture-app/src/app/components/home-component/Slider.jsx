"use client"
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import axios from 'axios';
import { motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function Slider() {
    const [sliders, setSliders] = useState([]);
    const [imagePath, setImagePath] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchSliders = async () => {
            try {
                // Adjust the URL to match your backend base URL if it's deployed
                const res = await axios.get('http://localhost:8000/api/web/home/slider');
                
                if (res.data.status) {
                    setSliders(res.data.data);
                    setImagePath(res.data.path);
                }
            } catch (error) {
                console.error("Error fetching sliders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSliders();
    }, []);

    // Optional loading state placeholder
    if (loading) {
        return <div className="flex h-64 items-center justify-center">Loading...</div>;
    }

    // Don't render the swiper if there are no active sliders in the database
    if (sliders.length === 0) {
        return null;
    }

    return (
        <div className='home-banner'>
            <Swiper
                modules={[Pagination, Autoplay, EffectFade]}
                spaceBetween={0}
                slidesPerView={1}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={600}
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 4500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                loop={sliders.length > 1}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            >
                {sliders.map((slider, index) => (
                    <SwiperSlide key={slider._id}>
                        <div className="w-full h-[250px] sm:h-[200px] md:h-[300px] lg:h-[400px] overflow-hidden">
                        <motion.img
                            src={`${imagePath}${slider.image}`} 
                            alt={slider.name || "Slider Image"} 
                            className="block h-full w-full object-cover motion-reduce:!transform-none"
                            initial={{ scale: 1.07 }}
                            animate={{
                                scale: activeIndex === index ? 1.1 : 1.04,
                            }}
                            transition={{
                                duration: activeIndex === index ? 6 : 0.6,
                                ease: "linear",
                            }}
                        />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}