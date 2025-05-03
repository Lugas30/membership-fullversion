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

  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [pinError, setPinError] = useState<boolean>(false);

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

    // Validasi khusus untuk PIN (hanya angka dan maksimal 6 karakter)
    if (name === "pin") {
      if (!/^\d{0,6}$/.test(value)) {
        setFormMessagePin((prev) => ({
          ...prev,
          pin: "PIN hanya boleh mengandung angka dan maksimal 6 karakter",
        }));
        return;
      }
    }

    // Validasi password untuk melarang spasi
    // if (name === "password") {
    //   if (/\s/.test(value)) {
    //     setFormError((prev) => ({
    //       ...prev,
    //       password: "Password tidak boleh mengandung spasi",
    //     }));
    //     return;
    //   }

    // Check if the input is related to password
    setPassword((prevPassword) => {
      const updatedPassword = { ...prevPassword, [name]: value };
      setPassword((prevPassword) => ({
        ...prevPassword,
        [name]: value,
        error: [],
      }));

      setErrorMessagePassword(false);
      setPasswordError(false);

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

      setErrorMessagePin(false);
      setPinError(false);

      // Validasi password hanya jika field yang diubah adalah password
      if (name === "pin") {
        if (value.length < 6) {
          setFormMessagePin({
            pin: "PIN minimal 6 karakter",
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

    if (password.password.length < 8) {
      setPasswordError(true);
      setPassword((prevPassword) => ({
        ...prevPassword,
        loading: false,
      }));
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}profile/auth/2`,
        {
          memberID: password.memberID,
          password: password.password,
          currentPassword: password.currentPassword,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // check response status
      if (response.data.responseCode === "2002500") {
        // show success message
        setSuccessMessagePassword(true);
        // clear notif
        setTimeout(() => {
          setSuccessMessagePassword(false);
        }, 2000);
      } else if (response.data.responseCode === "4002500") {
        // show error message
        setErrorMessagePassword(true);
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

    if (pin.pin.length < 6) {
      setPinError(true);
      setPin((prevPin) => ({ ...prevPin, loading: false }));
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}profile/auth/1`,
        pin,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // check response status
      if (response.data.responseCode === "2002500") {
        // show success message
        setSuccessMessagePin(true);
        // clear notif
        setTimeout(() => {
          setSuccessMessagePin(false);
        }, 2000);
      } else if (response.data.responseCode === "4002500") {
        // show error message
        setErrorMessagePin(true);
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
                className="w-auto h-auto cursor-pointer absolute"
                onClick={() => window.history.back()}
              />
              <div className="flex-grow flex justify-center">
                <span className="font-medium">Pengaturan Password & PIN</span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[10px] my-4 fontMon">
                Digunakan untuk masuk akun member AMSCORP
              </p>
              <form onSubmit={handleSubmitPassword}>
                <div className="mb-2 relative">
                  <Input
                    label="Password Lama"
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

                {passwordMatch === false && (
                  <p className="text-red-500 text-xs mt-1">
                    Password tidak cocok.
                  </p>
                )}
                {passwordMatch && password.password && (
                  <p className="text-green-500 text-xs mt-1">Password cocok.</p>
                )}

                <div className="flex justify-center my-5">
                  <Button
                    label="SIMPAN PASSWORD"
                    className="bg-base-accent text-white"
                    loading={password.loading}
                    disabled={password.loading}
                  />
                </div>
              </form>

              {errorMessagePassword && (
                <ErrorMessage message={"Password Terkini Tidak Sesuai"} />
              )}
              {successMessagePassword && (
                <SuccessMessage message={"Password Berhasil Diubah"} />
              )}
              {passwordError && (
                <ErrorMessage message={"Password Minimal 8 Karakter"} />
              )}
            </div>
            <hr className="my-2 border-gray-300" />
            <div className="">
              <p className="text-[10px] my-4 fontMon">
                Digunakan untuk redeem saat transaksi
              </p>
              <form onSubmit={handleSubmitPin}>
                <div className="relative">
                  <Input
                    label="*PIN Baru"
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

                {pinMatch === false && (
                  <p className="text-red-500 text-xs mt-1">PIN tidak cocok.</p>
                )}
                {pinMatch && pin.pin && (
                  <p className="text-green-500 text-xs mt-1">PIN cocok.</p>
                )}

                <div className="flex justify-center my-5">
                  <Button
                    label="SIMPAN PIN"
                    className="bg-base-accent text-white"
                    loading={pin.loading}
                    disabled={pin.loading}
                  />
                </div>
              </form>

              {errorMessagePin && <ErrorMessage message={"PIN Salah"} />}
              {successMessagePin && (
                <SuccessMessage message={"PIN Berhasil Diubah"} />
              )}
              {pinError && <ErrorMessage message={"PIN Harus 6 Digit Angka"} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
