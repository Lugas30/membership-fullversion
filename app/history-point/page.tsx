"use client";

import Header from "@/components/Header";
import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getPoint } from "@/redux/thunks/pointThunks";
import formatDate from "@/utils/formatDate";
import formatToIDR from "@/utils/formatToIDR";
import Image from "next/image";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { FadeLoader } from "react-spinners";

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

  useEffect(() => {
    dispatch(getPoint());
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
              <span className="text-[10px] fontMon tracking-widest">
                RIWAYAT POIN
              </span>
              <div className="flex items-center gap-2 cursor-pointer">
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
