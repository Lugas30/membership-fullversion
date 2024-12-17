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

  return (
    <>
      {/* Card */}
      {data && data.voucherData ? (
        data.voucherData.length > 0 &&
        data.voucherData.map((item: Voucher) => (
          <div
            className={`${
              item.category == "VCR"
                ? "bg-[#E0DDD4]"
                : "bg-[#131010] text-white"
            } w-full max-w-md rounded-lg p-6 flex flex-col justify-between space-y-4 shadow-md mb-3 cursor-pointer`}
            key={item.id}
            onClick={() => handleShowVoucher(item.noVoucher)}
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-sm font-semibold">
                  {item.category == "VCR" ? "Voucher" : "Voucher Special"}
                </span>
                <div className="">
                  <span
                    className={`text-sm ${
                      item.category == "VCR" ? "text-[#131010]" : "text-white"
                    }`}
                  >
                    Code :{" "}
                  </span>
                  <span className="text-sm font-semibold">
                    {item.noVoucher}
                  </span>
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
                className={`text-xs font-bold ${
                  item.category == "VCR" ? "text-[#131010]" : "text-white"
                }`}
              >
                <Countdown targetDate={item.tanggalExpired} />
              </span>
              <Barcode
                value={item.noVoucher}
                displayValue={false}
                height={20}
                margin={0}
                width={1}
                lineColor={`${item.category == "VCR" ? "#131010" : "#F8FAFC"}`}
                background="transparent"
              />
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">Tidak ada data voucher.</p>
      )}

      {isModalVisible && (
        <ModalQRVoucher data={voucherData} closeModal={closeModal} />
      )}
    </>
  );
}
