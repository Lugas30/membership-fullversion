"use client";

import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import Input from "@/components/Input";
import SuccessMessage from "@/components/SuccessMessage";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [inputError, setInputError] = useState<{ [key: string]: string }>({});
  const [data, setData] = useState({
    userAccount: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
    setInputError({});
  };

  const validateInputs = () => {
    const errors: { [key: string]: string } = {};

    if (!data.userAccount) errors.user = "No Telepon tidak boleh kosong";

    setInputError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendPhone = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInputs()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `https://golangapi-j5iu.onrender.com/send-wa-otp-forgot-password?userAccount=${data.userAccount}`
      );

      if (response.data.responseCode === "2002500") {
        setSuccess(true);
      } else if (response.data.responseCode === "4002501") {
        setError("Telah melampaui batas permintaan perhari");
      } else {
        setError("Nomor tidak terdaftar.");
      }
    } catch (error) {
      console.log("Error processing OTP:", error);
      setError("Terjadi kesalahan saat memproses permintaan.");
    } finally {
      setLoading(false);
      setData({ userAccount: "" });
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <div className="flex flex-col w-full p-8">
          <h1 className="text-lg font-medium">Atur ulang password</h1>
          {success && (
            <SuccessMessage message="Link ubah password telah dikirim" />
          )}
          {error && <ErrorMessage message={error} />}
          <p className="text-sm mt-20 mb-10">
            Kami akan mengirimkan link via Whatsapp untuk mengatur ulang
            passsword.
          </p>
          <form action="" onSubmit={handleSendPhone}>
            <Input
              label="No. Handphone"
              type="tel"
              name="userAccount"
              value={data.userAccount}
              onChange={handleChange}
              error={inputError.user}
              className="mb-6"
            />

            <div className="flex justify-center py-4">
              <Button
                label="KIRIM PERMINTAAN"
                className="bg-base-accent text-white"
                loading={loading}
                disabled={loading}
              />
            </div>
            <div className="text-xs text-center fontMon my-4">
              <Link href="/forgot-password-email">Kirim melalui email</Link>
            </div>
            <div className="text-xs text-center fontMon my-8 underline underline-offset-4">
              <Link href="/">Kembali ke beranda</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
