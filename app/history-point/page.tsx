"use client";

import Image from "next/image";
import Riwayat from "./Riwayat";
import Kedaluarsa from "./Kedaluarsa";
import { useState } from "react";

export default function HistoryPoint() {
  const [menu, setMenu] = useState<"transaksi" | "kedaluarsa">("transaksi");

  const handleMenuChange = (selectedMenu: "transaksi" | "kedaluarsa") => {
    setMenu(selectedMenu);
  };

  const renderMenuContent = () => {
    if (menu === "transaksi") {
      return <Riwayat />;
    }
    if (menu === "kedaluarsa") {
      return <Kedaluarsa />;
    }
    return null;
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <div className="bg-base-accent min-h-screen w-full">
          <div className="bg-white shadow-lg p-8 rounded-b-3xl sticky top-0 z-10">
            {/* Header */}
            <div className="flex items-center">
              <Image
                src="/images/arrow-left.svg"
                width={30}
                height={30}
                alt="arrow-left"
                className="w-auto h-auto cursor-pointer absolute"
                onClick={() => window.history.back()}
              />
              <div className="flex-grow flex justify-center">
                <span className="text-xl">Riwayat Poin</span>
              </div>
            </div>

            {/* Menu */}
            <div className="flex justify-evenly items-center my-8">
              <span
                className={`text-xs font-medium cursor-pointer ${
                  menu === "transaksi" ? "underline underline-offset-8" : ""
                }`}
                onClick={() => handleMenuChange("transaksi")}
              >
                Poin Transaksi
              </span>
              <span
                className={`text-xs font-medium cursor-pointer ${
                  menu === "kedaluarsa" ? "underline underline-offset-8" : ""
                }`}
                onClick={() => handleMenuChange("kedaluarsa")}
              >
                Akan Kedaluwarsa
              </span>
            </div>
          </div>

          {renderMenuContent()}
        </div>
      </div>
    </div>
  );
}
