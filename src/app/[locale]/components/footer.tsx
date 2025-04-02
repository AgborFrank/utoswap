"use client"; // Required for Framer Motion

import { motion, useInView } from "framer-motion";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";
import { useRef } from "react";

// Define types for FooterLinks
interface FooterLink {
  labelKey: string; // Translation key
  href: string;
  external?: boolean;
}

interface SocialLink extends FooterLink {
  icon: string;
}

// Animation variants for the section
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: "easeOut" } },
};

// Animation variants for content sections (staggered effect)
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2, // Stagger each section by 0.2s
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export default function Footer() {
  const t = useTranslations("common.footer"); // General footer text
  const tNav = useTranslations("common.Navigation"); // Reuse Navigation namespace
  const tapp = useTranslations("common.footer.app"); // App-specific translations
  const tExplore = useTranslations("common.footer.exploreMore"); // Explore More translations
  const tCompany = useTranslations("common.footer.company"); // Company translations
  const tLegal = useTranslations("common.footer.legal"); // Legal translations

  const ref = useRef(null); // Ref to track when section is in view
  const isInView = useInView(ref, { once: true, amount: 0.2 }); // Trigger when 20% is visible

  const FooterLinks: {
    app: FooterLink[];
    exploreMore: FooterLink[];
    company: FooterLink[];
    legal: FooterLink[];
    social: SocialLink[];
  } = {
    app: [
      { labelKey: "swap", href: "/swap" },
      { labelKey: "bridge", href: "/bridge" },
      { labelKey: "buy", href: "/buy" },
      { labelKey: "stake", href: "/stake" },
      { labelKey: "liquidity", href: "/liquidity" },
    ],
    exploreMore: [
      { labelKey: "howItWorks", href: "https://utopos.io/assets/utopos_whitepaper.pdf", external: true },
      { labelKey: "docs", href: "/docs" },
      { labelKey: "tokenomics", href: "https://utopos.io/tokenomics", external: true },
      { labelKey: "contact", href: "/contact" },
    ],
    company: [
      { labelKey: "about", href: "/about" },
      { labelKey: "team", href: "/team" },
      { labelKey: "support", href: "/support" },
      { labelKey: "blog", href: "/blog" },
    ],
    legal: [
      { labelKey: "privacy", href: "/privacy-policy" },
      { labelKey: "terms", href: "/terms-of-use" },
      { labelKey: "risk", href: "/risk-disclosure" },
      { labelKey: "compliance", href: "/compliance" },
    ],
    social: [
      { labelKey: "twitter", href: "https://x.com/utopbridge", icon: "prime:twitter", external: true },
      { labelKey: "discord", href: "https://discord.gg/utopbridge", icon: "ic:baseline-discord", external: true },
      { labelKey: "telegram", href: "https://t.me/utopbridge", icon: "mdi:telegram", external: true },
      { labelKey: "github", href: "https://github.com/utopbridge", icon: "mdi:github", external: true },
      { labelKey: "medium", href: "https://medium.com/utopbridge", icon: "entypo-social:medium-with-circle", external: true },
    ],
  };

  return (
    <motion.section
      ref={ref}
      className="font-mon bg-gradient-to-b from-background to-grade pb-8"
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="bg-transparent">
        <footer className="relative overflow-hidden px-10 pt-16 text-text bg-transparent max-w-screen-xl mx-auto">
          <div className="divide-gray-700 text-sm md:text-base">
            <div className="grid grid-cols-2 gap-8 pb-20 lg:grid-cols-6">
              {/* Brand and Description */}
              <motion.div
                className="col-span-2 place-self-center lg:place-self-auto"
                
                variants={contentVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                custom={0} // First item
              >
                <Link href="/" title={t("brandTitle") || "Utopos"}>
                  <Image src="/assets/img/footer.png" alt={t("brandAlt") || "Utoswap"} width={150} height={60} />
                </Link>
                <p className="text-center text-sm text-text opacity-70 lg:text-left mt-4">
                  {t("description") || "Bridge your UTOP tokens from V1/V2 to V3 on Polygon."}
                </p>

                {/* Social Links */}
                <ul className="flex gap-5 mt-4">
                  {FooterLinks.social.map(({ labelKey, href, icon }, index) => (
                    <motion.li
                      key={labelKey}
                      variants={contentVariants}
                      initial="hidden"
                      animate={isInView ? "visible" : "hidden"}
                      custom={index + 1} // Stagger social icons slightly after brand
                    >
                      <Link href={href} target="_blank" rel="noreferrer" aria-label={t(`social.${labelKey}`) || labelKey}>
                        <Icon icon={icon} width="32" height="32" className="text-text opacity-70" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Links Sections */}
              {Object.entries(FooterLinks).map(([section, links], sectionIndex) => {
                if (section === "social") return null;
                return (
                  <motion.div
                    key={section}
                    className="col-span-1 space-y-4"
                   
                    variants={contentVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    custom={sectionIndex + 1} // Stagger each column
                  >
                    <h3 className="text-xs font-medium text-text capitalize brightness-125 md:text-[16px]">
                      {t(`${section}.title`) || section}
                    </h3>
                    <ul className="space-y-3">
                      {(links as FooterLink[]).map(({ labelKey, href, external }) => (
                        <li key={labelKey}>
                          <Link
                            href={href}
                            target={external ? "_blank" : undefined}
                            rel={external ? "noreferrer" : undefined}
                            className="font-normal text-text opacity-70 text-sm"
                          >
                            {section === "app"
                              ? tapp(labelKey) || tNav(labelKey) || labelKey
                              : section === "exploreMore"
                              ? tExplore(labelKey) || tNav(labelKey) || labelKey
                              : section === "company"
                              ? tCompany(labelKey) || tNav(labelKey) || labelKey
                              : tLegal(labelKey) || labelKey}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer Legal and Disclaimer */}
            <motion.div
              className="text-xs py-3 text-text flex md:flex-row flex-col gap-20 w-full justify-between"
              variants={contentVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={5} // After the link sections
            >
              <div className="des text-text opacity-70">
                <p className="text-text opacity-70">{t("text1") || "UTOP Bridge is a decentralized app."}</p>
              </div>
              <LocaleSwitcherSelect defaultValue="key" label={t("languageLabel") || "English"} />
            </motion.div>

            <motion.div
              className="flex flex-col items-center text-sm font-light text-text opacity-70 gap-4 mt-6 md:flex-row justify-between pt-3"
              
              variants={contentVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={6} // Last item
            >
              <p className="text-text opacity-70">
                © {new Date().getFullYear()} {t("copyright.text") || "UTOP Bridge. All rights reserved."}
              </p>
            </motion.div>
          </div>
        </footer>
      </div>
    </motion.section>
  );
}