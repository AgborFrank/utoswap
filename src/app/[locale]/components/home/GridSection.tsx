"use client"; // Required for Framer Motion

import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef } from "react";

// Animation variants for the section
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: "easeOut" } },
};

// Animation variants for grid items (staggered effect)
const gridItemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.2, // Stagger each item by 0.2s
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export default function Introduction() {
  const t = useTranslations("common.home.intro");
  const ref = useRef(null); // Ref to track when section is in view
  const isInView = useInView(ref, { once: true, amount: 0.3 }); // Trigger when 30% is visible

  // Grid data for easier mapping
  const gridItems = [
    {
      bg: "bg-[#0066ff1f]",
      labelBg: "bg-[#2abdff]",
      label: t("about"),
      title: t("g1.title"),
      titleColor: "text-[#2abdff]",
      desc: t("g1.desc"),
      subItems: [
        { title: t("g1.erth"), desc: t("g1.erthDesc") },
        { title: t("g1.utop"), desc: t("g1.utopDesc") },
      ],
      extraItem: { title: t("g1.serv"), desc: t("g1.servDesc") },
    },
    {
      bg: "bg-cta/10",
      labelBg: "bg-cta",
      label: "UTOPOS Bridge",
      title: "Seamlessly Bridge UTOP Across Blockchains",
      titleColor: "text-cta",
      desc: "Effortlessly transfer your UTOP tokens between blockchains with speed, security, and low fees—unlocking new possibilities for your assets.",
      image: { src: "/assets/img/swap.png", alt: "UTOP Swap", width: 300, height: 600 },
    },
    {
      bg: "bg-[#15221f]",
      labelBg: "bg-[#01bc99]",
      label: "Sustainability",
      title: "Futuristic City Design with Smart, Eco-Friendly Building Construction",
      titleColor: "text-[#01bc99]",
    },
    {
      bg: "bg-[#241b33]",
      labelBg: "bg-[#a457ff]",
      label: "Liquidity",
      title: "Trade UTOP on Uniswap, Join Millions of UTOP Holders Worldwide",
      titleColor: "text-[#a457ff]",
    },
  ];

  return (
    <motion.section
      ref={ref}
      className="max-w-screen-xl mx-auto py-36 md:px-0 px-6"
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="w-full">
        <h2 className="lg:text-6xl text-3xl text-text">{t("title")}</h2>
        <h3 className="lg:text-3xl text-xl text-text opacity-70">{t("subtitle")}</h3>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 pt-20 gap-6 xl:gap-20">
        {gridItems.map((item, index) => (
          <motion.div
            key={index}
            className={`rounded-2xl p-9 ${item.bg}`}
            variants={gridItemVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={index}
          >
            <div
              className={`dic ${item.labelBg} w-fit px-6 py-2 text-md capitalize font-semibold rounded-full`}
            >
              {item.label}
            </div>
            <h3 className={`${item.titleColor} text-4xl pt-4`}>{item.title}</h3>
            {item.desc && <p className="text-text opacity-70 mt-4">{item.desc}</p>}

            {/* Sub-items for the first grid item */}
            {item.subItems && (
              <div className="grid grid-cols-2 gap-4 pt-8">
                {item.subItems.map((sub, idx) => (
                  <div key={idx} className="rounded-2xl bg-grade p-4">
                    <h1 className="text-text mb-3 text-2xl">{sub.title}</h1>
                    <p className="text-sm text-text opacity-70">{sub.desc}</p>
                  </div>
                ))}
              </div>
            )}
            {item.extraItem && (
              <div className="rounded-2xl bg-grade p-4 mt-4">
                <h1 className="text-text mb-3 text-2xl">{item.extraItem.title}</h1>
                <p className="text-sm text-text opacity-70">{item.extraItem.desc}</p>
              </div>
            )}

            {/* Image for the second grid item */}
            {item.image && (
              <div className="wap pt-6 relative bottom-0">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  width={item.image.width}
                  height={item.image.height}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}