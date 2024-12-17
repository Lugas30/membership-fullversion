"use client";

import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import Input from "@/components/Input";
import SuccessMessage from "@/components/SuccessMessage";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

// interface for password
interface Password {
  memberID: string;
  currentPassword: string;
  password: string;
  confirmPassword: string;
  loading: boolean;
  error: string[];
}

// interface for pin
interface Pin {
  memberID: string;
  pin: string;
  confirmPin: string;
  loading: boolean;
  error: string[];
}

export default function Profile() {
  const [errorMessagePassword, setErrorMessagePassword] =
    useState<boolean>(false);
  const [successMessagePassword, setSuccessMessagePassword] =
    useState<boolean>(false);
  const [formMessagePassword, setFormMessagePassword] = useState<{
    [key: string]: string;
  }>({});
  const [formMessagePin, setFormMessagePin] = useState<{
    [key: string]: string;
  }>({});
  const [errorMessagePin, setErrorMessagePin] = useState<boolean>(false);
  const [successMessagePin, setSuccessMessagePin] = useState<boolean>(false);
  const [showPassOld, setShowPassOld] = useState<boolean>(false);
  const [showPassNew, setShowPassNew] = useState<boolean>(false);
  const [showPassNewConf, setShowPassNewConf] = useState<boolean>(false);
  const [showPin, setShowPin] = useState<boolean>(false);
  const [showPinConf, setShowPinConf] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const member = localStorage.getItem("member");

      setPassword((prevPassword) => ({
        ...prevPassword,
        memberID: member || "",
      }));

      setPin((prevPin) => ({
        ...prevPin,
        memberID: member || "",
      }));
    }
  }, []);

  // state for password
  const [password, setPassword] = useState<Password>({
    memberID: "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
    loading: false,
    error: [],
  });

  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  const [pinMatch, setPinMatch] = useState<boolean | null>(null);

  // state for pin
  const [pin, setPin] = useState<Pin>({
    memberID: "",
    pin: "",
    confirmPin: "",
    loading: false,
    error: [],
  });

  // change state
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Check if the input is related to password
    setPassword((prevPassword) => {
      const updatedPassword = { ...prevPassword, [name]: value };
      setPassword((prevPassword) => ({
        ...prevPassword,
        [name]: value,
        error: [],
      }));

      // Validasi password hanya jika field yang diubah adalah password
      if (name === "password") {
        if (value.length < 8) {
          setFormMessagePassword({
            password: "Password minimal 8 karakter",
          });
        } else {
          setFormMessagePassword({});
        }
      }

      // Check if password and confirmPassword match
      if (name === "password" || name === "confirmPassword") {
        setPasswordMatch(
          updatedPassword.password === updatedPassword.confirmPassword
        );
      }

      return updatedPassword;
    });

    // Check if the input is related to pin
    setPin((prevPin) => {
      const updatedPin = { ...prevPin, [name]: value };
      setPin((prevPin) => ({
        ...prevPin,
        [name]: value,
        error: [],
      }));

      // Validasi password hanya jika field yang diubah adalah password
      if (name === "pin") {
        if (value.length < 6) {
          setFormMessagePin({
            pin: "PIN minimal 8 karakter",
          });
        } else if (value.length > 6) {
          setFormMessagePin({
            pin: "PIN maksimal 6 karakter",
          });
        } else {
          setFormMessagePin({});
        }
      }

      // Check if pin and confirmPin match
      if (name === "pin" || name === "confirmPin") {
        setPinMatch(updatedPin.pin === updatedPin.confirmPin);
      }

      return updatedPin;
    });
  };

  // submit password
  const handleSubmitPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // set loading
    setPassword((prevPassword) => ({ ...prevPassword, loading: true }));

    const errors: string[] = [];
    if (!password.currentPassword) errors.push("Password lama harus diisi");
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
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}profile/auth/2`,
        password,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // check response status
      if (response.data.responseCode === "2002500") {
        // show success message
        setSuccessMessagePassword(true);
        // remove message after 3 seconds
        setTimeout(() => setSuccessMessagePassword(false), 3000);
      } else if (response.data.responseCode === "4002500") {
        // show error message
        setErrorMessagePassword(true);
        // remove message after 3 seconds
        setTimeout(() => setErrorMessagePassword(false), 3000);
      } else {
        console.error("Terjadi kesalahan pada server");
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      // loading false
      setPassword((prevPassword) => ({ ...prevPassword, loading: false }));
      // clear password fields
      setPassword((prevPassword) => ({
        ...prevPassword,
        currentPassword: "",
        password: "",
        confirmPassword: "",
        loading: false,
      }));
    }
  };

  // submit pin
  const handleSubmitPin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // set loading
    setPin((prevPin) => ({ ...prevPin, loading: true }));

    // validasi
    const errors: string[] = [];
    if (!pin.pin) errors.push("PIN harus diisi");
    if (!pin.confirmPin) errors.push("PIN konfirmasi harus diisi");

    if (errors.length > 0) {
      setPin((prevPin) => ({
        ...prevPin,
        loading: false,
        error: errors,
      }));
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}profile/auth/1`,
        pin,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // check response status
      if (response.data.responseCode === "2002500") {
        // show success message
        setSuccessMessagePin(true);
        // remove message after 3 seconds
        setTimeout(() => setSuccessMessagePin(false), 3000);
      } else if (response.data.responseCode === "4002500") {
        // show error message
        setErrorMessagePin(true);
        // remove message after 3 seconds
        setTimeout(() => setErrorMessagePin(false), 3000);
      } else {
        console.error("Terjadi kesalahan pada server");
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      // loading false
      setPin((prevPin) => ({ ...prevPin, loading: false }));
      // clear pin fields
      setPin((prevPin) => ({
        ...prevPin,
        pin: "",
        confirmPin: "",
        loading: false,
      }));
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <div className="flex flex-col m-8 w-full">
          <div className="flex flex-col px-8">
            <div className="flex items-center">
              <Image
                src="/images/arrow-left.svg"
                width={30}
                height={30}
                alt="arrow-left"
                className="w-auto h-auto cursor-pointer"
                onClick={() => window.history.back()}
              />
              <div className="flex-grow flex justify-center">
                <span className="font-medium">Pengaturan Password & PIN</span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs my-4">
                Digunakan untuk masuk akun member AMSCORP
              </p>
              <form onSubmit={handleSubmitPassword}>
                <div className="mb-2 relative">
                  <Input
                    label="Password Terkini"
                    type={showPassOld ? "text" : "password"}
                    name="currentPassword"
                    value={password.currentPassword}
                    onChange={handleChange}
                    className="mb-4"
                    error={password.error[0]}
                  />

                  <span
                    className="absolute inset-y-0 top-5 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
                    onClick={() => setShowPassOld(!showPassOld)}
                  >
                    {showPassOld ? (
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

                <div className="relative">
                  <Input
                    label="Password Baru"
                    type={showPassNew ? "text" : "password"}
                    name="password"
                    value={password.password}
                    onChange={handleChange}
                    error={password.error[1]}
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

                {formMessagePassword && (
                  <p className="text-red-500 text-xs mb-4 italic">
                    {formMessagePassword.password}
                  </p>
                )}

                <div className="mb-2 relative">
                  <Input
                    label="Konfirmasi Password Baru"
                    type={showPassNewConf ? "text" : "password"}
                    name="confirmPassword"
                    value={password.confirmPassword}
                    onChange={handleChange}
                    error={password.error[2]}
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
                />
              </form>

              {errorMessagePassword && (
                <ErrorMessage message={"Password Salah"} />
              )}
              {successMessagePassword && (
                <SuccessMessage message={"Password Berhasil Diubah"} />
              )}
            </div>
            <hr className="my-2 h-0.5 border-t-0 bg-neutral-200" />
            <div className="">
              <p className="text-xs my-4">
                Digunakan untuk redeem saat transaksi
              </p>
              <form onSubmit={handleSubmitPin}>
                <div className="relative">
                  <Input
                    label="*PIN"
                    type={showPin ? "text" : "password"}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    name="pin"
                    value={pin.pin}
                    onChange={handleChange}
                    error={pin.error[0]}
                  />

                  <span
                    className="absolute inset-y-0 top-5 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
                    onClick={() => setShowPin(!showPin)}
                  >
                    {showPin ? (
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

                {formMessagePin && (
                  <p className="text-red-500 text-xs mb-4 italic">
                    {formMessagePin.pin}
                  </p>
                )}

                <div className="mb-2 relative">
                  <Input
                    label="*Konfirmasi PIN Baru"
                    type={showPinConf ? "text" : "password"}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    name="confirmPin"
                    value={pin.confirmPin}
                    onChange={handleChange}
                    className="mb-4"
                    error={pin.error[0]}
                  />

                  <span
                    className="absolute inset-y-0 top-5 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
                    onClick={() => setShowPinConf(!showPinConf)}
                  >
                    {showPinConf ? (
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

                {pinMatch === false && (
                  <p className="text-red-500 text-xs mt-1">PIN tidak cocok.</p>
                )}
                {pinMatch && pin.pin && (
                  <p className="text-green-500 text-xs mt-1">PIN cocok.</p>
                )}

                <Button
                  label="SIMPAN PIN"
                  className="bg-base-accent text-white rounded-full w-full p-2 my-6"
                  loading={pin.loading}
                />
              </form>

              {errorMessagePin && <ErrorMessage message={"PIN Salah"} />}
              {successMessagePin && (
                <SuccessMessage message={"PIN Berhasil Diubah"} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
