"use client";

import React, { useState } from "react";
import Rewards from "./rewards";
import Vouchers from "./vouchers";
import Header from "@/components/Header";

export default function Page() {
  const [menu, setMenu] = useState<"voucher" | "rewards">("voucher");

  const renderMenuContent = () => {
    if (menu === "voucher") return <Vouchers />;
    if (menu === "rewards") return <Rewards />;
    return null;
  };

  const handleMenuChange = (selectedMenu: "voucher" | "rewards") => {
    setMenu(selectedMenu);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <div className="bg-base-accent w-full min-h-screen">
          <Header type="Voucher">
            {/* Menu */}
            <div className="flex justify-evenly items-center mt-8">
              <span
                className={`text-xs font-medium cursor-pointer ${
                  menu === "voucher" ? "underline underline-offset-8" : ""
                }`}
                onClick={() => handleMenuChange("voucher")}
              >
                Voucher Belanja
              </span>
              <span
                className={`text-xs font-medium cursor-pointer ${
                  menu === "rewards" ? "underline underline-offset-8" : ""
                }`}
                onClick={() => handleMenuChange("rewards")}
              >
                Voucher Rewards
              </span>
            </div>
          </Header>

          {/* Content */}
          <div className="p-4">{renderMenuContent()}</div>
        </div>
      </div>
    </div>
  );
}
