"use client";

import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import SuccessMessage from "@/components/SuccessMessage";
import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getLuckyList } from "@/redux/thunks/luckyListThunks";
import { getLucky } from "@/redux/thunks/luckyThunks";
import formatToIDR from "@/utils/formatToIDR";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FadeLoader } from "react-spinners";

type Redeem = {
  memberID: string;
  voucher_code: string;
  ip_address: string;
};

interface Lucky {
  id: number;
  title: string;
  noVoucher: string;
  category: string;
  nominal: number;
  pointVoucher: number;
  redeemDate: string;
  statusPenggunaan: string;
}

export default function Page() {
  const dispatch = useAppDispatch();

  const { error, data } = useSelector((state: RootState) => state.lucky);
  const { data: luckyList } = useSelector(
    (state: RootState) => state.luckyList
  );

  const [redeem, setRedeem] = useState<Redeem>({
    memberID: "",
    voucher_code: "",
    ip_address: "",
  });

  const [errorMessageRedeem, setErrorMessageRedeem] = useState(false);
  const [successMessageRedeem, setSuccessMessageRedeem] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const member = localStorage.getItem("member");

      setRedeem((prev) => ({
        ...prev,
        memberID: member || "",
        ip_address: "-",
      }));
      dispatch(getLucky());
      dispatch(getLuckyList());
    }
  }, [dispatch]);

  const handleRedeem = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}voucher/redeem`,
        {
          memberID: redeem.memberID,
          voucher_code: data.voucherData.voucherCode,
          ip_address: redeem.ip_address,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.responseCode === "2002500") {
        setSuccessMessageRedeem(true);
        setTimeout(() => {
          setSuccessMessageRedeem(false);
        }, 3000);
      } else if (response.data.responseCode === "4002500") {
        setErrorMessageRedeem(true);
        setTimeout(() => {
          setErrorMessageRedeem(false);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg">
        <div className="bg-white w-full max-w-md shadow-lg relative">
          {/* Header */}
          <div className="bg-white w-full sticky top-0 z-10">
            <div className="flex justify-between items-center p-6">
              <span className="text-xs">LUCKY DRAW</span>
              <button
                onClick={() => window.history.back()}
                className="text-black"
              >
                &#10005;
              </button>
            </div>
          </div>

          {/* Image Section */}
          <Image
            src={`https://web.amscorp.id:3060/imagestorage/voucher/${data.voucherData.imageUrl}`}
            alt="lucky"
            width={1240}
            height={1240}
            className="w-full h-auto"
          />

          {/* Content Section */}
          <div className="p-4">
            <h2 className="font-bold text-center my-3">
              {data.voucherData.voucherTitle}
            </h2>

            {/* Description */}
            <div className="my-6">
              <p className="text-xs text-center">
                {data.voucherData.voucherDetail}
              </p>
            </div>

            {/* Terms & Conditions */}
            <div className="flex flex-col items-center justify-center my-4">
              <span className="text-sm font-semibold">Terms & Condition</span>
              <ol className="text-xs my-2 text-center list-decimal list-inside">
                <li>Lorem ipsum dolloret sit amet bla bla..</li>
                <li>Voucher discount hanya dapat digunakan satu kali</li>
                <li>Voucher discount hanya dapat digunakan satu kali</li>
                <li>Voucher discount hanya dapat digunakan satu kali</li>
                <li>Voucher discount hanya dapat digunakan satu kali</li>
              </ol>
            </div>

            {/* Points Section */}
            <div className="flex justify-center items-center mb-4">
              <span className="text-xs">
                Senilai: {formatToIDR(data.voucherData.nominal)} point/kupon
              </span>
            </div>

            <Button
              label="TUKAR KUPON"
              onClick={handleRedeem}
              type="button"
              className="bg-base-accent text-white rounded-full w-full p-2"
              loading={isLoading}
            />

            {errorMessageRedeem && (
              <ErrorMessage message="Anda sudah tukar kupon" />
            )}
            {successMessageRedeem && (
              <SuccessMessage message="Kupon Berhasil Ditukar" />
            )}

            <hr className="my-6" />

            {/* Coupon Info */}
            <div className="flex justify-end items-center">
              <span className="text-xs">
                Total Kupon: {luckyList.voucherData.length}
              </span>
            </div>

            {luckyList && luckyList.voucherData ? (
              luckyList.voucherData.length > 0 &&
              luckyList.voucherData.map((item: Lucky) => (
                <div
                  className="bg-[#E0DDD4] w-full my-4 p-2 shadow-sm"
                  key={item.id}
                >
                  <div className="border-dashed border-2 border-gray-500 p-2">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col gap-2">
                        <span className="text-xs">
                          Tanggal tukar: {item.redeemDate}
                        </span>
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-xs">
                        Rp {formatToIDR(item.nominal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                Tidak ada data voucher.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
