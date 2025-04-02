"use client";
import { useTranslations } from "next-intl";
import SwapForm from "../Forms/SwapForm";
import Template from "../Template";

// Assuming SwapForm is a typed component; if not, you may need to add types for it
export default function SwapHero() {
  const t = useTranslations('common.swap');

  return (
    <>
      <section
        className="py-20 md:px-0 px-6 backdrop-blur-lg"
        style={{
          backgroundImage: "url('/assets/img/apple.png')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backdropFilter: "blur(10px)", // Subtle background blur
        }}
      >
        <div className="flex md:flex-row flex-col justify-between max-w-screen-xl mx-auto items-center space-y-8">
          <div className="md:w-1/2 w-full">
            <div className="md:max-w-[80%]">
              <Template>
              <h3 className="md:text-6xl text-5xl text-white font-bold leading-tight">
                {t('hero_title')} {/* Translated title */}
              </h3>
              </Template>
              <Template>
              <p className="mt-4 text-lg text-gray-300">
                {t('hero_description')} {/* Translated description */}
              </p>
              </Template>
            </div>
          </div>
          <div className="md:w-1/2 w-full">
          <Template>
            <SwapForm />
            </Template>
          </div>
        </div>
      </section>
    </>
  );
}