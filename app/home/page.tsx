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
    if (!member) {
      router.push("/"); // Redirect ke halaman login
    } else {
      dispatch(getUsers());
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

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <div className="bg-base-accent w-full">
          <div className="flex justify-between items-center p-8">
            <span className="text-sm text-white">
              {user.memberInfoData.fullName}
            </span>
            <div className="flex justify-center items-center gap-2">
              <div className="flex flex-col items-end">
                <span className="text-xs text-white">Tier Kamu</span>
                <span className="text-xs text-white">
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
          </div>

          {/* promo carousel */}
          <div className="px-8 flex flex-col items-end z-10 relative">
            <div className="w-full h-full rounded-lg">
              <Carousel />
            </div>
            <Link href={"/promo"} className="text-xs z-20 mt-2">
              LIHAT SEMUA
            </Link>
          </div>
          {/* promo carousel */}

          <div className="flex flex-col bg-white p-8 pt-28 rounded-t-3xl -top-24 relative">
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-start">
                <span className="text-xs">TOTAL POIN</span>
                <span className="font-medium">
                  Rp {formatToIDR(user.memberInfoData.points || 0)}
                </span>
              </div>
              <div
                className="flex items-center justify-center border border-base-accent rounded-lg p-2 gap-2 cursor-pointer"
                onClick={handlePopUpQr}
              >
                <span className="text-xs">Tampilkan QR</span>
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

          <div className="flex justify-between items-center p-8 gap-2 bg-white -top-20 relative">
            <div className="flex flex-col justify-center items-center gap-2">
              <Image
                src="https://via.placeholder.com/200x200"
                width={50}
                height={50}
                alt="Misi"
                className="w-auto h-auto rounded-md"
              />
              <span className="text-xs">Misi</span>
            </div>
            <Link
              href="/lucky-draw"
              className="flex flex-col justify-center items-center gap-2"
            >
              <Image
                src="https://via.placeholder.com/200x200"
                width={50}
                height={50}
                alt="Hadiah"
                className="w-auto h-auto rounded-md"
              />
              <span className="text-xs">Lucky Draw</span>
            </Link>
            <div className="flex flex-col justify-center items-center gap-2">
              <Image
                src="https://via.placeholder.com/200x200"
                width={50}
                height={50}
                alt="Referal"
                className="w-auto h-auto rounded-md"
              />
              <span className="text-xs">Referal</span>
            </div>
            <Link
              href="/promo"
              className="flex flex-col justify-center items-center gap-2"
            >
              <Image
                src="https://via.placeholder.com/200x200"
                width={50}
                height={50}
                alt="Promo"
                className="w-auto h-auto rounded-md"
              />
              <span className="text-xs">Promo</span>
            </Link>
          </div>
          <div className="flex flex-col p-8 gap-2 bg-white -top-20 relative">
            <h2 className="font-medium mb-4">Brand Kami</h2>
            <Brand />
          </div>
        </div>
        <TabBar />
      </div>
    </div>
  );
}
