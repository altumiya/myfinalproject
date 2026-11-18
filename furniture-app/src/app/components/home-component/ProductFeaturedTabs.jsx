"use client"
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "../product-component/ProductCard";

export default function ProductFeaturedTabs({ data = [], path = "" }) {
  const [productTab, setProductTab] = useState("Featured");
  const tabs = ["Featured", "New Arrivals", "On Sale"];
  const visibleProducts = data.filter(
    (product) =>
      product.productType === productTab ||
      (productTab === "On Sale" && product.upSell === true)
  );

  return (
    <>
      <div className="w-full max-w-[1140px] mx-auto px-2 py-5">
        <div className="flex items-center justify-center">
          <div
            className={`flex 
                    relative 
                    border-2 
                    border-gray-200 
                    before:content-empty 
                    before:hidden
                    sm:before:block
                    before:absolute 
                    before:w-[200px] 
                    before:h-[2px] 
                    before:right-full 
                    before:top-1/2
                    before:-translate-y-1/2
                    before:bg-gradient-to-r
                    before:from-transparent
                    before:to-[#ebebeb]
                    after:content-empty
                    after:hidden
                    sm:after:block
                    after:absolute
                    after:w-[200px]
                    after:h-[2px]
                    after:left-[100.4%]
                    after:top-1/2
                    after:-translate-y-1/2
                    after:bg-gradient-to-r
                    after:from-[#ebebeb]
                    after:to-transparent
                    `}
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setProductTab(tab)}
                className={`relative px-3 py-2 text-sm font-playfair font-bold last:border-r-2 last:border-gray-200 sm:px-5 sm:text-lg ${
                  productTab === tab
                    ? "z-10 text-orange-dim"
                    : "text-dark-gray border-l-2 border-gray-200"
                }`}
              >
                {productTab === tab && (
                  <motion.span
                    layoutId="featured-tab-indicator"
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-[-2px] border-2 border-orange-dim"
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={productTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 motion-reduce:!opacity-100 motion-reduce:!transform-none"
          >
            {visibleProducts.length ? (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                {visibleProducts.map((product, index) => (
                  <ProductCard
                    key={product._id}
                    productData={product}
                    path={path}
                    animationDelay={index * 0.1}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center font-rubik text-sm text-gray-500">
                No products are available in this collection.
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
