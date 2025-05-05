"use client";

import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getTier } from "@/redux/thunks/tierThunks";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FadeLoader } from "react-spinners";
import formatToIDR from "@/utils/formatToIDR";
import checklist from "@/public/images/circle_check.svg";
import locked from "@/public/images/circle_lock.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Tier {
  id: number;
  tier: string;
  amountStartingFrom: number;
  amountUpTo: number;
  amountPoint: number;
  tier_image: string;
  benefitData: string;
  status: string;
  tier_0: string;
}

export default function TierInfo() {
  const dispatch = useAppDispatch();

  const { error, data } = useSelector((state: RootState) => state.tier);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    dispatch(getTier());
  }, [dispatch]);

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

  const activeTier = data.tierData[activeIndex] || data.tierData[0];

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <div className="min-h-screen">
          <div className="flex flex-col bg-white rounded-b-3xl p-8">
            <div className="flex items-center">
              <Image
                src="/images/arrow-left.svg"
                width={30}
                height={30}
                alt="arrow-left"
                className="w-auto h-auto cursor-pointer absolute"
                onClick={() => window.history.back()}
              />
              <div className="flex-grow flex justify-center">
                <span className="text-xl">Tier Member</span>
              </div>
            </div>
            <p className="text-[10px] text-center tracking-wider my-6 fontMon leading-relaxed">
              Penentuan tier member berdasarkan total transaksi belanja, setiap
              tingkatan tier memiliki benefit yang berbeda seperti penambahan
              nilai poin dan akses benefit lainnya
            </p>
          </div>
          <div className="relative">
            <div className="absolute w-full bg-white">
              <Swiper
                // slidesPerView={2}
                // spaceBetween={280}
                centeredSlides={true}
                modules={[Pagination]}
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                    spaceBetween: 280,
                  },
                  280: {
                    slidesPerView: 2,
                    spaceBetween: 320,
                  },
                  320: {
                    slidesPerView: 2,
                    spaceBetween: 310,
                  },
                  400: {
                    slidesPerView: 2,
                    spaceBetween: 290,
                  },
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 280,
                  },
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                className="w-full"
              >
                {data.tierData.map((tier: Tier, index: number) => (
                  <SwiperSlide key={tier.id}>
                    <div className="flex flex-col items-center text-center w-full">
                      <div className="flex flex-col items-center text-center justify-center w-80">
                        <Image
                          src={`https://amscorp.id/card/${tier.tier_image}`}
                          alt={tier.tier}
                          width={800}
                          height={400}
                          className="mb-3 rounded-xl drop-shadow-[3px_3px_3px_rgba(0,0,0,0.20)]"
                        />
                        <div className="absolute z-10 w-80">
                          <span
                            className="text-[10px] text-white mb-1 uppercase fontMon tracking-widest"
                            style={{
                              textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                            }}
                          >
                            {tier.tier}
                          </span>
                        </div>
                      </div>

                      {/* <p className="text-gray-600">{tier.status}</p> */}
                      {/* jika tier status = Passed , maka tampilkan text "Anda telah mencapai tier ini". jika Active, maka tampilkan "Tier anda saat ini". jika Locked, maka tampilkan "Tier anda terkunci" */}
                      <div className="bg-gray-200 w-[320px] rounded-xl">
                        <div className="text-[10px] w-full tracking-wider">
                          {tier.status === "Passed" && (
                            <div className="flex flex-row justify-center gap-2 items-center text-[10px] p-3 bg-gray-200 rounded-xl tracking-wider">
                              <Image
                                src={checklist}
                                alt="checklist"
                                width={20}
                                height={20}
                                className=""
                              />
                              <span>Anda telah mencapai tier ini.</span>
                            </div>
                          )}
                          {tier.status === "Active" && (
                            <div className="p-3 min-h-[44px] flex flex-col justify-center">
                              <span>Tier anda saat ini</span>
                            </div>
                          )}
                          {tier.status === "Locked" && (
                            <div className="flex flex-row justify-center gap-2 items-center text-[10px] bg-gray-200 p-3 rounded-xl tracking-wider">
                              <Image
                                src={locked}
                                alt="locked"
                                width={20}
                                height={20}
                                className=""
                              />
                              <span>
                                Belanja hingga Rp
                                {formatToIDR(tier.amountStartingFrom || 0)}{" "}
                                untuk membuka tier ini
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="p-8">
                <h1 className="text-2xl text-center">{activeTier.tier}</h1>
                <div>
                  <div className="p-6 w-full min-h-80">
                    <h2 className="mb-2">Benefit</h2>

                    {/* Jika ini adalah index pertama, tampilkan tier_0 */}
                    {activeIndex === 0 && (
                      <div className="mb-4 text-gray-700 text-[10px] fontMon tracking-wider">
                        {activeTier.tier_0}
                      </div>
                    )}

                    <div
                      className="text-gray-700 text-[10px] fontMon tracking-wider"
                      dangerouslySetInnerHTML={{
                        __html: activeTier.benefitData,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
