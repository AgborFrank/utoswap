"use client"; // Required for Framer Motion

import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

// Animation variants for the section
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: "easeOut" } },
};

// Animation variants for content (left and right sides)
const contentVariants = {
  hidden: { opacity: 0, x: 0 },
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

export default function TradeOnUniswap() {
  const t = useTranslations("common.swap");
  const ref = useRef(null); // Ref to track when section is in view
  const isInView = useInView(ref, { once: true, amount: 0.3 }); // Trigger when 30% is visible

  return (
    <motion.section
      ref={ref}
      className="py-20 bg-cta md:px-0 px-6"
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="flex md:flex-row flex-col items-center max-w-screen-xl mx-auto gap-12">
        {/* Left: Text, Description, CTA */}
        <motion.div
          className="md:w-1/2 w-full flex flex-col justify-center md:pr-40 pr-10"
          variants={contentVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0} // Index 0 for left side
        >
          <h2 className="md:text-5xl text-5xl text-black font-bold mb-4">
            {t("uniswap_trade_title")}
          </h2>
          <p className="text-lg text-black mb-10">
            {t("uniswap_trade_description")}
          </p>
          <Link
            href="https://app.uniswap.org/" // Replace with the actual Uniswap link for UTOP trading
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-black text-cta font-semibold py-3 px-6 rounded-full hover:text-black hover:bg-cta transition-colors duration-300 w-fit"
          >
            {t("uniswap_trade_cta")}
          </Link>
        </motion.div>

        {/* Right: Image */}
        <motion.div
          className="md:w-1/2 w-full"
          variants={contentVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={1} // Index 1 for right side
        >
          <Image
            src="/assets/img/uniswap-trade.webp" // Replace with your actual image path
            alt={t("uniswap_trade_image_alt")}
            width={500}
            height={300}
            className="rounded-lg"
          />
        </motion.div>
      </div>
    </motion.section>
  );
}