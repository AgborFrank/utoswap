"use client";

import { useState } from "react";
import { Button } from "antd";
import SwapForm from "./Forms/SwapForm"; // Adjust path
import BuyForm from "./Forms/BuyForm";   // Adjust path
//import { useTheme } from "../../../../context/theme"; // Adjust path if needed

export default function TokenInteraction() {
  const [mode, setMode] = useState<"swap" | "buy">("swap");
//  const { theme } = useTheme();

  // Define the background style for dark mode only
 // const darkModeBackground = {
 //   backgroundImage: "url('/assets/img/footer-gradient.webp')",
 //   backgroundPosition: "center",
 //   backgroundSize: "cover",
 //   backgroundRepeat: "no-repeat",
 // };

  return (
    <div
      className= "flex flex-col justify-center bg-grade items-center md:py-28 py-20 to-blue-900 p-4" 
      
    >
      <div className="max-w-md mx-auto py-6">
        <div className="header text-center">
          <h1 className="text-5xl text-text font-regular">
            {mode === "swap" ? "Migrate UTOP Tokens to V3" : "Buy UTOP Tokens"}
          </h1>
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="flex justify-center mb-6">
        <div className="bg-[#252525] p-1 rounded-full flex gap-2">
          <Button
            shape="round"
            className={`px-6 py-2 text-lg font-bold ${
              mode === "swap"
                ? "bg-cta/40 text-black border-none"
                : "bg-transparent text-white border-none hover:bg-gray-700"
            }`}
            onClick={() => setMode("swap")}
          >
            Migrate
          </Button>
          <Button
            shape="round"
            className={`px-6 py-2 text-lg font-bold ${
              mode === "buy"
                ? "bg-cta/40 text-black border-none"
                : "bg-transparent border-none text-white hover:bg-gray-700"
            }`}
            onClick={() => setMode("buy")}
          >
            Buy Token
          </Button>
        </div>
      </div>

      {/* Render Selected Component */}
      <div className="w-full max-w-md">
        {mode === "swap" ? <SwapForm /> : <BuyForm />}
      </div>
    </div>
  );
}