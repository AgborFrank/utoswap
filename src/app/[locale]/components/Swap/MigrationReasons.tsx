"use client"; // Required for Framer Motion

import { motion, useInView } from "framer-motion";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useTranslations } from "next-intl";
import { useRef } from "react";

// Define the type for each reason object
interface MigrationReason {
  key: string; // Translation key for title and description
  icon: string;
}

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

export default function MigrationReasons() {
  const t = useTranslations("common.swap");
  const ref = useRef(null); // Ref to track when section is in view
  const isInView = useInView(ref, { once: true, amount: 0.3 }); // Trigger when 30% is visible

  // Constant array with TypeScript typing, using keys for translations
  const migrationReasons: MigrationReason[] = [
    {
      key: "enhanced_security",
      icon: "streamline:interface-id-thumb-mark-identification-password-touch-id-secure-fingerprint-finger-security",
    },
    {
      key: "improved_performance",
      icon: "line-md:speed-twotone-loop",
    },
    {
      key: "new_features",
      icon: "solar:graph-new-bold-duotone",
    },
    {
      key: "future_proofing",
      icon: "icon-park-twotone:seedling",
    },
  ];

  return (
    <motion.section
      ref={ref}
      className="py-28 bg-gradient-to-b from-background to-grade md:px-0 px-6"
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-4xl text-black font-bold text-center my-12">
          {t("migration_reasons_title")}
        </h2>
        <div className="grid md:grid-cols-4 grid-cols-2 gap-8">
          {migrationReasons.map((reason, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white/20 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              variants={gridItemVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={index}
            >
              <Icon
                icon={reason.icon}
                width={40}
                height={40}
                className="text-cta mb-6"
              />
              <h3 className="text-lg text-text font-semibold mb-4">
                {t(`${reason.key}.title`)}
              </h3>
              <p className="text-text opacity-70 text-sm">
                {t(`${reason.key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}