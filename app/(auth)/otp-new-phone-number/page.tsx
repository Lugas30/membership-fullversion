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
  const [otpWaValues, setOtpWaValues] = useState(["", "", "", "", "", ""]);
  const [otpEmailValues, setOtpEmailValues] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [message, setMessage] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRefsWa = Array.from({ length: 6 }, () =>
    useRef<HTMLInputElement | null>(null)
  );
  const inputRefsEmail = Array.from({ length: 6 }, () =>
    useRef<HTMLInputElement | null>(null)
  );

  const focusNextInput = (
    index: number,
    refs: React.RefObject<HTMLInputElement>[]
  ) => {
    if (index < refs.length - 1 && refs[index + 1].current) {
      refs[index + 1].current?.focus();
    }
  };

  const focusPreviousInput = (
    index: number,
    refs: React.RefObject<HTMLInputElement>[]
  ) => {
    if (index > 0 && refs[index - 1].current) {
      refs[index - 1].current?.focus();
    }
  };

  const handleChange = (
    e: { target: { value: string } },
    index: number,
    setOtpValues: React.Dispatch<React.SetStateAction<string[]>>,
    refs: React.RefObject<HTMLInputElement>[]
  ) => {
    const val = e.target.value;
    setOtpValues((prev) => {
      const updatedValues = [...prev];
      updatedValues[index] = val;
      return updatedValues;
    });

    if (val.length === 1) {
      focusNextInput(index, refs);
    } else if (val.length === 0) {
      focusPreviousInput(index, refs);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}change-p/verify-v2`,
        {
          memberID: localStorage.getItem("member"),
          noTelepon: sessionStorage.getItem("phone"),
          email: localStorage.getItem("email"),
          otp_wa: otpWaValues.join(""),
          otp_email: otpEmailValues.join(""),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.responseCode === "2002500") {
        setMessageSuccess(true);
        setTimeout(() => {
          router.replace(`/home`);
        }, 2000);
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
      setOtpWaValues(["", "", "", "", "", ""]);
      setOtpEmailValues(["", "", "", "", "", ""]);
    }
  };

  const handleRecodeOTP = async () => {
    const getPhone = sessionStorage.getItem("phone");

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}change-p/send-otp-v2`,
      {
        memberID: localStorage.getItem("member"),
        noTelepon: getPhone,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
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
          {messageSuccess && (
            <SuccessMessage message="Nomor handphone berhasil diganti" />
          )}
          {errorMessage && (
            <ErrorMessage message="OTP yang anda masukkan salah" />
          )}
        </div>

        <div className="flex flex-col justify-center items-center m-8">
          <h2 className="text-lg font-bold">Verifikasi Ubah Nomor Handphone</h2>
          <p className="text-xs text-center my-6 fontMon">
            Kode OTP dikirimkan melalui WhatsApp dan Email.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center mb-6">OTP WhatsApp</div>
            <div className="flex justify-center mb-6">
              {inputRefsWa.map((ref, index) => (
                <input
                  key={index}
                  ref={ref}
                  type="tel"
                  maxLength={1}
                  value={otpWaValues[index]}
                  className="border-2 rounded-md text-center w-10 mx-2 p-2"
                  onChange={(e) =>
                    handleChange(e, index, setOtpWaValues, inputRefsWa)
                  }
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              ))}
            </div>
            <div className="flex justify-center mb-6">OTP Email</div>
            <div className="flex justify-center mb-6">
              {inputRefsEmail.map((ref, index) => (
                <input
                  key={index}
                  ref={ref}
                  type="tel"
                  maxLength={1}
                  value={otpEmailValues[index]}
                  className="border-2 rounded-md text-center w-10 mx-2 p-2"
                  onChange={(e) =>
                    handleChange(e, index, setOtpEmailValues, inputRefsEmail)
                  }
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              ))}
            </div>
            <div className="flex justify-center pt-4">
              <Button
                label="VERIFIKASI OTP"
                className="bg-base-accent text-white"
                loading={loading}
                disabled={loading}
              />
            </div>
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
