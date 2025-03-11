"use client";

import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import Input from "@/components/Input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LogoHeader from "@/components/LogoHeader";

export default function ChangePhoneNumber() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [inputError, setInputError] = useState<{ [key: string]: string }>({});
  const [data, setData] = useState({
    memberID: "",
    noTelepon: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setData((prevData) => ({
        ...prevData,
        memberID: localStorage.getItem("member") || "",
      }));
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "noTelepon") {
      if (!/^\d*$/.test(value)) {
        setInputError((prev) => ({
          ...prev,
          noTelepon: "Nomor handphone hanya boleh mengandung angka",
        }));
        return;
      }
    }

    setData((prevData) => ({ ...prevData, [name]: value }));
    setInputError((prev) => ({ ...prev, [name]: "" }));
  };

  const validateInputs = () => {
    const errors: { [key: string]: string } = {};

    if (!data.noTelepon) errors.noTelepon = "No Handphone tidak boleh kosong";

    setInputError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInputs()) return;

    setLoading(true);

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}change-p/send-otp-v2`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.responseCode === "2002500") {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("phone", data.noTelepon);
          localStorage.setItem("memberID", response.data.loginData.memberID);
          localStorage.setItem("email", response.data.loginData.email);
        }
        router.replace(`/otp-new-phone-number`);
      } else if (response.data.responseCode === "4002501") {
        setErrorMessage(
          "Email belum terverifikasi, harap verifikasi terlebih dahulu."
        );
        setError(true);
      } else if (response.data.responseCode === "4002500") {
        setErrorMessage("Nomor handphone telah terdaftar");
        setError(true);
      } else {
        setErrorMessage("Terjadi kesalahan, silakan coba lagi.");
        setError(true);
      }
    } catch (error: any) {
      setErrorMessage("Terjadi kesalahan, silakan coba lagi.");
      setError(true);
    } finally {
      setLoading(false);
      setData((prevData) => ({
        ...prevData,
        noTelepon: "",
      }));

      setTimeout(() => {
        setError(false);
        setErrorMessage("");
      }, 3000);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <LogoHeader className="m-12" />
        <div className="flex flex-col w-full p-8">
          <h1 className="text-xl">Ubah Nomor Handphone</h1>
          {error && <ErrorMessage message={errorMessage} />}
          <p className="text-xs my-10 fontMon leading-relaxed">
            Masukkan nomor handphone baru. Kode OTP akan dikirimkan ke nomor
            handphone baru dan email yang telah terverifikasi.
          </p>
          <form action="" onSubmit={handleSend}>
            <Input
              label="No. Handphone Baru"
              type="tel"
              name="noTelepon"
              value={data.noTelepon}
              onChange={handleChange}
              error={inputError.noTelepon}
              className="mb-6"
            />

            <div className="flex justify-center pt-5">
              <Button
                label="KIRIM"
                className="bg-base-accent text-white"
                loading={loading}
                disabled={loading} // Tombol dinonaktifkan saat loading
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
