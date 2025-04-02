"use client"; // Required for Framer Motion

import { motion, useInView, Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import SwapForm from "../Forms/SwapForm";
import { useRef } from "react";

// Animation variants for the section
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: "easeOut" } },
};

// Animation variants for the content (left and right sides)
const contentVariants: Variants = {
  hidden: { opacity: 0, x: 0 }, // Static initial value; dynamic x handled via custom
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.3, // Stagger: 0s for left, 0.3s for right
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

// Define initial x offsets based on index
const getInitialX = (index: number) => (index === 0 ? -30 : 30);

export default function BridgeHero() {
  const t = useTranslations("common.bridge");
  const ref = useRef(null); // Ref to track when section is in view
  const isInView = useInView(ref, { once: true, amount: 0.3 }); // Trigger when 30% is visible

  return (
    <motion.section
      ref={ref}
      className="py-20 md:px-0 px-6 backdrop-blur-lg"
      style={{
        backgroundImage: "url('/assets/img/bridge.webp')",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backdropFilter: "blur(10px)", // Subtle background blur
      }}
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="flex md:flex-row flex-col justify-between max-w-screen-xl mx-auto items-center space-y-8">
        {/* Left Side - Text */}
        <motion.div
          className="md:w-1/2 w-full"
          variants={contentVariants}
          initial={{ ...contentVariants.hidden, x: getInitialX(0) }} // Apply dynamic x here
          animate={isInView ? "visible" : "hidden"}
          custom={0} // Index 0 for left side
        >
          <div className="md:max-w-[80%]">
            <h3 className="md:text-6xl text-5xl text-white font-bold leading-tight">
              {t("hero_title")}
            </h3>
            <p className="mt-4 text-lg text-gray-300">{t("hero_description")}</p>
          </div>
        </motion.div>

        {/* Right Side - Swap Form */}
        <motion.div
          className="md:w-1/2 w-full"
          variants={contentVariants}
          initial={{ ...contentVariants.hidden, x: getInitialX(1) }} // Apply dynamic x here
          animate={isInView ? "visible" : "hidden"}
          custom={1} // Index 1 for right side
        >
          <SwapForm />
        </motion.div>
      </div>
    </motion.section>
  );
}