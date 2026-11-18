"use client";

import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function StaggerItem({
  as = "div",
  children,
  className,
  variant = "fadeUp",
  ...props
}) {
  const MotionElement = motion[as] || motion.div;

  return (
    <MotionElement
      className={`${className || ""} motion-reduce:!opacity-100 motion-reduce:!transform-none`}
      variants={variant === "scale" ? scaleVariants : itemVariants}
      {...props}
    >
      {children}
    </MotionElement>
  );
}
