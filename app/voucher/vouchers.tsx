import Countdown from "@/components/Countdown";
import ModalQRVoucher from "@/components/ModalVoucher";
import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getVoucherList } from "@/redux/thunks/voucherListThunk";
import formatToIDR from "@/utils/formatToIDR";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { useSelector } from "react-redux";
import { FadeLoader } from "react-spinners";

interface Voucher {
  id: number;
  noVoucher: string;
  nominal: number;
  category: string;
  pointVoucher: number;
  tanggalExpired: string;
  statusPenggunaan: string;
  voucherStatus: string;
  type: string;
}

export default function Vouchers() {
  const dispatch = useAppDispatch();
  const { error, data } = useSelector((state: RootState) => state.voucherList);
  const [voucherData, setVoucherData] = useState<Voucher | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    dispatch(getVoucherList());
  }, [dispatch]);

  const handleShowVoucher = (noVoucher: string) => {
    setIsModalVisible(true);
    const detail = data?.voucherData.find(
      (item: Voucher) => item.noVoucher === noVoucher
    );
    setVoucherData(detail);
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

  const isVoucherExpired = (expiryDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset jam untuk membandingkan hanya tanggal
    const expiry = new Date(expiryDate.split("/").reverse().join("-"));

    return expiry.getTime() < today.getTime(); // Expired jika lebih kecil dari hari ini
  };

  return (
    <>
      {/* Card */}
      {data && data.voucherData ? (
        data.voucherData.length > 0 &&
        data.voucherData.map((item: Voucher) => {
          const expired = isVoucherExpired(item.tanggalExpired);
          return (
            <div
              className={`w-full max-w-md rounded-lg p-6 flex flex-col justify-between space-y-4 shadow-md mb-4 
                ${
                  item.category === "VCR"
                    ? "bg-[#E0DDD4] text-black"
                    : "bg-[#131010] text-white"
                } 
                ${
                  expired || item.voucherStatus === "used"
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
              `}
              key={item.id}
              onClick={() => !expired && handleShowVoucher(item.noVoucher)}
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-sm">
                    {item.category == "VCR" ? "Voucher" : "Voucher Special"}
                    <span className="px-1 normal-case">
                      {item.type === "CASHBACK" ? "Cashback" : " "}
                    </span>
                  </span>

                  <div className="">
                    <span
                      className={`text-sm ${
                        item.category == "VCR" ? "text-[#131010]" : "text-white"
                      }`}
                    >
                      Code :{" "}
                    </span>
                    <span className="text-sm">{item.noVoucher}</span>
                  </div>
                </div>
                {item.category == "VCR" ? (
                  <Image
                    src="/images/logo.svg"
                    width={50}
                    height={50}
                    alt="logo"
                  />
                ) : (
                  <Image
                    src="/images/logo-white.svg"
                    width={50}
                    height={50}
                    alt="logo"
                  />
                )}
              </div>

              <div className="flex justify-end">
                <h1
                  className={`text-xl font-bold ${
                    item.category == "VCR" ? "text-[#131010]" : "text-white"
                  }`}
                >
                  Rp {formatToIDR(item.nominal)}
                </h1>
              </div>

              <div className="flex justify-between items-center">
                <span
                  className={`text-xs ${
                    item.category == "VCR" ? "text-[#131010]" : "text-white"
                  }`}
                >
                  <Countdown targetDate={item.tanggalExpired} />
                </span>
                {/* <Barcode
                  value={item.noVoucher}
                  displayValue={false}
                  height={20}
                  margin={0}
                  width={1}
                  lineColor={`${
                    item.category == "VCR" ? "#131010" : "#F8FAFC"
                  }`}
                  background="transparent"
                /> */}
                <span className="text-[10px] fontMon">
                  Berlaku hingga: {item.tanggalExpired}
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">Belum memiliki voucher.</p>
      )}

      {isModalVisible && (
        <ModalQRVoucher data={voucherData} closeModal={closeModal} />
      )}
    </>
  );
}
