import Image from "next/image";
import React from "react";

type SuccessProps = {
  message: string;
};

export default function SuccessMessage({ message }: SuccessProps) {
  return (
    <div className="flex justify-center items-center">
      <div className="bg-green-600 text-white px-4 py-2 my-2 w-full flex gap-2 items-center h-12">
        <Image
          src="/images/succes-alert.svg"
          width={100}
          height={100}
          alt="error"
          className="w-auto h-auto"
        />
        {message}
      </div>
    </div>
  );
}
