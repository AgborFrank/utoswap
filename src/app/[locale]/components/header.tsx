"use client";

import { useState } from "react";
import { Button, Link } from "@heroui/react";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";
import Image from "next/image";
import {  useAppKitAccount, useDisconnect } from "@reown/appkit/react"; // Reown hooks
import { motion } from "framer-motion";

// Animation variants (unchanged)
const headerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const mobileMenuVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const menuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.3, ease: "easeOut" },
  }),
};

export default function Header() {
  const t = useTranslations("common.Navigation");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const locale = useLocale();
  const { address, isConnected } = useAppKitAccount(); // Reown hook for account info
  const { disconnect } = useDisconnect(); // Reown hook for disconnecting

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleDisconnect = () => {
    disconnect();
    setIsMenuOpen(false);
  };

  const menus = [
    { title: t("bridge"), href: `/${locale}/bridge`, icon: "mdi:bridge" },
    { title: t("swap"), href: `/${locale}/swap`, icon: "mdi:bridge" },
    { title: t("history"), href: `/${locale}/history`, icon: "mdi:history" },
    { title: t("docs"), href: `/${locale}/docs`, icon: "mdi:book-open-page-variant" },
    { title: t("support"), href: `/${locale}/support`, icon: "mdi:help-circle-outline" },
  ];

  return (
    <motion.header
      className="flex z-100 w-full items-center sticky top-0 bg-black shadow-sm"
      style={{ zIndex: 1000 }}
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex w-full px-6 items-center justify-between md:max-w-screen-xl mx-auto py-4">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <Image src="/assets/img/logo.png" alt="Utoswap" width={150} height={60} />
          </Link>
        </div>
        <nav className="hidden md:flex space-x-8 items-center">
          {menus.map((menu) => (
            <Link
              key={menu.title}
              href={menu.href}
              className="font-normal text-white flex items-center gap-2 hover:text-cta transition-colors"
            >
              {menu.title}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          <LocaleSwitcherSelect defaultValue={locale} label={t("label")} />
          {isConnected ? (
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <Button
                onPress={handleDisconnect}
                className="bg-cta/10 text-cta hover:text-cta"
                size="sm"
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <appkit-button />
          )}
        </div>
        <Button
          className="md:hidden p-2 text-white rounded-lg bg-cta/10 hover:opacity-80 focus:outline-none"
          onPress={toggleMenu}
          aria-label="Toggle menu"
        >
          <Icon icon="duo-icons:menu" className="text-2xl" />
          Menu
        </Button>
      </div>
      {isMenuOpen && (
        <motion.div
          className="md:hidden bg-black shadow-lg absolute top-full inset-x-0"
          style={{ zIndex: 2000 }}
          variants={mobileMenuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <nav className="flex flex-col space-y-4 p-8">
            {menus.map((menu, index) => (
              <motion.div
                key={menu.title}
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                <Link
                  href={menu.href}
                  className="text-gray-100 flex items-center gap-2 hover:text-cta transition-colors"
                >
                  {menu.title}
                </Link>
              </motion.div>
            ))}
            <div className="border-t border-gray-200 pt-4">
              {isConnected ? (
                <div className="flex flex-col gap-2">
                  <span className="text-gray-800 font-medium">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                  <Button
                    onPress={handleDisconnect}
                    className="bg-cta text-black px-4 py-2 rounded-2xl hover:bg-cta"
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <appkit-button /> 
              )}
              <div className="mt-4">
                <LocaleSwitcherSelect defaultValue={locale} label={t("label")} />
              </div>
            </div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}