"use client";

import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import Input from "@/components/Input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LogoHeader from "@/components/LogoHeader";

export default function Validasi() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [inputError, setInputError] = useState<{ [key: string]: string }>({});
  const [data, setData] = useState({
    userAccount: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "userAccount") {
      if (!/^\d*$/.test(value)) {
        setInputError((prev) => ({
          ...prev,
          userAccount: "Nomor handphone hanya boleh mengandung angka",
        }));
        return; // Keluar agar tidak mengubah state `data`
      }
    }

    setData((prevData) => ({ ...prevData, [name]: value }));

    // Hapus pesan error untuk input yang valid
    setInputError((prev) => ({ ...prev, [name]: "" }));
  };

  const validateInputs = () => {
    const errors: { [key: string]: string } = {};

    if (!data.userAccount) errors.user = "No Handphone tidak boleh kosong";

    setInputError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendPhone = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInputs()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}dashboard/Verify?userAccount=${data.userAccount}`
      );

      if (response.data.responseCode === "2002500") {
        localStorage.setItem("member", response.data.loginData.memberID);
        sessionStorage.setItem("phone", data.userAccount);
        router.replace(`/otp-validasi`);
      } else {
        setError(true);
      }
    } catch (error) {
      console.log("Error processing OTP:", error);
    } finally {
      setLoading(false);
      setData({ userAccount: "" });
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <LogoHeader className="m-12" />
        <div className="flex flex-col w-full p-8">
          <h1 className="text-xl">Validasi Nomor</h1>
          {error && <ErrorMessage message="No handphone tidak terdaftar" />}
          <p className="text-xs my-10 fontMon leading-relaxed">
            Pastikan memasukkan nomor yang telah terdaftar dan aktif. Kode OTP
            akan dikirimkan via WhatsApp.
          </p>
          <form action="" onSubmit={handleSendPhone}>
            <Input
              label="No. Handphone"
              type="tel"
              name="userAccount"
              value={data.userAccount}
              onChange={handleChange}
              error={inputError.userAccount}
              className="mb-6"
            />

            <div className="flex justify-center pt-5">
              <Button
                label="VALIDASI"
                className="bg-base-accent text-white"
                loading={loading}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
