"use client";

import Brand from "@/components/Brand";
import Carousel from "@/components/Carousel";
import ModalInputPin from "@/components/ModalInputPin";
import ModalQRCode from "@/components/ModalQrCode";
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
import Misi from "@/public/images/CRM-Mission.svg";
import Lucky from "@/public/images/CRM-Lucky draw.svg";
import Referral from "@/public/images/CRM-Referral.svg";
import Promo from "@/public/images/CRM-Promo.svg";

export default function Page() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isShowQr, setIsShowQr] = useState(false);
  const [pin, setPin] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const { error, user } = useSelector((state: RootState) => state.users);

  // Memuat data user saat komponen dirender
  useEffect(() => {
    const member = localStorage.getItem("member");
    const token = localStorage.getItem("token");
    if (!member || !token) {
      router.replace("/"); // Redirect ke halaman login
    } else {
      dispatch(getUsers()); // Panggil thunk dengan token
    }
  }, [dispatch, router]);

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

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <div className="bg-base-accent w-full">
          {/* notif verif email */}
          {user.memberInfoData.emailStatus == "email not verified" ? (
            <div className="bg-red-600 w-full text-center py-2">
              <p className="text-[10px] text-white fontMon">
                Anda belum verifkasi email.{" "}
                <Link
                  href="/validasi-email"
                  className="underline underline-offset-4"
                >
                  Klik disini
                </Link>
              </p>
            </div>
          ) : (
            <></>
          )}
          <div className="flex justify-between items-center p-8">
            <span className="text-lg text-white normal-case">
              {toNormalCase(user.memberInfoData.fullName)}
            </span>
            <Link href="/account" className="text-white">
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

          {/* promo carousel */}
          <div className="px-8 flex flex-col items-end z-10 relative">
            <div className="w-full h-full rounded-lg">
              <Carousel />
            </div>
            <Link
              href={"/promo"}
              className="text-[8px] tracking-wider z-20 mt-2 fontMon"
            >
              LIHAT SEMUA
            </Link>
          </div>
          {/* promo carousel */}

          <div className="flex flex-col bg-white p-8 pt-28 rounded-t-3xl -top-24 relative">
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-start">
                <span className="text-[8px] tracking-wider fontMon">
                  TOTAL POIN
                </span>
                <span className="font-medium">
                  Rp {formatToIDR(user.memberInfoData.points || 0)}
                </span>
              </div>
              <div
                className="flex items-center justify-center border border-base-accent rounded-lg p-2 gap-2 cursor-pointer"
                onClick={handlePopUpQr}
              >
                <span className="text-[9px] tracking-wider">Tampilkan QR</span>
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

          <div className="flex justify-between items-center px-8 pt-8 gap-2 bg-white -top-20 relative">
            <div className="flex flex-col justify-center items-center gap-2 w-16">
              <Image
                src={Misi}
                width={50}
                height={50}
                alt="Misi"
                className="w-auto h-full rounded-md"
              />
              <span className="text-[10px]">Misi</span>
            </div>
            <Link
              href="/lucky-draw"
              className="flex flex-col justify-center items-center gap-2 w-16"
            >
              <Image
                src={Lucky}
                width={50}
                height={50}
                alt="Lucky Draw"
                className="w-auto h-full rounded-md"
              />
              <span className="text-[10px]">Lucky Draw</span>
            </Link>
            <div className="flex flex-col justify-center items-center gap-2 w-16">
              <Image
                src={Referral}
                width={50}
                height={50}
                alt="Referral"
                className="w-auto h-full rounded-md"
              />
              <span className="text-[10px]">Referral</span>
            </div>
            <Link
              href="/promo"
              className="flex flex-col justify-center items-center gap-2 w-16"
            >
              <Image
                src={Promo}
                width={50}
                height={50}
                alt="Promo"
                className="w-auto h-full rounded-md"
              />
              <span className="text-[10px]">Promo</span>
            </Link>
          </div>
          <div className="flex flex-col p-8 gap-2 bg-white -top-20 relative">
            <h2 className="text-lg mb-4">Brand Kami</h2>
            <Brand />
          </div>
        </div>
        <TabBar />
      </div>
    </div>
  );
}
