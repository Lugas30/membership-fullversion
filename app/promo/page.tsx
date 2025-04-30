"use client";

import Button from "@/components/Button";
import Header from "@/components/Header";
import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getBrand } from "@/redux/thunks/brandThunks";
import { getCategoryPromo } from "@/redux/thunks/categoryPromoThunks";
import { getPromo } from "@/redux/thunks/promoThunks";
import formatDate from "@/utils/formatDate";
import formatDesc from "@/utils/formatDesc";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FadeLoader } from "react-spinners";
import Link from "next/link";

type Promo = {
  id: number;
  imageTitle: string;
  imageSubTitle: string;
  imageUrl: string;
  promoTitle: string;
  promoDetail: string;
  promoLocation: string;
  promoStartDate: string;
  promoEndDate: string;
  isActive: boolean;
  category: string;
  brand: string;
};

type CategoryPromo = {
  id: number;
  category: string;
};

type Brand = {
  id: number;
  brand: string;
};

export default function Promo() {
  const dispatch = useAppDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [detail, setDetail] = useState<Promo | null>(null);
  const { error, data } = useSelector((state: RootState) => state.promo);
  const { data: category } = useSelector(
    (state: RootState) => state.categoryPromo
  );
  const { data: brand } = useSelector((state: RootState) => state.brand);

  const [filterModal, setFilterModal] = useState<boolean>(false);

  const [filteredData, setFilteredData] = useState<Promo[]>([]);

  useEffect(() => {
    dispatch(getPromo());
    dispatch(getBrand());
    dispatch(getCategoryPromo());
  }, [dispatch]);

  useEffect(() => {
    if (data?.promoData.length > 0) {
      setFilteredData(data.promoData);
    }
  }, [data?.promoData]);

  const showModal = ({ id }: { id: number }) => {
    data.promoData.find((item: Promo) => {
      if (item.id === id) {
        setIsModalVisible(true);
        setDetail(item);
        return true;
      }
    });
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  // modal dan fungsi filter
  const [filterData, setFilterData] = useState({
    brand: [] as string[], // Data checkbox untuk merek
    category: [] as string[], // Data checkbox untuk kategori
  });

  // Fungsi untuk menangani perubahan checkbox
  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "brand" | "category"
  ) => {
    const { checked, value } = e.target;
    setFilterData((prevState) => ({
      ...prevState,
      [type]: checked
        ? type === "category"
          ? [...prevState[type], value.toUpperCase()] // Convert category to uppercase
          : [...prevState[type], value]
        : prevState[type].filter((item) => item !== value),
    }));
  };

  const showFilterModal = () => {
    setFilterModal(true);
  };

  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Memastikan data promo ada dan terfilter dengan benar
    const filter = data.promoData.filter((item: Promo) => {
      return (
        // Jika tidak ada brand yang dipilih, tampilkan semua data, jika ada filter brand, cek apakah item.brand ada di filterData.brand
        (!filterData.brand.length || filterData.brand.includes(item.brand)) &&
        // Jika tidak ada kategori yang dipilih, tampilkan semua data, jika ada filter kategori, cek apakah item.category ada di filterData.category
        (!filterData.category.length ||
          filterData.category.includes(item.category.toUpperCase()))
      );
    });

    // Update state dengan data yang sudah difilter
    setFilteredData(filter);

    // Tutup modal
    setFilterModal(false);

    // Bersihkan data filter
    setFilterData({
      brand: [],
      category: [],
    });
  };

  const closeFilterModal = () => {
    setFilterModal(false);
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

  // funsi untuk huruf kapital di depan
  const capitalizeWords = (str: string): string => {
    return str
      .toLowerCase() // Pastikan semua huruf kecil dulu
      .split(" ") // Pisahkan berdasarkan spasi
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Kapitalisasi huruf pertama
      .join(" "); // Gabungkan kembali menjadi string
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <div className="bg-base-accent w-full min-h-screen">
          <Header>
            <div className="flex items-center justify-between mt-8">
              <span className="text-[10px] fontMon tracking-widest">
                PROMO BERLAKU
              </span>

              {/* Button filter minta dihide */}
              {/* <div
                className="flex items-center justify-center gap-2 cursor-pointer"
                onClick={showFilterModal}
              >
                <Image
                  src="/images/filter.svg"
                  alt="Filter"
                  width={100}
                  height={100}
                  className="w-auto h-auto cursor-pointer"
                />
                <span className="text-[10px] fontMon tracking-widest">
                  FILTER
                </span>
              </div> */}
            </div>
          </Header>

          {/* card */}
          <div className="p-4">
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((item: Promo) => (
                <div
                  key={item.id}
                  className="bg-white w-full rounded-lg flex flex-col justify-between cursor-pointer mb-4 shadow-lg overflow-hidden"
                >
                  {item.category === "LUCKY DRAW" ? (
                    <Link href="/lucky-draw">
                      <div>
                        <Image
                          src={`https://web.amscorp.id:3060/imagestorage/promo/${item.imageUrl}`}
                          alt="reward"
                          width={1240}
                          height={200}
                          className="w-full max-h-52 object-cover rounded-t-lg"
                        />
                        <div className="p-4">
                          <h2 className="text-sm mb-1">{item.promoTitle}</h2>
                          <p className="text-[10px] text-gray-600 fontMon">
                            {item.promoLocation} |{" "}
                            {formatDate(item.promoStartDate)} -{" "}
                            {formatDate(item.promoEndDate)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div onClick={() => showModal({ id: item.id })}>
                      <Image
                        src={`https://web.amscorp.id:3060/imagestorage/promo/${item.imageUrl}`}
                        alt="reward"
                        width={1240}
                        height={1240}
                        className="w-full max-h-52 object-cover rounded-t-lg"
                      />
                      <div className="p-4">
                        <h2 className="text-sm mb-1">{item.promoTitle}</h2>
                        <p className="text-[10px] text-gray-600 fontMon">
                          {item.promoLocation} |{" "}
                          {formatDate(item.promoStartDate)} -{" "}
                          {formatDate(item.promoEndDate)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-700 py-10">
                <p className="text-center text-white">Promo tidak tersedia</p>
              </div>
            )}
          </div>

          {/* open modal ini yang diganti */}
          {isModalVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
              <div className="bg-white w-full h-full max-w-md max-h-full shadow-lg overflow-y-auto">
                <div className="flex justify-between items-center p-6">
                  <span className="text-xs">PROMO</span>
                  <button onClick={closeModal} className="text-black">
                    &#10005;
                  </button>
                </div>

                <Image
                  src={`https://web.amscorp.id:3060/imagestorage/promo/${detail?.imageUrl}`}
                  alt="reward"
                  width={1240}
                  height={1240}
                  className="w-full h-auto"
                />

                <div className="p-6">
                  <h2 className="text-center my-3">{detail?.promoTitle}</h2>

                  {/* Daftar produk */}
                  <div className="my-6">
                    <p
                      className="text-xs"
                      dangerouslySetInnerHTML={{
                        __html: formatDesc(detail?.promoDetail || ""),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* modal filter */}
          {filterModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
              <div className="bg-white w-full max-w-md shadow-lg rounded-lg">
                <div className="flex justify-between items-center p-4">
                  <span className="text-[10px] uppercase tracking-wider fontMon">
                    Filter Promo
                  </span>
                  <button onClick={closeFilterModal} className="text-black">
                    &#10005;
                  </button>
                </div>

                <form onSubmit={handleFilter} className="p-4">
                  <div className="flex flex-row gap-10">
                    <div className="">
                      <span className="text-xs">Brand</span>
                      <div className="flex flex-col gap-2 mt-3">
                        {brand.brandData.map((item: Brand) => (
                          <div key={item.id} className="flex items-center">
                            <input
                              type="checkbox"
                              name="brand"
                              value={item.brand}
                              onChange={(e) => handleCheckboxChange(e, "brand")}
                            />
                            <span className="text-xs ml-1">{item.brand}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="">
                      <span className="text-xs">Kategori</span>
                      <div className="flex flex-col gap-2 mt-3">
                        {category.categoryPromoData.map(
                          (item: CategoryPromo) => (
                            <div key={item.id} className="flex items-center">
                              <input
                                type="checkbox"
                                name="category"
                                value={item.category}
                                onChange={(e) =>
                                  handleCheckboxChange(e, "category")
                                }
                              />
                              <span className="text-xs ml-1">
                                {capitalizeWords(item.category)}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center py-5">
                    <Button
                      label="Terapkan"
                      className="bg-base-accent text-white"
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
