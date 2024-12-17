import Image from "next/image";
import React from "react";

type LogoHeaderProps = {
  className?: string;
};

export default function LogoHeader({ className }: LogoHeaderProps) {
  return (
    <div className="">
      <Image
        src="/images/logo.svg"
        width={125}
        height={125}
        alt="logo"
        className={`${className}`}
      />
    </div>
  );
}
