"use client";

import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import Input from "@/components/Input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import LogoHeader from "@/components/LogoHeader";

export default function Validasi() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [inputError, setInputError] = useState<{ [key: string]: string }>({});
  const [data, setData] = useState({
    userAccount: "",
    memberID: "",
  });

  useEffect(() => {
    // Ambil memberId dari localStorage saat komponen dimuat
    const memberID = localStorage.getItem("member") || "";
    setData((prevData) => ({ ...prevData, memberID }));
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "userAccount") {
      const emailRegex = /^[a-zA-Z0-9@.-_/s]*$/;
      if (!emailRegex.test(value)) {
        setInputError((prev) => ({
          ...prev,
          userAccount: "Format email tidak valid",
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

    if (!data.userAccount) errors.user = "Email tidak boleh kosong";

    setInputError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInputs()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `https://golangapi-j5iu.onrender.com/send-mail-otp-validasi?`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.responseCode === "2002500") {
        sessionStorage.setItem("email", data.userAccount);
        router.replace(`/otp-email`);
      } else {
        setError(true);
      }
    } catch (error) {
      console.log("Error processing OTP:", error);
    } finally {
      setLoading(false);
      setData((prevData) => ({ ...prevData, userAccount: "" }));
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
          <h1 className="text-xl">Validasi Email</h1>
          {error && <ErrorMessage message="Email tidak terdaftar" />}
          <p className="text-xs my-10 fontMon leading-relaxed">
            Pastikan memasukkan alamat email aktif. Kode OTP akan dikirimkan ke
            email.
          </p>
          <form action="" onSubmit={handleSendEmail}>
            <Input
              label="Alamat email"
              type="email"
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
                disabled={loading}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
