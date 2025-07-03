"use client";

import AllBrands from "@/components/AllBrands";
import Button from "@/components/Button";
import LogoHeader from "@/components/LogoHeader";
import { useRouter } from "next/navigation";
import React from "react";

export default function Auth() {
  // router untuk redirect
  const router = useRouter();

  // handle masuk untuk redirect ke halaman login
  const handleMasuk = () => {
    router.push("/login");
  };

  // handle daftar untuk redirect ke halaman register
  const handleDaftar = () => {
    router.push("/register");
  };

  // handle untuk redirect ke halaman validasi
  const handleValidasi = () => {
    router.push("/validasi");
  };

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="flex flex-col items-center max-w-md w-full min-h-screen bg-white md:rounded-lg">
          <LogoHeader className="m-11" />

          <div className="flex flex-col justify-center items-center m-7">
            <div className="text-center mb-14 space-y-6">
              {/* <h2 className="text-xl fontGeo">Masuk Akun</h2> */}
              <p className="text-xs text-center fontMon leading-relaxed">
                Kumpulkan poin, dapatkan promo dan penawaran <br></br> khusus
                member
              </p>
            </div>

            <div className="flex flex-col w-full gap-6 justify-center items-center">
              <Button
                label="MASUK"
                className="bg-base-accent text-white"
                onClick={handleMasuk}
              />
              <Button
                label="DAFTAR MEMBER"
                className="bg-base-accent text-white"
                onClick={handleDaftar}
              />

              <hr className="w-full border-gray-300 my-4" />

              <p className="text-[9px] text-center fontMon">
                Member yang sudah terdaftar
              </p>

              <Button
                label="VALIDASI MEMBER"
                className="bg-gray-300 text-base-accent"
                onClick={handleValidasi}
              />
            </div>

            <AllBrands />
          </div>
        </div>
      </div>
    </>
  );
}
