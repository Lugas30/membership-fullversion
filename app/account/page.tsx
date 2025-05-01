"use client";

import MenuAccount from "@/components/MenuAccount";
import ModalInputPin from "@/components/ModalInputPin";
import ModalQRCode from "@/components/ModalQrCode";
import ProgressBar from "@/components/PrgressBar";
import TabBar from "@/components/TabBar";
import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getUsers } from "@/redux/thunks/usersThunks";
import formatDate from "@/utils/formatDate";
import formatToIDR from "@/utils/formatToIDR";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FadeLoader } from "react-spinners";
import tiergroup from "../../public/images/tiergroup.svg";

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
    // setIsModalVisible(true);
    setIsShowQr(true);
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
    sessionStorage.removeItem("phone");
    router.replace("/");
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
          {/* Header info */}
          <div className="flex justify-between items-center pb-5 relative w-full">
            <span className="text-lg text-white normal-case">
              {toNormalCase(user.memberInfoData.fullName)}
            </span>
            <Link href="/transaction" className="text-white">
              <div className="flex justify-center items-center gap-2">
                <div className="flex flex-col items-end">
                  <span className="text-[7px] fontMon uppercase tracking-widest text-white">
                    Tier
                  </span>
                  <span className="text-sm text-white">
                    {user.memberInfoData.tierInfo.tier_name}
                  </span>
                </div>
                <Image
                  src={`https://amscorp.id/card/${user.memberInfoData.tierInfo.profileImage}`}
                  width={50}
                  height={50}
                  alt={`${user.memberInfoData.tierInfo.profileImage}`}
                  className="h-10 w-10 rounded-full"
                />
              </div>
            </Link>
          </div>
          {/* Header info */}
          {/* <div className="flex justify-center items-center relative w-full">
            <div className="relative">
              <Image
                src={`https://amscorp.id/card/${user.memberInfoData.tierInfo.cardImage}`}
                alt={`${user.memberInfoData.tierInfo.cardImage}`}
                width={500}
                height={500}
                className="logo shadow w-full h-[200px] sm:h-[230px] md:h-[230px] lg:h-auto"
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
          </div> */}

          {/* <h2 className="text-white text-lg my-4 self-start normal-case">
            {toNormalCase(user.memberInfoData.fullName)}
          </h2> */}

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

          {/* <div className="flex justify-between items-center w-full my-2">
            <small className="text-white text-[9px] fontMon tracking-wider">
              TOTAL POIN
            </small>
            {user.memberInfoData.expiredPoint !== 0 ? (
              <small className="text-white text-[9px] tracking-wider fontMon">
                {user.memberInfoData.expiredPoint} Poin kedaluwarsa pada{" "}
                {formatDate(user.memberInfoData.expiredPointDate)}
              </small>
            ) : (
              <></>
            )}
          </div> */}

          {/* <div className="flex justify-between items-center w-full my-2">
            <small className="text-white text-[9px] fontMon tracking-wider">
              TOTAL POIN
            </small>
            {user.memberInfoData.expiredPoint !== 0 ? (
              <small className="text-white text-[9px] tracking-wider fontMon">
                {user.memberInfoData.expiredPoint} Poin kedaluwarsa pada{" "}
                {formatDate(user.memberInfoData.expiredPointDate)}
              </small>
            ) : (
              <></>
            )}
          </div> */}

          {/* <div className="flex justify-between items-center w-full">
            <span className="text-amber-200 text-lg">
              Rp {formatToIDR(user.memberInfoData.points || 0)}
            </span>
            <Link
              href="/history-point"
              className="text-white text-[10px] tracking-wider underline underline-offset-8"
            >
              Riwayat Poin
            </Link>
          </div> */}

          {/* Member Info Island */}
          <div className="bg-white w-full rounded-xl flex justify-between p-4">
            <div className="flex flex-col">
              <small className=" text-[9px] fontMon tracking-wider">
                TOTAL POIN
              </small>
              <span className=" text-lg">
                {formatToIDR(user.memberInfoData.points || 0)}
              </span>
              <Link
                href="/history-point"
                className="text-[8px] tracking-wider fontMon"
              >
                Lihat Riwayat
              </Link>
            </div>
            <div className="flex flex-col">
              <small className=" text-[9px] fontMon tracking-wider">
                TOTAL VOUCHER
              </small>
              <span className=" text-lg">
                {user.memberInfoData.totalVoucher}
              </span>
              <Link
                href="/voucher"
                className="text-[8px] tracking-wider fontMon"
              >
                Lihat Voucher
              </Link>
            </div>
            <div className="my-auto">
              <div
                className="flex items-center justify-center border border-base-accent rounded-lg p-2 gap-2 cursor-pointer"
                onClick={handlePopUpQr}
              >
                <span className="text-[9px] tracking-wider">Show ID</span>
                <Image
                  src="/images/qr.svg"
                  width={50}
                  height={50}
                  alt="qr"
                  className="w-auto h-auto"
                />
              </div>
            </div>
          </div>

          {/* Member Benefit */}
          <Link
            href="/tier-info"
            className="bg-white w-full rounded-xl flex justify-between p-4 mt-2 h-14"
          >
            <div className="flex">
              <Image
                src={tiergroup}
                width={50}
                height={50}
                alt="qr"
                className="w-auto h-auto"
              />
              <span className="text-[10px] ml-2 w-[100px] my-auto">
                Lihat benefit tier
              </span>
            </div>
            <Image
              src="/images/arrow-right.svg"
              width={30}
              height={30}
              alt="arrow"
              className="w-auto h-auto"
            />
          </Link>
        </div>

        {/* Modal for Input PIN */}
        {isModalVisible && (
          <ModalInputPin
            pin={pin}
            setPin={setPin}
            handleCheckPin={handleCheckPin}
            closeModal={closeModal}
            errorMessage={errorMessage}
            maxLength={6}
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
