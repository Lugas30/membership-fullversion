"use client";

import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import Input from "@/components/Input";
import LogoHeader from "@/components/LogoHeader";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type UserLogin = {
  user: string;
  password: string;
  loading: boolean;
};

export default function Login() {
  const router = useRouter();
  const [inputError, setInputError] = useState<{ [key: string]: string }>({});
  const [isError, setIsError] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [data, setData] = useState<UserLogin>({
    user: "",
    password: "",
    loading: false,
  });

  // Handle change function for form inputs
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Validate phone number for "user" field
    if (name === "user" && !/^\d*$/.test(value)) {
      setInputError((prev) => ({
        ...prev,
        user: "Nomor handphone hanya boleh mengandung angka",
      }));
      return;
    }

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setInputError((prev) => ({
      ...prev,
      [name]: "",
    }));
    setGlobalError(null);
    setIsError(false); // Hide error when input is valid
  };

  // Validate form inputs before submitting
  const validateInputs = () => {
    const errors: { [key: string]: string } = {};

    if (!data.user?.trim()) errors.user = "No Telepon tidak boleh kosong";
    if (!data.password?.trim()) errors.password = "Password tidak boleh kosong";

    setInputError(errors);
    if (Object.keys(errors).length === 0) {
      setGlobalError(null); // Clear global error when inputs are valid
    }

    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateInputs()) return;
    setData({ ...data, loading: true });

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}dashboard/login`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.responseCode === "2002500") {
        localStorage.setItem("member", response.data.loginData.memberID);
        localStorage.setItem("token", response.data.loginData.token);
        router.replace("/home");
      } else if (response.data.responseCode === "4002501") {
        const responseVerify = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}dashboard/Verify?userAccount=${data.user}`
        );

        if (responseVerify.data.responseCode === "2002500") {
          sessionStorage.setItem("phone", data.user);
          router.replace(`/otp-validasi-login`);
        }
      } else if (response.data.responseCode === "4002503") {
        setGlobalError(
          "Akun anda terkunci, Silakan akses fitur 'Lupa Password'"
        );
      } else {
        setGlobalError("No Telepon atau Password Salah");
      }
    } catch (error) {
      console.error(error);
      setGlobalError("Terjadi kesalahan, coba lagi nanti.");
    } finally {
      setData({ user: "", password: "", loading: false });
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <LogoHeader className="m-14" />

        <div className="flex flex-col w-full px-8">
          {globalError && <ErrorMessage message={globalError} />}

          <form onSubmit={handleSubmit}>
            <Input
              type="tel"
              label="No. Handphone"
              name="user"
              value={data.user}
              onChange={handleChange}
              error={inputError.user}
              className="mb-4"
            />

            <div className="mb-2 relative">
              <Input
                type={showPass ? "text" : "password"}
                label="Password"
                name="password"
                value={data.password}
                onChange={handleChange}
                error={inputError.password}
                className="mb-4"
              />

              <span
                className="absolute inset-y-0 right-0 pr-3 pt-6 flex items-center text-gray-500"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? (
                  <p className="fontMon text-[8px] cursor-pointer uppercase">
                    Hide
                  </p>
                ) : (
                  <p className="fontMon text-[8px] cursor-pointer uppercase">
                    Show
                  </p>
                )}
              </span>
            </div>

            <p className="text-xs mt-8 mb-14 fontGeo">
              Lupa password?{" "}
              <Link
                href="/forgot-password"
                className="underline underline-offset-4"
              >
                Klik disini
              </Link>
            </p>

            <div className="flex justify-center">
              <Button
                label="MASUK AKUN"
                className="bg-base-accent text-white"
                loading={data.loading}
                disabled={data.loading}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
