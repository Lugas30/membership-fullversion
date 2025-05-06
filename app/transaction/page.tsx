"use client";

import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getTransaction } from "@/redux/thunks/transactionThunks";
import formatDate from "@/utils/formatDate";
import formatToIDR from "@/utils/formatToIDR";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FadeLoader } from "react-spinners";
import Link from "next/link";
import ProgressBar from "@/components/PrgressBar";
import checklist from "@/public/images/circle_check.svg";
import locked from "@/public/images/circle_lock.svg";

import BenefitBadge from "@/components/BenefitBadge";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import TabBar from "@/components/TabBar";
import { Pagination } from "swiper/modules";

interface Transaction {
  id: number;
  idMember: string;
  invoice: string;
  tanggalTransksi: string;
  idStore: string;
  produk: Product[];
  total: number;
  rewardPoint: number;
  bonusPoint: number;
  birthdayPoint: number;
  bigdayPoint: number;
}

interface Product {
  id: number;
  DESKRIPSI: string;
  QTY: number;
  Net: number;
}

interface Tier {
  id: number;
  tier: string;
  amountStartingFrom: number;
  amountUpTo: number;
  amountPoint: number;
  tier_image: string;
  benefitData: string;
  status: string;
}

export default function Transaction() {
  const dispatch = useAppDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [detail, setDetail] = useState<Transaction | null>(null);
  const totalQty = detail?.produk.reduce((sum, item) => sum + item.QTY, 0);
  const { error, data } = useSelector((state: RootState) => state.transaction);
  const [year, setYear] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    dispatch(getTransaction());
  }, [dispatch]);

  useEffect(() => {
    const currentYear = data?.memberInfoData.joinDate.slice(0, 4);
    setYear(currentYear || "");
  }, [data]);

  useEffect(() => {
    if (data?.memberInfoData?.tierData?.length) {
      const activeTierIndex = data.memberInfoData.tierData.findIndex(
        (tier: Tier) => tier.status === "Active"
      );
      if (activeTierIndex !== -1) {
        setActiveIndex(activeTierIndex);
      }
    }
  }, [data]);

  function toNormalCase(str: string) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  const showModal = ({ id }: { id: number }) => {
    const foundItem = data?.transactionData?.find(
      (item: Transaction) => item.id === id
    );
    if (foundItem) {
      setIsModalVisible(true);
      setDetail(foundItem);
    }
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

  const activeTierIndex = data.memberInfoData.tierData.findIndex(
    (tier: Tier) => tier.status === "Active"
  );

  // Jika tidak ada yang aktif, default ke indeks pertama (0)
  const initialIndex = activeTierIndex !== -1 ? activeTierIndex : 0;

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <div className="w-full">
          {/* Header info */}
          <div className="flex flex-col bg-base-accent rounded-b-3xl py-8 items-center relative w-full">
            <Swiper
              initialSlide={initialIndex} // Hanya diinisialisasi sekali
              // slidesPerView={2}
              // spaceBetween={120} // sebelumnya 360
              centeredSlides={true}
              modules={[Pagination]}
              breakpoints={{
                0: {
                  slidesPerView: 2,
                  spaceBetween: 280,
                },
                349: {
                  slidesPerView: 2,
                  spaceBetween: 310,
                },
                374: {
                  slidesPerView: 2,
                  spaceBetween: 330,
                },
                410: {
                  slidesPerView: 2,
                  spaceBetween: 350,
                },
                429: {
                  slidesPerView: 2,
                  spaceBetween: 360,
                },
              }}
              className="w-full z-20"
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)} // Update state tanpa remount
            >
              {data.memberInfoData.tierData.map((tier: Tier) => (
                <SwiperSlide key={tier.id}>
                  <div className="flex flex-col items-center text-center w-full scale-slide">
                    <div className="flex flex-col items-center text-center justify-center w-96 mb-3 relative">
                      <Image
                        src={`https://amscorp.id/card/${tier.tier_image}`}
                        alt={tier.tier}
                        width={800}
                        height={400}
                        className="rounded-xl drop-shadow-[3px_3px_3px_rgba(0,0,0,0.20)]"
                      />
                      {tier.status === "Active" && (
                        <div className="absolute top-0 left-0 bottom-3 w-full">
                          <div
                            className="absolute inset-0 flex flex-row items-start justify-between z-10 p-4"
                            style={{
                              textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                            }}
                          >
                            <div className="flex flex-col items-start">
                              <span className="text-sm text-white mb-1 normal-case">
                                {toNormalCase(data.memberInfoData.fullName)}
                              </span>
                              <span className="text-[7px] fontMon text-white tracking-widest">
                                MEMBER SEJAK {year}
                              </span>
                            </div>

                            {/* Poin */}
                            <div className="flex flex-col">
                              <span className="font-medium text-white text-right mb-1">
                                {formatToIDR(data.memberInfoData.points || 0)}
                              </span>
                              <span className="text-[7px] text-white tracking-widest text-right fontMon">
                                TOTAL POIN
                              </span>
                            </div>
                          </div>
                          <div
                            className="absolute inset-0 flex flex-col items-center justify-center z-10"
                            style={{
                              textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                            }}
                          >
                            <span className="text-sm fontMon uppercase tracking-widest text-white mb-1">
                              {data.memberInfoData.tierInfo.tier_name}
                            </span>
                            <span className="text-[8px] fontMon tracking-widest text-white">
                              TIER
                            </span>
                          </div>

                          <div className="absolute inset-0 flex items-end justify-between z-20 px-4 pb-2">
                            {data.memberInfoData.tierInfo.tier_name ===
                            "Maestro" ? (
                              <div className="flex justify-center items-center w-full">
                                <p className="text-white text-[10px] tracking-wider fontMon">
                                  Kamu telah mencapai tier tertinggi.
                                </p>
                                {/* <small className="text-white">100%</small> */}
                              </div>
                            ) : (
                              // <div className="">

                              //   {/* <ProgressBar
                              //     currentValue={100}
                              //     maxValue={100}
                              //   /> */}
                              // </div>
                              <div className="w-full ">
                                <div className="flex justify-between items-center w-full">
                                  <small className="text-white text-[10px] tracking-wider fontMon">
                                    Rp{" "}
                                    {formatToIDR(
                                      data.memberInfoData.tierInfo
                                        .amountForNextTier || 0
                                    )}{" "}
                                    untuk tier selanjutnya
                                  </small>
                                  <small className="text-white">
                                    {data.memberInfoData.tierInfo
                                      .memberPersentase || 0}
                                    %
                                  </small>
                                </div>
                                <ProgressBar
                                  currentValue={
                                    data.memberInfoData.tierInfo
                                      .memberPersentase || 0
                                  }
                                  maxValue={100}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {tier.status === "Locked" && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-white/10 backdrop-blur-lg backdrop-saturate-100 shadow-lg border border-white/20 rounded-xl">
                          <div className="bg-white/10 backdrop-blur-lg backdrop-saturate-100 shadow-lg border border-white/20 rounded-full p-3 mb-2">
                            <Image
                              src={locked}
                              alt="locked"
                              width={20}
                              height={20}
                              className=""
                            />
                          </div>

                          <span className="flex flex-col justify-center items-center text-sm text-white mb-10 uppercase fontMon tracking-widest">
                            {tier.tier}
                          </span>
                          <div className="absolute inset-0 flex items-end justify-center p-4">
                            <div className="flex flex-col justify-center gap-2 items-center text-white text-[10px] p-3 mb-3 rounded-xl tracking-wider">
                              {/* <Image
                                src={locked}
                                alt="locked"
                                width={20}
                                height={20}
                                className=""
                              /> */}
                              <span>
                                Belanja hingga Rp
                                {formatToIDR(tier.amountStartingFrom || 0)}{" "}
                                untuk membuka tier ini
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        {tier.status === "Passed" && (
                          <>
                            <span
                              className="flex flex-col justify-center items-center text-sm text-white mb-1 uppercase fontMon tracking-widest"
                              style={{
                                textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                              }}
                            >
                              {tier.tier}
                            </span>
                            <div className="absolute inset-0 flex items-end justify-center z-20 p-4">
                              <div
                                className="flex flex-row justify-center gap-2 items-center text-white text-[10px] p-3 mb-3 rounded-xl tracking-wider 
  bg-white/10 backdrop-blur-lg backdrop-saturate-100 shadow-lg border border-white/20"
                              >
                                <Image
                                  src={checklist}
                                  alt="checklist"
                                  width={20}
                                  height={20}
                                  className=""
                                />
                                <span
                                  style={{
                                    textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                                  }}
                                >
                                  Anda telah mencapai tier ini.
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Total Poin */}

            <div className="w-full px-8">
              {/* Benefit Section */}
              <div className="flex flex-row justify-between mb-3 fontMon tracking-wider uppercase text-white">
                <span className="text-[10px] mt-1">Benefit :</span>
                <Link
                  href={"/tier-info"}
                  className="bg-grey/10 text-[8px] backdrop-blur-lg backdrop-saturate-100 shadow-lg border border-white/20 rounded-full px-3 py-1 cursor-pointer"
                >
                  Info Benefit
                </Link>
              </div>
              <BenefitBadge activeIndex={activeIndex} />
            </div>
          </div>

          <div className="flex justify-center text-[8px] fontMon items-center p-4 mt-5 mb-4 bg-gray-200 uppercase tracking-widest">
            Riwayat Transaksi
          </div>

          <div className="flex flex-col items-center justify-center p-4 mb-20">
            {/* tampilkan data hanya 10 */}
            {data && data?.transactionData?.length > 0 ? (
              data.transactionData.slice(0, 10).map((item: Transaction) => (
                <div
                  key={item.id}
                  className="bg-base-accent text-white p-4 w-full rounded-lg border border-gray-300 flex items-center justify-between cursor-pointer mb-4"
                  onClick={() => showModal({ id: item.id })}
                >
                  {/* Kolom kiri */}
                  <div className="flex flex-col space-y-6 w-1/2">
                    {/* Nama toko dan ID */}
                    <div className="flex flex-col">
                      <small className="text-xs mb-1">{item.idStore}</small>
                      <small className="text-[8px] fontMon tracking-widest">
                        {item.invoice}
                      </small>
                    </div>
                    {/* Tanggal */}
                    <h2 className="text-[10px] fontMon tracking-wider uppercase mt-1">
                      {formatDate(item.tanggalTransksi)}
                    </h2>
                  </div>

                  {/* Garis pemisah */}
                  <div className="w-px h-16 bg-gray-300"></div>

                  {/* Kolom kanan */}
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] fontMon tracking-widest uppercase">
                      Total
                    </span>
                    <span className="text-xs">
                      Rp {formatToIDR(item.total)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-white">Tidak ada transaksi.</p>
            )}
            {data?.transactionData?.length > 0 && (
              <Link
                href="/history-transaction"
                className="text-[9px] fontMon tracking-widest px-4 flex items-center justify-end uppercase"
              >
                Lihat semua
              </Link>
            )}
          </div>

          {/* modal detail transaksi */}
          {isModalVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50">
              <div className="bg-white w-full max-w-md min-h-screen shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] fontMon tracking-wider">
                    STRUK PEMBELIAN
                  </span>
                  <button onClick={closeModal} className="text-black">
                    &#10005;
                  </button>
                </div>

                <div className="flex flex-col justify-center items-center gap-1 my-6 text-[10px]">
                  <span>{detail?.idStore}</span>
                  <span className="fontMon tracking-wider">
                    {detail?.invoice}
                  </span>
                  <span className="text-xs">
                    {formatDate(detail?.tanggalTransksi || "")}
                  </span>
                </div>

                <hr className="my-4" />

                <div>
                  <span className="text-[10px] fontMon tracking-wider">
                    PRODUK
                  </span>

                  {/* Daftar produk */}
                  <div className="my-2">
                    {detail &&
                      detail.produk.map((item) => (
                        <div className="flex justify-between" key={item.id}>
                          <span className="text-[10px] tracking-wider w-1/2">
                            {item.DESKRIPSI}
                          </span>
                          <span className="text-[10px] fontMon w-1/4 text-right">
                            {item.QTY}
                          </span>
                          <span className="text-[10px] fontMon w-1/4 text-right">
                            {formatToIDR(item.Net)}
                          </span>
                        </div>
                      ))}
                  </div>

                  <hr className="my-4" />

                  {/* Total item dan harga */}
                  <div className="flex justify-between fontMon text-[10px] tracking-wider">
                    <span className="w-1/2">TOTAL ITEM</span>
                    <span className="w-1/4 text-right">{totalQty}</span>
                    <span className="w-1/4 text-right">
                      {formatToIDR(detail?.total || 0)}
                    </span>
                  </div>

                  <hr className="my-4" />
                </div>

                <div className="text-xs mt-6">
                  <p className="mb-4 text-end">
                    Harga diatas sudah termasuk PPN 11%
                  </p>
                  <div className="flex justify-between my-2">
                    <span>Reward point</span>
                    <span className="fontMon text-[10px]">
                      {formatToIDR(detail?.rewardPoint || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between my-2">
                    <span>Bonus point</span>
                    <span className="fontMon text-[10px]">
                      {formatToIDR(detail?.bonusPoint || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between my-2">
                    <span>Birthday point</span>
                    <span className="fontMon text-[10px]">
                      {formatToIDR(detail?.birthdayPoint || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between my-2">
                    <span>Special day point</span>
                    <span className="fontMon text-[10px]">
                      {formatToIDR(detail?.bigdayPoint || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <TabBar />
      </div>
    </div>
  );
}
