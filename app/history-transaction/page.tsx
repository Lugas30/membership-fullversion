"use client";

import Header from "@/components/Header";
import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getTransaction } from "@/redux/thunks/transactionThunks";
import formatDate from "@/utils/formatDate";
import formatToIDR from "@/utils/formatToIDR";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FadeLoader } from "react-spinners";

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

export default function HistoryTransaction() {
  const dispatch = useAppDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [detail, setDetail] = useState<Transaction | null>(null);

  const totalQty = detail?.produk.reduce((sum, item) => sum + item.QTY, 0);

  const { error, data } = useSelector((state: RootState) => state.transaction);

  useEffect(() => {
    dispatch(getTransaction());
  }, [dispatch]);

  const showModal = ({ id }: { id: number }) => {
    data.transactionData.find((item: Transaction) => {
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
        <div className="bg-base-accent min-h-screen w-full">
          <Header>
            <div className="flex items-center justify-between mt-8">
              <span className="text-xs">RIWAYAT BELANJA</span>
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

          <div className="flex flex-col items-center justify-center p-4">
            {data && data.transactionData ? (
              data.transactionData.length > 0 ? (
                data.transactionData.map((item: Transaction) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 w-full rounded-lg border border-gray-300 flex items-center justify-between cursor-pointer mb-2"
                    onClick={() => showModal({ id: item.id })}
                  >
                    {/* Kolom kiri */}
                    <div className="flex flex-col space-y-6 w-1/2">
                      {/* Nama toko dan ID */}
                      <div className="flex flex-col">
                        <small className="text-xs">{item.idStore}</small>
                        <small className="text-[8px]">{item.invoice}</small>
                      </div>
                      {/* Tanggal */}
                      <h2 className="text-xs mt-1">
                        {formatDate(item.tanggalTransksi)}
                      </h2>
                    </div>

                    {/* Garis pemisah */}
                    <div className="w-px h-16 bg-gray-300"></div>

                    {/* Kolom kanan */}
                    <div className="flex flex-col items-end">
                      <span className="text-xs">Total</span>
                      <span className="text-xs">
                        RP {formatToIDR(item.total)}
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

          {/* modal detail transaksi */}
          {isModalVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50">
              <div className="bg-white w-full max-w-md min-h-screen shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs">STRUK PEMBELIAN</span>
                  <button onClick={closeModal} className="text-black">
                    &#10005;
                  </button>
                </div>

                <div className="flex flex-col justify-center items-center gap-1 my-6">
                  <span className="font-bold text-sm">{detail?.idStore}</span>
                  <span className="text-xs">{detail?.invoice}</span>
                  <span className="text-xs">
                    {formatDate(detail?.tanggalTransksi || "")}
                  </span>
                </div>

                <hr className="my-4" />

                <div>
                  <span className="text-xs font-bold">PRODUK</span>

                  {/* Daftar produk */}
                  <div className="my-2">
                    {detail &&
                      detail.produk.map((item) => (
                        <div className="flex justify-between" key={item.id}>
                          <span className="text-sm w-1/2">
                            {item.DESKRIPSI}
                          </span>
                          <span className="text-xs w-1/4 text-right">
                            {item.QTY}
                          </span>
                          <span className="text-xs w-1/4 text-right">
                            {formatToIDR(item.Net)}
                          </span>
                        </div>
                      ))}
                  </div>

                  <hr className="my-4" />

                  {/* Total item dan harga */}
                  <div className="flex justify-between font-bold">
                    <span className="text-sm w-1/2">TOTAL ITEM</span>
                    <span className="text-sm w-1/4 text-right">{totalQty}</span>
                    <span className="text-sm w-1/4 text-right">
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
                    <span>{formatToIDR(detail?.rewardPoint || 0)}</span>
                  </div>
                  <div className="flex justify-between my-2">
                    <span>Bonus point</span>
                    <span>{formatToIDR(detail?.bonusPoint || 0)}</span>
                  </div>
                  <div className="flex justify-between my-2">
                    <span>Birthday point</span>
                    <span>{formatToIDR(detail?.birthdayPoint || 0)}</span>
                  </div>
                  <div className="flex justify-between my-2">
                    <span>Special day point</span>
                    <span>{formatToIDR(detail?.bigdayPoint || 0)}</span>
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
