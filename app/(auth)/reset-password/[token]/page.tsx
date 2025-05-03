"use client";

import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import Input from "@/components/Input";
import SuccessMessage from "@/components/SuccessMessage";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Password {
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  loading: boolean;
  error: string[];
}

export default function ResetPassword() {
  const router = useRouter();
  const params = useParams();

  const token = params.token;

  const [showPassNew, setShowPassNew] = useState<boolean>(false);
  const [showPassNewConf, setShowPassNewConf] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const phone = sessionStorage.getItem("phone");

      setPassword((prevPassword) => ({
        ...prevPassword,
        phoneNumber: phone || "",
      }));
    }
  }, []);

  const [errorMessagePassword, setErrorMessagePassword] =
    useState<boolean>(false);
  const [successMessagePassword, setSuccessMessagePassword] =
    useState<boolean>(false);

  const [password, setPassword] = useState<Password>({
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    loading: false,
    error: [],
  });

  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setPassword((prevPassword) => ({
      ...prevPassword,
      error: [],
    }));

    setPassword((prevPassword) => {
      const updatedPassword = { ...prevPassword, [name]: value };

      if (name === "password" || name === "confirmPassword") {
        setPasswordMatch(
          updatedPassword.password === updatedPassword.confirmPassword
        );
      }

      return updatedPassword;
    });
  };

  const handleSubmitPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPassword((prevPassword) => ({ ...prevPassword, loading: true }));

    const errors: string[] = [];
    if (!password.password) errors.push("Password baru harus diisi");
    if (!password.confirmPassword)
      errors.push("Konfirmasi password baru harus diisi");

    if (errors.length > 0) {
      setPassword((prevPassword) => ({
        ...prevPassword,
        loading: false,
        error: errors,
      }));
      return;
    }

    try {
      const response = await axios.post(
        `https://golangapi-j5iu.onrender.com/send-wa-otp-forgot-password-verify?userAccount=${password.phoneNumber}&token=${token}&password=${password.password}`
      );

      if (response.data.responseCode === "2002500") {
        setSuccessMessagePassword(true);
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      } else if (response.data.responseCode === "4002500") {
        setErrorMessagePassword(true);
        setTimeout(() => setErrorMessagePassword(false), 3000);
      } else {
        console.error("Terjadi kesalahan pada server");
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setPassword((prevPassword) => ({ ...prevPassword, loading: false }));
      setPassword((prevPassword) => ({
        ...prevPassword,
        password: "",
        confirmPassword: "",
        loading: false,
      }));
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <div className="w-full p-8">
          <h1 className="text-lg font-medium">Atur ulang password</h1>
          {successMessagePassword && (
            <SuccessMessage message="Password berhasil diatur ulang" />
          )}
          {errorMessagePassword && (
            <ErrorMessage message="Password gagal diatur ulang" />
          )}
          <div className="mt-6">
            <form onSubmit={handleSubmitPassword}>
              {/* <Input
                label="Password Baru"
                type="password"
                name="password"
                value={password.password}
                onChange={handleChange}
                className="mb-4"
                error={password.error[0]}
              />
              <Input
                label="Konfirmasi Password Baru"
                type="password"
                name="confirmPassword"
                value={password.confirmPassword}
                onChange={handleChange}
                error={password.error[1]}
              /> */}

              <div className="mb-2 relative">
                <Input
                  label="Password Baru"
                  type={showPassNew ? "text" : "password"}
                  name="password"
                  value={password.password}
                  onChange={handleChange}
                  className="mb-4"
                  error={password.error[0]}
                />

                <span
                  className="absolute inset-y-0 top-5 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
                  onClick={() => setShowPassNew(!showPassNew)}
                >
                  {showPassNew ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  )}
                </span>
              </div>

              <div className="mb-2 relative">
                <Input
                  label="Konfirmasi Password Baru"
                  type={showPassNewConf ? "text" : "password"}
                  name="confirmPassword"
                  value={password.confirmPassword}
                  onChange={handleChange}
                  className="mb-4"
                  error={password.error[1]}
                />

                <span
                  className="absolute inset-y-0 top-5 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
                  onClick={() => setShowPassNewConf(!showPassNewConf)}
                >
                  {showPassNewConf ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  )}
                </span>
              </div>

              {passwordMatch === false && (
                <p className="text-red-500 text-xs mt-1">
                  Password tidak cocok.
                </p>
              )}
              {passwordMatch && password.password && (
                <p className="text-green-500 text-xs mt-1">Password cocok.</p>
              )}

              <Button
                label="SIMPAN PASSWORD"
                className="bg-base-accent text-white rounded-full w-full p-2 my-6"
                loading={password.loading}
                disabled={password.loading}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
