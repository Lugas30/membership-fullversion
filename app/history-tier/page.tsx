"use client";

import Header from "@/components/Header";
import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getHistoryTier } from "@/redux/thunks/historyTierThunks";
import formatDate from "@/utils/formatDate";
import Image from "next/image";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { FadeLoader } from "react-spinners";

interface Tier {
  id: number;
  tierName: string;
  effectiveDate: string;
  status: string;
}

export default function HistoryTier() {
  const dispatch = useAppDispatch();
  const { error, data } = useSelector((state: RootState) => state.tierHistory);

  useEffect(() => {
    dispatch(getHistoryTier());
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

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <div className="bg-base-accent min-h-screen w-full">
          <Header>
            <div className="flex items-center justify-between mt-8">
              <span className="text-xs">RIWAYAT TIER</span>
              <div className="flex items-center gap-2 cursor-pointer">
                <Image
                  src="/images/filter.svg"
                  alt="Filter"
                  width={100}
                  height={100}
                  className="w-auto h-auto"
                />
                <span className="text-xs">FILTER</span>
              </div>
            </div>
          </Header>

          <div className="flex flex-col items-center p-4">
            {data && data.historyTierData ? (
              data.historyTierData.length > 0 ? (
                data.historyTierData.map((item: Tier) => (
                  <div
                    className="bg-white p-4 w-full rounded-lg border border-gray-300 flex items-center justify-between mb-2"
                    key={item.id}
                  >
                    <span className="text-sm">
                      {formatDate(item.effectiveDate)}
                    </span>

                    <div className="flex items-center justify-center gap-2">
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-zinc-400">
                          {item.status} Tier
                        </span>
                        <span className="text-xs font-medium">
                          {item.tierName}
                        </span>
                      </div>
                      {item.status === "NAIK" ? (
                        <Image
                          src="/images/arrow-up.svg"
                          width={30}
                          height={30}
                          alt={item.status}
                          className="w-auto h-auto"
                        />
                      ) : item.status == "TURUN" ? (
                        <Image
                          src="/images/arrow-down.svg"
                          width={30}
                          height={30}
                          alt={item.status}
                          className="w-auto h-auto"
                        />
                      ) : null}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  Tidak ada data transaksi.
                </p>
              )
            ) : (
              <p className="text-center text-gray-500">Data tidak tersedia.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
