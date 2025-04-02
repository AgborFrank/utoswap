"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Key for AnimatePresence
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname} // Ensures animation triggers on route change
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ ease: "easeInOut", duration: 0.75 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}