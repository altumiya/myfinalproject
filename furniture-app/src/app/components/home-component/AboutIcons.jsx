"use client";

import { motion } from "framer-motion";
import { IoEarthSharp } from "react-icons/io5";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { GoClock } from "react-icons/go";
import Reveal from "../animations/Reveal";
import StaggerContainer from "../animations/StaggerContainer";
import StaggerItem from "../animations/StaggerItem";

const benefits = [
  {
    title: "Free Shipping",
    description: "Free shipping on all order",
    Icon: IoEarthSharp,
  },
  {
    title: "Money Return",
    description: "Back guarantee under 7 days",
    Icon: IoMdCheckmarkCircleOutline,
  },
  {
    title: "Online Support",
    description: "Support online 24 hours a day",
    Icon: GoClock,
  },
];

export default function AboutIcons() {
  return (
    <Reveal as="section" className="bg-gray-50" amount={0.18}>
      <div className="mx-auto max-w-[1120px] px-4 py-8 sm:py-16 lg:px-6">
        <StaggerContainer
          className="space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3"
          amount={0.2}
        >
          {benefits.map(({ title, description, Icon }) => (
            <StaggerItem
              key={title}
              className="text-center"
              variant="scale"
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.6 },
                  },
                }}
                className="mb-4 inline-flex h-10 w-10 place-items-center items-center justify-center rounded-full border-1 bg-primary-100 motion-reduce:!opacity-100 motion-reduce:!transform-none lg:h-15 lg:w-15"
              >
                <Icon className="text-xl text-gray-600" />
              </motion.div>
              <Reveal
                as="h3"
                amount={0.3}
                delay={0.1}
                duration={0.45}
                className="mb-2 text-center font-playfair text-xl font-bold"
              >
                {title}
              </Reveal>
              <Reveal
                as="p"
                amount={0.3}
                delay={0.2}
                duration={0.45}
                className="text-center font-rubik text-gray-500"
              >
                {description}
              </Reveal>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </Reveal>
  );
}
