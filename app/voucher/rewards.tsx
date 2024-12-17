"use client";

import Countdown from "@/components/Countdown";
import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getRewards } from "@/redux/thunks/rewardsThunks";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FadeLoader } from "react-spinners";

interface Rewards {
  id: number;
  title: string;
  voucherCode: string;
  expiredDate: string;
  used_at: string;
  image: string;
  termsCondition: string;
  nominal: number;
  status: string;
}

export default function Rewards() {
  const dispatch = useAppDispatch();

  const { error, data } = useSelector((state: RootState) => state.rewards);
  const [detail, setDetail] = useState<Rewards | null>(null);

  useEffect(() => {
    dispatch(getRewards());
  }, [dispatch]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (id: number) => {
    data.rewardData.find((item: Rewards) => {
      if (item.id === id) {
        setDetail(item);
        return true;
      }
    });
    setIsModalVisible(true);
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
    <>
      {/* card */}

      {data && data.rewardData ? (
        data.rewardData.length > 0 ? (
          data.rewardData.map((item: Rewards) => (
            <div
              className={`bg-white w-full rounded-lg border border-gray-300 flex flex-col items-center justify-between mb-4 ${
                item.status === "inactive" ? "opacity-50" : "cursor-pointer"
              }`}
              onClick={
                item.status === "active" ? () => showModal(item.id) : () => {}
              }
              key={item.id}
            >
              <Image
                src={`https://web.amscorp.id:3060/imagestorage/gift/${item.image}`}
                alt="reward"
                width={1240}
                height={1240}
                className="w-auto h-auto rounded-t-lg"
              />
              <div className="flex justify-between items-center w-full p-4 rounded-b-lg">
                <span className="text-xs">
                  <Countdown targetDate={item.expiredDate} />
                </span>
                <span className="text-xs">
                  {item.status === "active" ? "GUNAKAN" : "TERPAKAI"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Tidak ada data rewards.</p>
        )
      ) : (
        <p className="text-center text-gray-500">Data tidak tersedia.</p>
      )}

      {/* open modal */}
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50">
          <div className="bg-white w-full max-w-md min-h-screen shadow-lg">
            <div className="flex justify-between items-center p-6">
              <span className="text-xs">REWARD KAMU</span>
              <button onClick={closeModal} className="text-black">
                &#10005;
              </button>
            </div>

            <Image
              src={`https://web.amscorp.id:3060/imagestorage/gift/${detail?.image}`}
              alt="reward"
              width={1240}
              height={1240}
              className="logo"
            />

            <div className="p-4">
              <h2 className="font-bold text-center my-3">{detail?.title}</h2>

              {/* Daftar produk */}
              <div className="my-6">
                <div className="border border-gray-300 p-4 rounded-lg mb-4">
                  <div className="flex flex-col mb-4">
                    <span className="text-xs text-zinc-400">Voucher Code</span>
                    <span className="text-sm">{detail?.voucherCode}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm">Voucher can be use at:</span>
                    <span className="text-xs">{detail?.used_at}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">
                    Terms & Condition
                  </span>
                  <span className="text-xs">{detail?.termsCondition}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
