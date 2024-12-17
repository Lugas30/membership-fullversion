"use client";

import MenuAccount from "@/components/MenuAccount";
import ModalInputPin from "@/components/ModalInputPin";
import ModalQRCode from "@/components/ModalQrCode";
import ProgressBar from "@/components/PrgressBar";
import TabBar from "@/components/TabBar";
import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getUsers } from "@/redux/thunks/usersThunks";
import formatToIDR from "@/utils/formatToIDR";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FadeLoader } from "react-spinners";

export default function Page() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [year, setYear] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isShowQr, setIsShowQr] = useState(false);
  const [pin, setPin] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);

  // Mengambil data dari slice `users`
  const { error, user } = useSelector((state: RootState) => state.users);

  // Memuat data user saat komponen dirender
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    const currentYear = user?.memberInfoData.joinDate.slice(0, 4);
    setYear(currentYear || "");
  }, [user]);

  const handlePopUpQr = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setIsShowQr(false);
  };

  const handleCheckPin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pin === user.memberInfoData.pin) {
      setIsModalVisible(false);
      setIsShowQr(true);
      setPin("");
    } else {
      setErrorMessage(true);
      setTimeout(() => {
        setErrorMessage(false);
      }, 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("member");
    router.push("/");
  };

  if (user == null) {
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

  // Render konten jika user ditemukan
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <div className="flex flex-col items-center p-8 bg-base-accent rounded-b-3xl w-full">
          <div className="flex justify-center items-center relative w-full">
            <div className="relative">
              <Image
                src={`https://amscorp.id/card/${user.memberInfoData.tierInfo.cardImage}`}
                alt={`${user.memberInfoData.tierInfo.cardImage}`}
                width={500}
                height={500}
                className="logo shadow w-full h-auto"
              />
              <div className="absolute inset-0 flex flex-col items-start justify-start z-10 p-4">
                <span className="text-xs text-white">
                  {user.memberInfoData.fullName}
                </span>
                <span className="text-[8px] text-white">
                  MEMBER SEJAK {year}
                </span>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <span className="text-xs text-white">
                  {user.memberInfoData.tierInfo.tier_name}
                </span>
                <span className="text-[8px] text-white">TIER ANDA</span>
              </div>
              <div className="absolute inset-0 flex items-end justify-between z-10 p-6">
                <Link
                  href="/history-tier"
                  className="bg-white/50 flex px-2 rounded py-1 gap-1 cursor-pointer"
                >
                  <Image
                    src="/images/graf-up.svg"
                    alt="Grafik"
                    width={10}
                    height={12}
                    className="logo shadow"
                  />
                  <span className="text-[8px]">RIWAYAT TIER</span>
                </Link>
                <div
                  className="bg-white/50 flex px-2 rounded py-1 gap-1 cursor-pointer"
                  onClick={handlePopUpQr}
                >
                  <Image
                    src="/images/qr.svg"
                    alt="Barcode"
                    width={10}
                    height={12}
                    className="logo shadow"
                  />
                  <span className="text-[8px]">TAMPILKAN ID</span>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-white font-medium my-4 self-start">
            {user.memberInfoData.fullName}
          </h2>

          <div className="flex justify-between items-center w-full">
            <small className="text-white">
              Rp{" "}
              {formatToIDR(user.memberInfoData.tierInfo.amountForNextTier || 0)}{" "}
              untuk tier selanjutnya
            </small>
            <small className="text-white">
              {user.memberInfoData.tierInfo.memberPersentase || 0}%
            </small>
          </div>

          {/* Progress Bar */}
          <ProgressBar
            currentValue={user.memberInfoData.tierInfo.memberPersentase || 0}
            maxValue={100}
          />

          <div className="flex justify-between items-center w-full my-2">
            <small className="text-white">TOTAL POINT</small>
            <small className="text-white text-[10px]">
              100 Poin kadaluarsa pada 25 Desember 2024
            </small>
          </div>

          <div className="flex justify-between items-center w-full">
            <span className="text-yellow-500 text-lg">
              Rp {formatToIDR(user.memberInfoData.points || 0)}
            </span>
            <Link
              href="/history-point"
              className="text-white text-[10px] underline"
            >
              Riwayat Poin
            </Link>
          </div>
        </div>

        {/* Modal for Input PIN */}
        {isModalVisible && (
          <ModalInputPin
            pin={pin}
            setPin={setPin}
            handleCheckPin={handleCheckPin}
            closeModal={closeModal}
            errorMessage={errorMessage}
          />
        )}

        {/* Modal for QR code */}
        {isShowQr && (
          <ModalQRCode data={user.memberInfoData} closeModal={closeModal} />
        )}

        {/* Menu Section */}
        <MenuAccount />
        <button className="pb-24">
          <span className="text-sm" onClick={handleLogout}>
            SIGN OUT
          </span>
        </button>

        {/* tab bar */}
        <TabBar />
      </div>
    </div>
  );
}
