"use client";

import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import Header from "@/components/Header";
import Input from "@/components/Input";
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

interface Filter {
  startDate: string;
  endDate: string;
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

  // filter data
  const [modalFilter, setIsModalFilter] = useState<boolean>(false);
  const showFilter = () => {
    setIsModalFilter(true);
  };

  const closeModalFilter = () => {
    setIsModalFilter(false);
  };

  // proses filter
  const [filter, setFilter] = useState<Filter>({
    startDate: "",
    endDate: "",
  });

  const [messageError, setMessageError] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<Transaction[]>([]);
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
    setMessageError(false);
  };

  const convertToYYYYMMDD = (date: string): string => {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  const convertedData = data?.transactionData
    ? data.transactionData.map((item: Transaction) => ({
        ...item,
        tanggalTransksi: convertToYYYYMMDD(item.tanggalTransksi),
      }))
    : [];
  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Fungsi untuk menghitung selisih hari antara dua tanggal
    const calculateDateDifference = (start: string, end: string): number => {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const differenceInTime = endDate.getTime() - startDate.getTime();
      return differenceInTime / (1000 * 3600 * 24); // Konversi dari ms ke hari
    };

    // Validasi rentang tanggal
    if (filter.startDate && filter.endDate) {
      const daysDifference = calculateDateDifference(
        filter.startDate,
        filter.endDate
      );

      if (daysDifference > 90) {
        setMessageError(true);
        return; // Hentikan proses jika rentang terlalu besar
      }
    }

    // Proses filter data
    const filtered = convertedData.filter((item: Transaction) => {
      return (
        (!filter.startDate || item.tanggalTransksi >= filter.startDate) &&
        (!filter.endDate || item.tanggalTransksi <= filter.endDate)
      );
    });

    // Simpan hasil filter ke state
    setFilteredData(filtered);

    // Tutup modal filter
    setIsModalFilter(false);

    // Reset form filter
    setFilter({
      startDate: "",
      endDate: "",
    });
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
              <span className="text-[10px] tracking-wider uppercase fontMon">
                RIWAYAT TRANSAKSI
              </span>
              <div
                className="flex items-center justify-center gap-2 cursor-pointer"
                onClick={showFilter}
              >
                <Image
                  src="/images/filter.svg"
                  alt="Filter"
                  width={100}
                  height={100}
                  className="w-auto h-auto cursor-pointer"
                />
                <span className="text-[10px] fontMon">FILTER</span>
              </div>
            </div>
          </Header>

          <div className="flex flex-col items-center justify-center p-4">
            {data.transactionData ? (
              (filteredData?.length ? filteredData : data.transactionData)
                .length > 0 ? (
                (filteredData?.length
                  ? filteredData
                  : data.transactionData
                ).map((item: Transaction) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 w-full rounded-lg border border-gray-300 flex items-center justify-between cursor-pointer mb-4"
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
                      <h2 className="text-[10px] mt-1 fontMon uppercase tracking-wider">
                        {formatDate(item.tanggalTransksi)}
                      </h2>
                    </div>

                    {/* Garis pemisah */}
                    <div className="w-px h-16 bg-gray-300"></div>

                    {/* Kolom kanan */}
                    <div className="flex flex-col items-end">
                      <span className="text-[8px] fontMon uppercase tracking-wider">
                        Total
                      </span>
                      <span className="text-xs">
                        Rp {formatToIDR(item.total)}
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

          {/* modal filter data */}
          {modalFilter && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
              <div className="bg-white w-full max-w-md shadow-lg rounded-lg">
                <div className="flex justify-between items-center p-4">
                  <span className="text-[10px] fontMon uppercase tracking-wider">
                    Filter Transaksi
                  </span>
                  <button onClick={closeModalFilter} className="text-black">
                    &#10005;
                  </button>
                </div>

                {/* validasi error */}
                {messageError && (
                  <div className="flex justify-center">
                    <ErrorMessage
                      message={
                        "Rentang tanggal tidak boleh lebih dari 3 bulan (90 hari)."
                      }
                    />
                  </div>
                )}

                <form onSubmit={handleFilter}>
                  <div className="p-4">
                    <div className="flex flex-col gap-2 mb-4">
                      <div className="flex gap-4 justify-evenly mb-4">
                        <Input
                          label="Tanggal Awal"
                          type="date"
                          name="startDate"
                          value={filter.startDate}
                          onChange={handleFilterChange}
                        />
                        <Input
                          label="Tanggal Akhir"
                          type="date"
                          name="endDate"
                          value={filter.endDate}
                          onChange={handleFilterChange}
                        />
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
