"use client";

import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getPoint } from "@/redux/thunks/pointThunks";
import formatDate from "@/utils/formatDate";
import formatToIDR from "@/utils/formatToIDR";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FadeLoader } from "react-spinners";
import Riwayat from "./Riwayat";
import Kedaluarsa from "./Kedaluarsa";

interface Point {
  id: number;
  store: string;
  invoice: string;
  date: string;
  point: number;
  status: string;
}

export default function HistoryPoint() {
  const dispatch = useAppDispatch();
  const { error, data } = useSelector((state: RootState) => state.point);
  const [menu, setMenu] = useState<"transaksi" | "kedaluarsa">("transaksi");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPoints = async () => {
      setIsLoading(true);
      await dispatch(getPoint());
      setIsLoading(false);
    };

    fetchPoints();
  }, [dispatch]);

  const handleMenuChange = (selectedMenu: "transaksi" | "kedaluarsa") => {
    setMenu(selectedMenu);
  };

  // const renderMenuContent = () => {
  //   if (menu === "transaksi") {
  //     return (<Riwayat isLoading={isLoading} />);
  //   }
  //   if (menu === "kedaluarsa") {
  //     return (<Kedaluarsa isLoading={isLoading} />);
  //   }
  //   return null;
  // };

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
          <div className="bg-white shadow-lg p-8 rounded-b-3xl sticky top-0 z-10">
            {/* Header */}
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
                <span className="text-xl">Riwayat Poin</span>
              </div>
            </div>

            {/* Menu */}
            <div className="flex justify-evenly items-center my-8">
              <span
                className={`text-xs font-medium cursor-pointer ${
                  menu === "transaksi" ? "underline underline-offset-8" : ""
                }`}
                onClick={() => handleMenuChange("transaksi")}
              >
                Poin Transaksi
              </span>
              <span
                className={`text-xs font-medium cursor-pointer ${
                  menu === "kedaluarsa" ? "underline underline-offset-8" : ""
                }`}
                onClick={() => handleMenuChange("kedaluarsa")}
              >
                Akan Kedaluarsa
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center p-4">
            {data && data.historyPointData ? (
              data.historyPointData.length > 0 ? (
                data.historyPointData.map((item: Point) => (
                  <div
                    className="bg-white p-4 w-full rounded-lg border border-gray-300 flex items-center justify-between mb-4"
                    key={item.id}
                  >
                    <div className="flex flex-col space-y-6">
                      <div className="flex flex-col">
                        <small className="text-xs mb-1">{item.store}</small>
                        <small className="text-[10px] fontMon tracking-wider">
                          {item.invoice}
                        </small>
                        {/* <small className="text-xs">Status {item.status}</small> */}
                      </div>
                      <h2 className="text-[10px] fontMon mt-1">
                        {formatDate(item.date)}
                      </h2>
                    </div>

                    <div className="w-px h-16 bg-gray-300"></div>

                    <div className="flex flex-col items-center mb-1">
                      {item.status.toLowerCase() === "tambah" ? (
                        <span className="text-sm">
                          + {formatToIDR(item.point)}
                        </span>
                      ) : item.status.toLowerCase() === "pakai" ? (
                        <span className="text-sm">
                          - {formatToIDR(item.point)}
                        </span>
                      ) : null}

                      <span className="text-[8px] fontMon tracking-widest">
                        POIN
                      </span>
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
