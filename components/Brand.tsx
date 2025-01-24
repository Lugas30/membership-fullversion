"use client";

import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getBrand } from "@/redux/thunks/brandThunks";
import Image from "next/image";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

interface Brand {
  id: number;
  brand: string;
  brandImage: string;
  siteUrl: string;
}

export default function Brand() {
  const dispatch = useAppDispatch();
  const { data } = useSelector((state: RootState) => state.brand);

  useEffect(() => {
    dispatch(getBrand());
  }, [dispatch]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
      {data &&
        data.brandData.map((brand: Brand) => (
          <div
            className="bg-gray-200 rounded-md flex justify-center cursor-pointer"
            key={brand.id}
            onClick={() => {
              window.open(brand.siteUrl, "_blank");
            }}
          >
            <Image
              src={`https://amscorp.id/brand/${brand.brandImage}`}
              width={250}
              height={100}
              alt={brand.brand}
              className="w-auto h-auto rounded-md "
            />
          </div>
        ))}
    </div>
  );
}
