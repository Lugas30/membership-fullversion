"use client";

import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import Input from "@/components/Input";
import Select from "@/components/Select";
import SuccessMessage from "@/components/SuccessMessage";
import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getUserData } from "@/redux/thunks/userDataThunk";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FadeLoader } from "react-spinners";

type MemberInfo = {
  memberID: string;
  fullName: string;
  phone: string;
  email: string;
  password: string;
  pin: string;
  province: string;
  provinceID: string;
  city: string;
  cityID: string;
  gender: string;
  dateofBirth: string;
};

type provincesData = {
  prov_id: number;
  prov_name: string;
};

type citiesData = {
  city_id: number;
  city_name: string;
  prov_id: number;
};

type Option = { id: string | number; label: string };

export default function Validasi() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [optionsProv, setOptionsProv] = useState<Option[]>([]);
  const [optionsCity, setOptionsCity] = useState<Option[]>([]);
  const [prov, setProv] = useState("");
  const [city, setCity] = useState("");
  const [successMessage, setSuccessMessage] = useState<boolean | false>(false);
  const [errorMessage, setErrorMessage] = useState<boolean | false>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [formMessagePassword, setFormMessagePassword] = useState<{
    [key: string]: string;
  }>({});
  const [formMessagePin, setFormMessagePin] = useState<{
    [key: string]: string;
  }>({});

  const [formData, setFormData] = useState<MemberInfo>({
    memberID: "",
    fullName: "",
    phone: "",
    email: "",
    password: "",
    pin: "",
    province: "",
    provinceID: "",
    city: "",
    cityID: "",
    gender: "",
    dateofBirth: "",
  });

  const { error, userData } = useSelector((state: RootState) => state.userData);

  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);

  useEffect(() => {
    if (userData) {
      setFormData(userData.memberData);
      setProv(userData.memberData.provinceID);
      setCity(userData.memberData.cityID);
    }
  }, [userData]);

  useEffect(() => {
    const fetchDataProvince = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}provinces`
      );
      setOptionsProv(
        response.data.provincesData.map((item: provincesData) => ({
          id: item.prov_id,
          label: item.prov_name,
        }))
      );
    };
    fetchDataProvince();
  }, []);

  useEffect(() => {
    if (prov) {
      const fetchDataCity = async () => {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}cities?provID=${prov}`
        );
        setOptionsCity(
          response.data.citiesData.map((item: citiesData) => ({
            id: item.city_id,
            label: item.city_name,
          }))
        );
      };
      fetchDataCity();
    } else {
      setOptionsCity([]);
    }
  }, [prov]);

  const handleChange = (
    event: FormEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = event.currentTarget as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "password") {
      if (value.length < 8) {
        setFormMessagePassword({
          password: "Password minimal 8 karakter",
        });
      } else {
        setFormMessagePassword({});
      }
    }

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
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    const data = {
      memberID: formData.memberID,
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
      pin: formData.pin,
      province: formData.provinceID,
      city: formData.cityID,
      gender: formData.gender == "PRIA" ? "l" : "p",
      dateofBirth: formData.dateofBirth,
      minatKategori: "-",
    };

    try {
      const response = await axios.put(
        `https://golangapi-j5iu.onrender.com/api/v1.0/member/mobile/profile`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.responseCode === "2002500") {
        setSuccessMessage(true);
        setTimeout(() => router.push("/home"), 2000);
      } else if (response.data.responseCode === "4002500") {
        setErrorMessage(true);
        setTimeout(() => setErrorMessage(false), 2000);
      } else {
        console.error("Terjadi kesalahan pada server");
      }
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (userData == null) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-screen">
        <Image src="/images/logo.svg" width={150} height={150} alt="logo" />
        <FadeLoader color="#101E2B" width={5} />
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <div className="flex flex-col p-8 w-full">
          {successMessage && (
            <SuccessMessage message="Data berhasil divalidasi" />
          )}
          {errorMessage && <ErrorMessage message="Data gagal divalidasi" />}

          <h1 className="text-lg font-medium">Validasi Data</h1>
          <p className="text-xs mt-4 mb-8">
            Harap lengkapi data diri anda, pastikan data yang dimasukkan benar.
          </p>

          <form action="" onSubmit={handleSubmit}>
            <Input
              label="*Nama Lengkap"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="mb-4"
            />
            <Input
              label="*No Handphone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mb-4"
            />
            <Input
              label="*Alamat Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mb-4"
            />
            <Select
              labelSelect="*Provinsi"
              labelOption="Pilih Provinsi"
              options={optionsProv}
              value={prov}
              onChange={(e) => {
                const selectedProv = e.target.value;
                setProv(selectedProv); // Memperbarui state provinsi
                setCity(""); // Mengosongkan kota sebelumnya
                setFormData((prev) => ({
                  ...prev,
                  province: selectedProv, // Menyimpan provinsi di formData
                  city: "", // Mengosongkan kota saat provinsi diubah
                }));
              }}
              className="mb-4"
            />
            <Select
              labelSelect="*Kota"
              labelOption="Pilih Kota"
              options={optionsCity}
              value={city}
              onChange={(e) => {
                const selectedCity = e.target.value;
                setCity(selectedCity); // Memperbarui state kota
                setFormData((prev) => ({
                  ...prev,
                  city: selectedCity, // Menyimpan kota di formData
                }));
              }}
              className="mb-4"
            />
            <Input
              label="*Tanggal Lahir"
              type="date"
              name="dateofBirth"
              value={formData.dateofBirth}
              onChange={handleChange}
              className="mb-4"
            />
            <Select
              labelSelect="*Jenis Kelamin"
              labelOption="Pilih Jenis Kelamin"
              options={[
                { id: "PRIA", label: "Laki-laki" },
                { id: "WANITA", label: "Perempuan" },
              ]}
              value={formData.gender}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  gender: e.target.value,
                }))
              }
              className="mb-4"
            />

            <div className="relative">
              <Input
                label="*Password"
                type={showPass ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
              />

              <span
                className="absolute inset-y-0 top-5 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? (
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

            <div className="relative">
              <Input
                label="*PIN"
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                name="pin"
                value={formData.pin}
                onChange={handleChange}
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

            <Button
              label="SIMPAN"
              className="bg-base-accent text-white rounded-full w-full p-2 my-6"
              loading={isLoading}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
