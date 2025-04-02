"use client"; // Required for Framer Motion

import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRef } from "react";

// Animation variants for the section
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: "easeOut" } },
};

// Animation variants for grid items (staggered effect)
const gridItemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.2, // Stagger each item by 0.2s
      duration: 0.5,
      type: "spring", 
      stiffness: 100
    },
  }),
};

// Animation variants for the left content (text + CTA)
const contentVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function TokenFeatures() {
  const t = useTranslations("common.bridge.features");
  const ref = useRef(null); // Ref to track when section is in view
  const isInView = useInView(ref, { once: true, amount: 0.3 }); // Trigger when 30% is visible

  // Grid data for easier mapping
  const stats = [
    { label: t("tsupply"), value: "10.0T", textColor: "text-white" },
    { label: t("swappers"), value: "16.6B +", textColor: "text-white" },
    { label: t("liquidity"), value: "$5.5K", textColor: "text-white" },
    {
      label: t("volume"),
      value: "$1.3K",
      textColor: "text-[#30d36c]",
      labelColor: "text-[#32d96f]",
    },
  ];

  return (
    <motion.section
      ref={ref}
      className="max-w-screen-xl mx-auto md:px-0 px-6 py-40"
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="flex md:flex-row flex-col gap-20">
        {/* Left Side - Text + CTA */}
        <motion.div
          className="md:w-1/2 w-full"
          variants={contentVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h1 className="text-6xl text-white">{t("title")}</h1>
          <div className="py-14">
            <p className="text-white">{t("desc")}</p>
          </div>
          <div className="cta">
            <Link
              href="#"
              className="text-lg font-bold bg-cta/10 text-cta hover:bg-cta hover:text-black py-3 px-6 rounded-full"
            >
              {t("cta")}
            </Link>
          </div>
        </motion.div>

        {/* Right Side - Grid */}
        <div className="md:w-1/2 w-full">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="rounded-xl p-6 bg-[#313131b8]"
                variants={gridItemVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                custom={index}
              >
                <h3
                  className={`opacity-60 text-lg ${
                    stat.labelColor || "text-white"
                  }`}
                >
                  {stat.label}
                </h3>
                <h1 className={`text-5xl ${stat.textColor} pt-8`}>
                  {stat.value}
                </h1>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}