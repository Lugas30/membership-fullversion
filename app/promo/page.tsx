"use client";

import Header from "@/components/Header";
import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getPromo } from "@/redux/thunks/promoThunks";
import formatDate from "@/utils/formatDate";
import formatDesc from "@/utils/formatDesc";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FadeLoader } from "react-spinners";

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
};

export default function Promo() {
  const dispatch = useAppDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [detail, setDetail] = useState<Promo | null>(null);
  const { error, data } = useSelector((state: RootState) => state.promo);

  useEffect(() => {
    dispatch(getPromo());
  }, [dispatch]);

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
            <div className="flex items-center justify-between mt-8">
              <span className="text-xs">PROMO BERLAKU</span>
              <div className="flex items-center justify-center gap-2 cursor-pointer">
                <Image
                  src="/images/filter.svg"
                  alt="Filter"
                  width={100}
                  height={100}
                  className="w-auto h-auto cursor-pointer"
                />
                <span className="text-xs">FILTER</span>
              </div>
            </div>
          </Header>

          {/* card */}
          <div className="p-4">
            {data &&
              data.promoData?.map((item: Promo) => (
                <div
                  key={item.id}
                  className="bg-white w-full rounded-lg flex flex-col justify-between cursor-pointer mb-4"
                  onClick={() => showModal({ id: item.id })}
                >
                  <Image
                    src={`https://web.amscorp.id:3060/imagestorage/promo/${item.imageUrl}`}
                    alt="reward"
                    width={1240}
                    height={1240}
                    className="w-auto h-auto rounded-t-lg"
                  />

                  <div className="p-4">
                    <h2 className="font-bold text-sm">{item.promoTitle}</h2>
                    <p className="text-xs">
                      {item.promoLocation} | {formatDate(item.promoStartDate)} -{" "}
                      {formatDate(item.promoEndDate)}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          {/* open modal */}
          {isModalVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50">
              <div className="bg-white w-full max-w-md min-h-screen shadow-lg">
                <div className="flex justify-between items-center p-6">
                  <span className="text-xs">PROMO KAMU</span>
                  <button onClick={closeModal} className="text-black">
                    &#10005;
                  </button>
                </div>

                <Image
                  src={`https://web.amscorp.id:3060/imagestorage/promo/${detail?.imageUrl}`}
                  alt="reward"
                  width={1240}
                  height={1240}
                  className="logo"
                />

                <div className="p-4">
                  <h2 className="font-bold text-center my-3">
                    {detail?.promoTitle}
                  </h2>

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
        </div>
      </div>
    </div>
  );
}
