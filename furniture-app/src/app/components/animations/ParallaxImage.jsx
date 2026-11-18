"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ParallaxImage({
  src,
  alt = "",
  className = "",
  imageClassName = "",
}) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-2%", "2%"]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden={alt ? undefined : "true"}
    >
      <motion.img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover motion-reduce:!transform-none motion-reduce:!opacity-100 ${imageClassName}`}
        initial={{ scale: 1.04 }}
        whileInView={{ scale: 1.1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 8, ease: "linear" }}
        style={{ y }}
      />
    </div>
  );
}
