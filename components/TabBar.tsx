import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function TabBar() {
  return (
    <div className="flex justify-between items-center px-4 py-5 bg-white fixed bottom-0 w-full border-t-2 border-t-slate-300 fontMon tracking-wide z-10">
      <Link href={"/redeem"} className="flex flex-col items-center w-20">
        <Image
          src="/images/rewards.svg"
          width={30}
          height={30}
          alt="toko"
          className="w-auto h-auto"
        />
        <span className="text-[9px]">Tukar Poin</span>
      </Link>
      <Link href={"/voucher"} className="flex flex-col items-center w-20">
        <Image
          src="/images/voucher.svg"
          width={30}
          height={30}
          alt="voucher"
          className="w-auto h-auto"
        />
        <span className="text-[9px]">Voucher</span>
      </Link>
      <Link href={"/home"} className="flex flex-col items-center w-20">
        <Image
          src="/images/home.svg"
          width={30}
          height={30}
          alt="home"
          className="w-auto h-auto"
        />
        <span className="text-[9px]">Beranda</span>
      </Link>
      <Link href={"/transaction"} className="flex flex-col items-center w-20">
        <Image
          src="/images/history.svg"
          width={30}
          height={30}
          alt="history"
          className="w-auto h-auto"
        />
        <span className="text-[9px]">Riwayat</span>
      </Link>
      <Link href={"/account"} className="flex flex-col items-center w-20">
        <Image
          src="/images/account.svg"
          width={30}
          height={30}
          alt="akun"
          className="w-auto h-auto"
        />
        <span className="text-[9px]">Akun</span>
      </Link>
    </div>
  );
}
