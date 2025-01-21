"use client";

import Button from "@/components/Button";
import Header from "@/components/Header";
import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getHistoryTier } from "@/redux/thunks/historyTierThunks";
import formatDate from "@/utils/formatDate";
import Image from "next/image";
import { useEffect, useState } from "react";
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
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [filteredData, setFilteredData] = useState<Tier[]>([]);

  useEffect(() => {
    if (data?.historyTierData?.length > 0) {
      setFilteredData(data.historyTierData);
    }
  }, [data?.historyTierData]);

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

  function toNormalCase(str: string) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  // fungsi untuk menampilkan filter
  const showFilter = () => {
    setShowModal(true);
  };

  const closeFilterModal = () => {
    setShowModal(false);
  };

  // mengatasi handle filter
  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedStatus === "All") {
      setFilteredData(data.historyTierData);
    } else {
      const filtered = data.historyTierData.filter(
        (item: Tier) => item.status === selectedStatus
      );
      setFilteredData(filtered);
    }

    // tutup modal
    setShowModal(false);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <div className="bg-base-accent min-h-screen w-full">
          <Header>
            <div className="flex items-center justify-between mt-8">
              <span className="text-[10px] fontMon tracking-widest">
                RIWAYAT TIER
              </span>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={showFilter}
              >
                <Image
                  src="/images/filter.svg"
                  alt="Filter"
                  width={100}
                  height={100}
                  className="w-auto h-auto"
                />
                <span className="text-[10px] fontMon tracking-widest">
                  FILTER
                </span>
              </div>
            </div>
          </Header>

          <div className="flex flex-col items-center p-4">
            {filteredData.length > 0 ? (
              filteredData.map((item: Tier) => (
                <div
                  className="bg-white p-4 w-full rounded-lg border border-gray-300 flex items-center justify-between mb-4"
                  key={item.id}
                >
                  <span className="text-xs">
                    {formatDate(item.effectiveDate)}
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs normal-case text-zinc-400">
                        {toNormalCase(item.status)} Tier
                      </span>
                      <span className="text-[10px] fontMon uppercase">
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
                    ) : item.status === "TURUN" ? (
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
              <div className="flex items-center justify-center gap-1 p-4 rounded-lg">
                <span className="text-[10px] fontMon text-gray-600">
                  Data tidak ditemukan
                </span>
              </div>
            )}
          </div>

          {/* modal filter  */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
              <div className="bg-white w-full max-w-md shadow-lg rounded-lg">
                <div className="flex justify-between items-center p-4">
                  <span className="text-[10px] fontMon uppercase tracking-wider">
                    Filter Tier
                  </span>
                  <button onClick={closeFilterModal} className="text-black">
                    &#10005;
                  </button>
                </div>

                <form onSubmit={handleFilter}>
                  <div className="p-4">
                    <div className="flex flex-col gap-2 mb-4">
                      <label className="text-sm font-medium text-gray-700 mb-2">
                        Status Tier
                      </label>
                      <div className="flex gap-4 justify-evenly mb-4">
                        <label className="flex text-sm uppercase items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            value="All"
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            checked={selectedStatus === "All"}
                          />
                          <span>All</span>
                        </label>
                        <label className="flex text-sm uppercase items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            value="NAIK"
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            checked={selectedStatus === "NAIK"}
                          />
                          <span>Naik</span>
                        </label>
                        <label className="flex text-sm uppercase items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            value="TURUN"
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            checked={selectedStatus === "TURUN"}
                          />
                          <span>Turun</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex justify-center">
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
