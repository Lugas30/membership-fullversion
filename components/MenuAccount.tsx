import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function MenuAccount() {
  const menubars = [
    { label: "Profil Pribadi", link: "/profile" },
    { label: "Ubah Nomor Handphone", link: "/change-phone" },
    { label: "Riwayat Transaksi", link: "/history-transaction" },
    // { label: "Informasi Tier", link: "/tier-info" },
    { label: "Atur Password & PIN", link: "/password" },
    { label: "Lokasi Toko", link: "/store" },
    { label: "Syarat & Ketentuan", link: "/term-condition" },
    { label: "Bantuan", link: "/help" },
    { label: "FAQ", link: "/faq" },
  ];

  return (
    <div className="flex flex-col justify-center items-center w-full px-8 pt-8 pb-4">
      <div className="flex flex-col w-full shadow">
        {menubars.map((item, index) => (
          <Link
            href={item.link}
            key={index}
            className="flex items-center justify-between w-full p-4 border border-slate-200"
          >
            <span className="text-xs fontMon">{item.label}</span>
            <Image
              src="/images/arrow-right.svg"
              width={30}
              height={30}
              alt={item.label}
              className="w-auto h-auto"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
