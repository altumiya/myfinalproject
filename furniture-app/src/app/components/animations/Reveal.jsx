"use client";

import { motion } from "framer-motion";

export default function Reveal({
  as = "div",
  children,
  className,
  delay = 0,
  duration = 0.7,
  amount = 0.15,
  once = true,
  initial = { opacity: 0, y: 22 },
  ...props
}) {
  const MotionElement = motion[as] || motion.div;

  return (
    <MotionElement
      className={`${className || ""} motion-reduce:!opacity-100 motion-reduce:!transform-none`}
      initial={initial}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </MotionElement>
  );
}
