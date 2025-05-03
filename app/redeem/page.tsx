"use client";

import { useEffect, useState, ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { FadeLoader } from "react-spinners";
import Barcode from "react-barcode";
import Button from "@/components/Button";
import Countdown from "@/components/Countdown";
import formatToIDR from "@/utils/formatToIDR";
import { getUsers } from "@/redux/thunks/usersThunks";
import { getVoucher } from "@/redux/thunks/voucherThunks";
import axios from "axios";
import ErrorMessage from "@/components/ErrorMessage";
import Vouchers from "./Vouchers";
import Special from "./Special";
import Input from "@/components/Input";

interface Voucher {
  id: number;
  voucherCode: string;
  category: string;
  voucherTitle: string;
  nominal: number;
  fromDate: string;
  toDate: string;
  status_Voucher: string;
}

interface VoucherRedeem {
  voucherCode: string;
  category: string;
  nominal: number;
  endDate: string;
}

interface Redeem {
  memberID: string;
  voucher_code: string;
  ip_address: string;
}

export default function Redeem() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user, error } = useSelector((state: RootState) => state.users);
  const { data } = useSelector((state: RootState) => state.voucher);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [voucherRedeem, setVoucherRedeem] = useState<VoucherRedeem | null>(
    null
  );
  const [errorMessageRedeemPoint, setErrorMessageRedeemPoint] = useState(false);
  const [errorMessageRedeemBatas, setErrorMessageRedeemBatas] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [menu, setMenu] = useState<"voucher" | "special">("voucher");

  const [redeem, setRedeem] = useState<Redeem>({
    memberID: "",
    voucher_code: "",
    ip_address: "",
  });

  const [isPinModalVisible, setIsPinModalVisible] = useState(false);
  const [pin, setPin] = useState("");
  const [pinErrorMessage, setPinErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const member = localStorage.getItem("member");

      setRedeem((prev) => ({
        ...prev,
        memberID: member || "",
        ip_address: "-",
      }));
      dispatch(getUsers());
      dispatch(getVoucher());
    }
  }, [dispatch]);

  const handleMenuChange = (selectedMenu: "voucher" | "special") => {
    setMenu(selectedMenu);
  };

  const renderMenuContent = () => {
    if (menu === "voucher") {
      const filterData = data.filter(
        (item: Voucher) => item.category === "VCR"
      );
      return (
        <Vouchers
          handleSubmit={handleSubmit}
          handleSelectVoucher={handleSelectVoucher}
          isLoading={isLoading}
          selectedVoucher={selectedVoucher}
          data={filterData}
          userPoints={user.memberInfoData.points}
          handleMaxPoints={handleMaxPoints}
          points={points}
          handleChange={handleChange}
        />
      );
    }
    if (menu === "special") {
      const filterData = data.filter(
        (item: Voucher) => item.category === "VCRSPCL"
      );
      return (
        <Special
          handleSubmit={handleSubmit}
          handleSelectVoucher={handleSelectVoucher}
          isLoading={isLoading}
          selectedVoucher={selectedVoucher}
          data={filterData}
        />
      );
    }
    return null;
  };

  const handleSelectVoucher = (voucherCode: string) => {
    setSelectedVoucher(voucherCode);
    setRedeem((prev) => ({ ...prev, voucher_code: voucherCode }));
  };

  const handleInputPinChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPin(e.target.value);
  };

  const handlePinSubmit = async () => {
    if (!pin || pin.length < 6) {
      setPinErrorMessage("PIN harus terdiri dari 6 digit.");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (points == "") {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}voucher/redeem`,
          {
            memberID: redeem.memberID,
            voucher_code: redeem.voucher_code,
            ip_address: redeem.ip_address,
            pin,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.responseCode === "2002500") {
          setVoucherRedeem(response.data.voucherData);
          setIsModalVisible(true);
          setIsPinModalVisible(false);
          dispatch(getUsers());
        } else if (response.data.responseCode === "4002501") {
          setPinErrorMessage("PIN yang Anda masukkan salah.");
          setIsPinModalVisible(true);
          return;
        } else {
          setErrorMessageRedeemPoint(true);
          setIsPinModalVisible(false);
        }
      } else {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}voucher/redeem/custom`,
          {
            memberID: redeem.memberID,
            nominal: points,
            ip_address: redeem.ip_address,
            pin,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.responseCode === "2002500") {
          setVoucherRedeem(response.data.voucherData);
          setIsModalVisible(true);
          setIsPinModalVisible(false);
          dispatch(getUsers());
        } else if (response.data.responseCode === "4002501") {
          setPinErrorMessage("PIN yang Anda masukkan salah.");
          setIsPinModalVisible(true);
          return;
        } else {
          setErrorMessageRedeemPoint(true);
          setIsPinModalVisible(false);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setPin("");
    }
  };

  const [points, setPoints] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPoints(value);
  };

  const handleMaxPoints = () => {
    if (user?.memberInfoData?.points !== undefined) {
      setPoints(user.memberInfoData.points);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // if (!selectedVoucher || points == "") {
    //   setErrorMessage(true);
    //   setTimeout(() => setErrorMessage(false), 3000);
    //   return;
    // }
    setIsPinModalVisible(true);
  };

  if (!user || !data) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-screen">
        <Image src="/images/logo.svg" width={150} height={150} alt="logo" />
        <FadeLoader color="#101E2B" width={5} />
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <div className="flex flex-col m-8 w-full">
          <div className="flex flex-col px-8">
            {/* Header */}
            <div className="flex items-center">
              <Image
                src="/images/arrow-left.svg"
                width={30}
                height={30}
                alt="arrow-left"
                className="w-auto h-auto cursor-pointer absolute"
                onClick={() => window.history.back()}
              />
              <div className="flex-grow flex justify-center">
                <span className="text-xl">Tukar Poin</span>
              </div>
            </div>

            {/* Menu */}
            <div className="flex justify-evenly items-center my-8">
              <span
                className={`text-xs font-medium cursor-pointer ${
                  menu === "voucher" ? "underline underline-offset-8" : ""
                }`}
                onClick={() => handleMenuChange("voucher")}
              >
                Voucher Belanja
              </span>
              <span
                className={`text-xs font-medium cursor-pointer ${
                  menu === "special" ? "underline underline-offset-8" : ""
                }`}
                onClick={() => handleMenuChange("special")}
              >
                Special Offer
              </span>
            </div>

            {errorMessage && <ErrorMessage message="Silahkan pilih voucher" />}
            {errorMessageRedeemBatas && (
              <ErrorMessage message="Anda sudah tukar voucher" />
            )}
            {errorMessageRedeemPoint && (
              <ErrorMessage message="Poin anda tidak mencukupi" />
            )}

            {/* Content */}
            <div className="flex flex-col justify-center text-center items-center mt-4">
              <span className="text-xs">
                {menu === "voucher"
                  ? "Tukarkan poin menjadi voucher belanja"
                  : "Penawaran khusus untuk penukaran poin dengan voucher spesial terbatas"}
              </span>

              <div className="flex flex-col justify-center items-center mt-10">
                <span className="text-[10px] fontMon tracking-wider">
                  TOTAL POIN
                </span>
                <span className="text-lg font-medium">
                  Rp {formatToIDR(user.memberInfoData.points || 0)}
                </span>
              </div>

              <div className="mt-10 mb-4">
                <span className="text-xs">Nominal poin yang akan ditukar</span>
              </div>

              {renderMenuContent()}
            </div>
          </div>

          {/* Modal */}
          {isModalVisible && voucherRedeem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
              <div className="bg-white w-full max-w-md shadow-lg rounded-lg">
                <div className="flex justify-end items-center p-4">
                  <button
                    onClick={() => {
                      setIsModalVisible(false);
                    }}
                    className="text-black"
                  >
                    &#10005;
                  </button>
                </div>

                <div className="flex flex-col justify-center items-center w-full">
                  <span className="text-xs text-center px-4">
                    Berhasil menukar poin dengan voucher senilai Rp{" "}
                    {formatToIDR(voucherRedeem.nominal)}
                  </span>

                  <div className="w-full p-4">
                    <div
                      className={`${
                        voucherRedeem.category == "VCR"
                          ? "bg-[#E0DDD4]"
                          : "bg-[#1E201E] text-white"
                      } w-full max-w-md rounded-lg border border-gray-300 p-6 flex flex-col justify-between space-y-4 shadow-md mb-3`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">
                            {/* {voucherRedeem.name} */}
                            Voucher
                          </span>
                          <div className="">
                            <span
                              className={`text-sm ${
                                voucherRedeem.category == "VCR"
                                  ? "text-[#1E201E]"
                                  : "text-white"
                              }`}
                            >
                              Code :{" "}
                            </span>
                            <span className="text-sm font-semibold">
                              {voucherRedeem.voucherCode}
                            </span>
                          </div>
                        </div>
                        {voucherRedeem.category == "VCR" ? (
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
                            voucherRedeem.category == "VCR"
                              ? "text-[#1E201E]"
                              : "text-white"
                          }`}
                        >
                          Rp {formatToIDR(voucherRedeem.nominal)}
                        </h1>
                      </div>

                      <div className="flex justify-between items-center">
                        <span
                          className={`text-xs ${
                            voucherRedeem.category == "VCR"
                              ? "text-[#1E201E]"
                              : "text-white"
                          } `}
                        >
                          <Countdown targetDate={voucherRedeem.endDate} />
                        </span>
                        <Barcode
                          value={voucherRedeem.voucherCode}
                          displayValue={false}
                          height={20}
                          margin={0}
                          width={1}
                          lineColor={`${
                            voucherRedeem.category == "VCR"
                              ? "#1E201E"
                              : "#F8FAFC"
                          }`}
                          background="transparent"
                        />
                      </div>
                    </div>

                    <div className="flex justify-center my-8">
                      <Button
                        label="Lihat Voucher"
                        onClick={() => (
                          setIsModalVisible(false),
                          setVoucherRedeem(null),
                          router.push("/voucher")
                        )}
                        className="bg-base-accent text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal input PIN */}
          {isPinModalVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50">
              <div className="bg-white w-full max-w-md shadow-lg p-6 rounded-t-2xl">
                <div className="flex justify-end items-center">
                  <button
                    onClick={() => {
                      setIsPinModalVisible(false),
                        setPinErrorMessage(""),
                        setPin("");
                    }}
                    className="text-black"
                  >
                    &#10005;
                  </button>
                </div>
                <h2 className="text-center text-lg font-semibold mb-5">
                  Masukkan PIN
                </h2>
                {/* Pesan Error */}

                {pinErrorMessage && <ErrorMessage message={pinErrorMessage} />}

                <p className="text-gray-600 my-4 text-center text-xs fontMon">
                  Masukkan 6 digit angka PIN anda
                </p>
                <Input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name="pin"
                  value={pin}
                  maxLength={6}
                  onChange={handleInputPinChange}
                  className="pb-10 w-2/3 mx-auto text-center"
                />
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    label="Submit"
                    onClick={handlePinSubmit}
                    disabled={isLoading}
                    className="bg-base-accent text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
