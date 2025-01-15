"use client";

import React from "react";
import Link from "next/link";

const commingsoon = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <p className="text-center text-gray-500">
        Fitur belum tersedia untuk saat ini.
      </p>
      <Link href="/home">
        <p className="underline underline-offset-4 my-5">Kembali ke Beranda</p>
      </Link>
    </div>
  );
};

export default commingsoon;
