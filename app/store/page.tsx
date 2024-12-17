"use client";

import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getBrand } from "@/redux/thunks/brandThunks";
import { getStore } from "@/redux/thunks/storeThunks";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FadeLoader } from "react-spinners";

type Store = {
  brand: string;
  storeID: string;
  kota: string;
  storeAddress: string;
  noTelpon: string;
  mapStoreUrl: string;
};

type Brand = {
  id: number;
  brand: string;
};

export default function Store() {
  const dispatch = useAppDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [detail, setDetail] = useState<Store | null>(null);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<Store[]>([]);

  const { error, data } = useSelector((state: RootState) => state.store);

  const { data: brand } = useSelector((state: RootState) => state.brand);

  useEffect(() => {
    dispatch(getStore());
    dispatch(getBrand());
  }, [dispatch]);

  const showModal = ({ storeID }: { storeID: string }) => {
    data.storeLocationData?.find((item: Store) => {
      if (item.storeID === storeID) {
        setIsModalVisible(true);
        setDetail(item);
        return true;
      }
    });
  };

  const closeModal = () => setIsModalVisible(false);

  // untuk modal dan fungsi search
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const showSearchModal = () => setIsSearchModalVisible(true);
  const closeSearchModal = () => setIsSearchModalVisible(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFilteredData(
      data.storeLocationData.filter((location: Store) => {
        const searchLower = search.toLowerCase();
        const combinedString =
          `${location.brand} ${location.kota}`.toLowerCase(); // Gabungkan brand dan kota
        return combinedString.includes(searchLower); // Cek apakah pencarian cocok
      })
    );
    setIsSearchModalVisible(false);
    setSearch("");
  };

  // untuk modal dan fungsi filter
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
      data.storeLocationData.filter((location: Store) => {
        return filterData.includes(location.brand);
      })
    );
    setIsFilterModalVisible(false);
    setFilterData([]);
  };

  // Fungsi untuk mendekode HTML entities
  const decodeHTMLEntities = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  if (data == null) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-screen">
        <Image src="/images/logo.svg" width={150} height={150} alt="logo" />
        <FadeLoader color="#101E2B" width={5} />
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <div className="bg-base-accent w-full min-h-screen">
          <Header>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs">LOKASI TOKO</span>
              <div className="flex items-center justify-center gap-2 cursor-pointer">
                <Image
                  src="/images/search.svg"
                  alt="Search"
                  width={100}
                  height={100}
                  className="w-auto h-auto cursor-pointer"
                  onClick={showSearchModal}
                />
                <Image
                  src="/images/filter.svg"
                  alt="Filter"
                  width={100}
                  height={100}
                  className="w-auto h-auto cursor-pointer"
                  onClick={showFilterModal}
                />
              </div>
            </div>
          </Header>

          {/* search open */}
          {isSearchModalVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50">
              <div className="bg-white w-full max-w-md shadow-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs">
                    Masukan brand atau kota yang anda cari
                  </span>
                  <button onClick={closeSearchModal} className="text-black">
                    &#10005;
                  </button>
                </div>
                <form onSubmit={handleSearch}>
                  <div className="flex items-center justify-center mt-2 border border-gray-300">
                    <input
                      type="text"
                      name="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full px-2 py-1 focus:outline outline-none text-sm"
                    />
                    <Image
                      src="/images/search.svg"
                      alt="Search"
                      width={100}
                      height={100}
                      className="w-auto h-auto"
                      typeof="button"
                    />
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center justify-center p-4">
            {(filteredData && filteredData.length > 0
              ? filteredData
              : data.storeLocationData
            ).map((location: Store) => (
              <div
                key={location.storeID}
                className="bg-white p-4 w-full rounded-lg border border-gray-300 flex items-center justify-between cursor-pointer mb-4"
                onClick={() => showModal({ storeID: location.storeID })}
              >
                <span className="text-sm">
                  {location.brand} {location.kota}
                </span>
                <Image
                  src="/images/location.svg"
                  alt="location"
                  width={100}
                  height={100}
                  className="w-auto h-auto cursor-pointer"
                />
              </div>
            ))}
          </div>

          {/* modal detail location */}
          {isModalVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50">
              <div className="bg-white w-full max-w-md min-h-screen shadow-lg p-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs">LOKASI TOKO</span>
                  <button onClick={closeModal} className="text-black">
                    &#10005;
                  </button>
                </div>

                <div className="flex flex-col items-center justify-center my-6">
                  <h2 className="font-bold">
                    {detail?.brand} {detail?.kota}
                  </h2>

                  <div
                    className="p-4 my-2"
                    dangerouslySetInnerHTML={{
                      __html:
                        detail && detail.mapStoreUrl
                          ? decodeHTMLEntities(detail.mapStoreUrl)
                          : "",
                    }}
                  ></div>

                  <div className="flex flex-col items-center justify-center mb-4">
                    <span className="text-sm font-semibold">Alamat</span>
                    <p className="text-xs text-center my-2">
                      {detail?.storeAddress}
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center mb-4">
                    <span className="text-sm font-semibold mb-2">Jam Toko</span>
                    <p className="text-xs">Senin - Sabtu</p>
                    <p className="text-xs">10.00 - 22.00</p>
                  </div>

                  <a
                    href="#"
                    target="_blank"
                    className="text-sm my-2 bg-base-accent w-full py-2 text-center text-white cursor-pointer rounded-full"
                  >
                    BUKA MAP
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* modal filter */}
          {isFilterModalVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
              <div className="bg-white w-full max-w-md shadow-lg rounded-lg">
                <div className="flex justify-between items-center p-4">
                  <span>Filter Brand</span>
                  <button onClick={closeFilterModal} className="text-black">
                    &#10005;
                  </button>
                </div>

                <form onSubmit={handleFilter}>
                  <div className="p-4">
                    {brand.brandData.map((item: Brand) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between mb-2"
                      >
                        <div className="flex items-center">
                          <Input
                            type="checkbox"
                            name="brand"
                            value={item.brand}
                            onChange={handleCheckboxChange}
                          />
                          <span className="ml-2">{item.brand}</span>
                        </div>
                      </div>
                    ))}
                    <Button
                      label="Terapkan"
                      className="bg-base-accent text-white rounded-full w-full p-2"
                    />
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
