"use client";

import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getBrand } from "@/redux/thunks/brandThunks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FadeLoader } from "react-spinners";

interface Brand {
  id: number;
  brand: string;
  brandImage: string;
}

export default function Store() {
  const navigate = useRouter();

  const dispatch = useAppDispatch();
  const { data, error } = useSelector((state: RootState) => state.brand);
  const [filteredData, setFilteredData] = useState<Brand[]>([]);

  useEffect(() => {
    dispatch(getBrand());
  }, [dispatch]);

  // untuk modal dan fungsi filter
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const showFilterModal = () => {
    setIsFilterModalVisible(true);
  };
  const closeFilterModal = () => setIsFilterModalVisible(false);
  const [filterData, setFilterData] = useState<string[]>([]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterData(
      e.target.checked
        ? [...filterData, e.target.value]
        : filterData.filter((value) => value !== e.target.value)
    );
  };

  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFilteredData(
      data.brandData.filter((brands: Brand) => {
        return filterData.includes(brands.brand);
      })
    );
    setIsFilterModalVisible(false);
    setFilterData([]);
  };

  // fungsi untuk membuat slug untuk brand
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Hapus karakter spesial
      .replace(/\s+/g, "-"); // Ganti spasi dengan "-"
  };

  if (data == null) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-screen">
        <Image src="/images/logo.svg" width={150} height={150} alt="logo" />
        <FadeLoader color="#101E2B" width={5} />
      </div>
    );
  } else if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <div className="bg-base-accent w-full min-h-screen">
          <Header>
            <div className="flex items-center justify-between mt-4">
              <span className="text-[10px] tracking-widest fontMon">
                LOKASI TOKO
              </span>
              {/* Dihilangkan karna sudah dibuat perbrand */}
              {/* <div className="flex items-center justify-center gap-2 cursor-pointer">
                <Image
                  src="/images/filter.svg"
                  alt="Filter"
                  width={100}
                  height={100}
                  className="w-auto h-auto cursor-pointer"
                  onClick={showFilterModal}
                />
              </div> */}
            </div>
          </Header>

          <div className="p-4 flex flex-col gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-4">
              {(filteredData && filteredData.length > 0
                ? filteredData
                : data.brandData
              ).map((brand: Brand) => (
                <div
                  className="bg-gray-200 rounded-md flex justify-center cursor-pointer"
                  key={brand.id}
                  onClick={() => {
                    navigate.push(`/store/${generateSlug(brand.brand)}`);
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
          </div>

          {/* modal filter */}
          {isFilterModalVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
              <div className="bg-white w-full max-w-md shadow-lg rounded-lg">
                <div className="flex justify-between items-center p-5">
                  <span className="text-[10px] fontMon uppercase tracking-wider">
                    Filter Brand
                  </span>
                  <button onClick={closeFilterModal} className="text-black">
                    &#10005;
                  </button>
                </div>

                <form onSubmit={handleFilter}>
                  <div className="px-5 pb-5">
                    {data.brandData.map((item: Brand) => (
                      <div key={item.id} className="flex items-center mb-2">
                        <div className="flex items-center">
                          <Input
                            type="checkbox"
                            name="brand"
                            value={item.brand}
                            onChange={handleCheckboxChange}
                            className="flex items-center"
                          />
                          <span className="pl-2 text-sm">{item.brand}</span>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-center pt-5">
                      <Button
                        label="Terapkan"
                        className="bg-base-accent text-white"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
