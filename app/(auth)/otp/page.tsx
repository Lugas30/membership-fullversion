"use client";

import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import LogoHeader from "@/components/LogoHeader";
import SuccessMessage from "@/components/SuccessMessage";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

export default function Otp() {
  const router = useRouter();
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [message, setMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
  ];

  const focusNextInput = (index: number) => {
    if (index < inputRefs.length - 1 && inputRefs[index + 1].current) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const focusPreviousInput = (index: number) => {
    if (index > 0 && inputRefs[index - 1].current) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleChange = (e: { target: { value: string } }, index: number) => {
    const val = e.target.value;
    const updatedValues = [...otpValues];
    updatedValues[index] = val;
    setOtpValues(updatedValues);

    if (val.length === 1 && index < inputRefs.length - 1) {
      focusNextInput(index);
    } else if (val.length === 0 && index > 0) {
      focusPreviousInput(index);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const otpInput = otpValues.join("");
    const getPhone = sessionStorage.getItem("phone");

    try {
      const response = await axios.post(
        `https://golangapi-j5iu.onrender.com/send-wa-otp-verify?userAccount=${getPhone}&otp=${otpInput}`,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.responseCode === "2002500") {
        router.replace(`/reset-password`);
      } else {
        setErrorMessage(true);
      }
    } catch (error) {
      console.log("Error OTP:", error);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setErrorMessage(false);
      }, 2000);
      setOtpValues(["", "", "", "", "", ""]);
    }
  };

  const handleRecodeOTP = async () => {
    const getPhone = sessionStorage.getItem("phone");

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}dashboard/Verify?userAccount=${getPhone}`
    );

    if (response.data.responseCode === "2002500") {
      setMessage(true);
      setTimeout(() => {
        setMessage(false);
      }, 5000);
    } else {
      console.log("Error OTP:", response.data);
    }

    setCountdown(60);
    setIsWaiting(true);
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(timer);
          setIsWaiting(false);
          return null;
        }
        return prevCountdown ? prevCountdown - 1 : null;
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <LogoHeader className="m-20" />

        <div className="flex flex-col w-full px-12">
          {message && <SuccessMessage message="OTP Berhasil dikirim" />}
          {errorMessage && (
            <ErrorMessage message="OTP yang anda masukkan salah" />
          )}
        </div>

        <div className="flex flex-col justify-center items-center m-8">
          <h2 className="text-lg font-bold">Masukkan kode OTP</h2>
          <p className="text-xs text-center my-6 fontMon">
            kode OTP akan dikirmkan melalui Whatsapp
          </p>
          <form action="" onSubmit={handleSubmit}>
            <div className="flex justify-center mb-6">
              {inputRefs.map((ref, index) => (
                <input
                  key={index}
                  ref={ref}
                  type="tel"
                  maxLength={1}
                  value={otpValues[index]}
                  className="border-2 rounded-md border-gray-200 text-center w-10 mx-2 p-2 max-w-screen mt-2 focus:outline-none focus:border-primary"
                  onChange={(e) => handleChange(e, index)}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              ))}
            </div>

            <Button
              label="KIRIM"
              className="bg-base-accent text-white"
              loading={loading}
              disabled={loading}
            />

            <p className="text-center text-xs mt-4">
              Tidak menerima kode OTP?{" "}
              {isWaiting ? (
                <span className="text-gray-500">
                  Kirim ulang dalam {countdown} detik
                </span>
              ) : (
                <span onClick={handleRecodeOTP} className="cursor-pointer">
                  Kirim ulang.
                </span>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
