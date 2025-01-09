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

  function toNormalCase(str: string) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  const handleLogout = () => {
    localStorage.removeItem("member");
    localStorage.removeItem("token");
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
                <span className="text-sm text-white mb-1 normal-case">
                  {toNormalCase(user.memberInfoData.fullName)}
                </span>
                <span className="text-[8px] fontMon text-white tracking-widest">
                  MEMBER SEJAK {year}
                </span>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <span className="text-sm fontMon uppercase tracking-widest text-white mb-1">
                  {user.memberInfoData.tierInfo.tier_name}
                </span>
                <span className="text-[8px] fontMon tracking-widest text-white">
                  TIER
                </span>
              </div>
              <div className="absolute inset-0 flex items-end justify-between z-10 p-6">
                <Link
                  href="/history-tier"
                  className="bg-white/50 flex p-2 rounded gap-1 cursor-pointer"
                >
                  <Image
                    src="/images/graf-up.svg"
                    alt="Grafik"
                    width={10}
                    height={12}
                    className="logo shadow"
                  />
                  <span className="text-[8px] fontMon tracking-widest">
                    RIWAYAT TIER
                  </span>
                </Link>
                <div
                  className="bg-white/50 flex p-2 rounded gap-1 cursor-pointer"
                  onClick={handlePopUpQr}
                >
                  <Image
                    src="/images/qr.svg"
                    alt="Barcode"
                    width={10}
                    height={12}
                    className="logo shadow"
                  />
                  <span className="text-[8px] fontMon tracking-widest">
                    TAMPILKAN ID
                  </span>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-white text-lg my-4 self-start normal-case">
            {toNormalCase(user.memberInfoData.fullName)}
          </h2>

          {/* <div className="flex justify-between items-center w-full text-pretty">
            <small className="text-white text-[10px] tracking-wider fontMon">
              Rp{" "}
              {formatToIDR(user.memberInfoData.tierInfo.amountForNextTier || 0)}{" "}
              untuk tier selanjutnya
            </small>
            <small className="text-white">
              {user.memberInfoData.tierInfo.memberPersentase || 0}%
            </small>
          </div> */}

          {/* Progress Bar */}
          {user.memberInfoData.tierInfo.tier_name === "Maestro" ? (
            <>
              <div className="flex justify-between items-center w-full text-pretty">
                <small className="text-white text-[10px] tracking-wider fontMon">
                  Kamu telah mencapai tier tertinggi.
                </small>
                <small className="text-white">{100}%</small>
              </div>

              {/* Progress Bar */}
              <ProgressBar currentValue={100} maxValue={100} />
            </>
          ) : (
            <>
              <div className="flex justify-between items-center w-full text-pretty">
                <small className="text-white text-[10px] tracking-wider fontMon">
                  Rp{" "}
                  {formatToIDR(
                    user.memberInfoData.tierInfo.amountForNextTier || 0
                  )}{" "}
                  untuk tier selanjutnya
                </small>
                <small className="text-white">
                  {user.memberInfoData.tierInfo.memberPersentase || 0}%
                </small>
              </div>

              {/* Progress Bar */}
              <ProgressBar
                currentValue={
                  user.memberInfoData.tierInfo.memberPersentase || 0
                }
                maxValue={100}
              />
            </>
          )}

          <div className="flex justify-between items-center w-full my-2">
            <small className="text-white text-[9px] fontMon tracking-wider">
              TOTAL POIN
            </small>
            <small className="text-white text-[9px] tracking-wider fontMon">
              100 Poin kedaluwarsa pada 25 Desember 2024
            </small>
          </div>

          <div className="flex justify-between items-center w-full">
            <span className="text-amber-200 text-lg">
              Rp {formatToIDR(user.memberInfoData.points || 0)}
            </span>
            <Link
              href="/history-point"
              className="text-white text-[10px] tracking-wider underline underline-offset-8"
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
        <button className="pb-24 my-3 underline underline-offset-4">
          <span className="text-sm tracking-wider" onClick={handleLogout}>
            SIGN OUT
          </span>
        </button>

        {/* tab bar */}
        <TabBar />
      </div>
    </div>
  );
}
