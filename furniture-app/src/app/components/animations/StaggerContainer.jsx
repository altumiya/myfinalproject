"use client";

import { motion } from "framer-motion";

export default function StaggerContainer({
  as = "div",
  children,
  className,
  amount = 0.2,
  stagger = 0.12,
  delayChildren = 0.08,
  once = true,
  ...props
}) {
  const MotionElement = motion[as] || motion.div;

  return (
    <MotionElement
      className={className}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren,
            staggerChildren: stagger,
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      {...props}
    >
      {children}
    </MotionElement>
  );
}
