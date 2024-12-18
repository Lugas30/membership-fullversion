import Image from "next/image";
import React from "react";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
  type?: string;
}

export default function Header({
  children,
  className = "",
  type = "",
}: HeaderProps) {
  return (
    <div className="bg-white shadow-lg p-8 rounded-b-3xl sticky top-0 z-10">
      <div className="flex items-center">
        <Image
          src="/images/arrow-left.svg"
          alt="Arrow Left"
          width={100}
          height={100}
          className="absolute w-auto h-auto cursor-pointer"
          onClick={() => window.history.back()}
        />
        <div className="flex-grow flex justify-center">
          {type === "" ? (
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={100}
              height={100}
              className="w-auto h-auto"
            />
          ) : (
            <span>{type}</span>
          )}
        </div>
      </div>
      <div className={className}>{children}</div>
    </div>
  );
}
