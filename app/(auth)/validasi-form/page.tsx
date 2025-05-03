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
  const [prov, setProv] = useState<string>("");
  const [city, setCity] = useState<string>("");
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
  const [formError, setFormError] = useState<{ [key: string]: string }>({});
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

  // Untuk mengosongkan PIN karna tertarik dari user data
  useEffect(() => {
    if (userData) {
      // Menarik data userData ke dalam formData, namun tidak untuk pin
      setFormData({
        ...userData.memberData,
        pin: "", // Mengosongkan field pin
      });
      setProv(userData.memberData.provinceID);
      setCity(userData.memberData.cityID);
    }
  }, [userData]);

  const handleChange = (
    event: FormEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = event.currentTarget;
    const { name, value } = target;

    setFormError((prev) => ({ ...prev, [name]: "" })); // Clear previous error

    if (name === "fullName" && !/^[a-zA-Z\s]*$/.test(value)) {
      setFormError((prev) => ({
        ...prev,
        fullName: "Nama hanya boleh mengandung huruf.",
      }));
      return;
    }

    if (name === "phone" && !/^\d*$/.test(value)) {
      setFormError((prev) => ({
        ...prev,
        phone: "Nomor hanya boleh mengandung angka.",
      }));
      return;
    }

    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setFormError((prev) => ({
        ...prev,
        email: "Format email tidak valid.",
      }));
    }

    if (name === "pin") {
      if (!/^\d{0,6}$/.test(value)) {
        setFormError((prev) => ({
          ...prev,
          pin: "PIN hanya boleh mengandung angka",
        }));
        return;
      }
      if (value.length < 6) {
        setFormError((prev) => ({
          ...prev,
          pin: "PIN maksimal 6 karakter",
        }));
      }
    }

    if (name === "password") {
      if (/\s/.test(value)) {
        setFormError((prev) => ({
          ...prev,
          password: "Password tidak boleh mengandung spasi.",
        }));
        return;
      }
      if (value.length < 8) {
        setFormError((prev) => ({
          ...prev,
          password: "Password minimal 8 karakter.",
        }));
      }
    }

    // Validasi khusus untuk tanggal lahir
    if (name === "dateofBirth") {
      const selectedDate = new Date(value);
      const currentDate = new Date();

      let age = currentDate.getFullYear() - selectedDate.getFullYear();
      const monthDifference = currentDate.getMonth() - selectedDate.getMonth();
      const dayDifference = currentDate.getDate() - selectedDate.getDate();

      if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--;
      }

      if (selectedDate > currentDate) {
        setFormError((prev) => ({
          ...prev,
          dateofBirth:
            "Tanggal lahir tidak valid (tidak boleh melebihi hari ini).",
        }));
        return;
      } else if (age < 17) {
        setFormError((prev) => ({
          ...prev,
          dateofBirth: "Minimal umur 17 tahun untuk menjadi member.",
        }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    const data = {
      memberID: formData.memberID,
      fullName: formData.fullName,
      // phone: formData.phone,
      email: formData.email,
      password: formData.password,
      pin: formData.pin,
      province: formData.provinceID,
      city: formData.cityID,
      gender: formData.gender == "PRIA" ? "l" : "p",
      dateofBirth: formData.dateofBirth,
      minatKategori: "-",
    };

    // Pastikan tidak ada error pada formError
    const noError = Object.values(formError).every((err) => err === "");

    // Pastikan semua field formData yang diwajibkan tidak kosong
    const allFieldsFilled = Object.values(formData).every((value) =>
      value ? true : false
    );

    if (!noError || !allFieldsFilled) {
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}profile/validate`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.responseCode === "2002500") {
        setSuccessMessage(true);
        router.replace("/home");
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

  function toNormalCase(str: string) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
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
          <p className="text-xs mt-4 mb-8 fontMon leading-relaxed">
            Harap lengkapi data diri dan pastikan data yang dimasukkan benar.
          </p>

          <form action="" onSubmit={handleSubmit}>
            <Input
              label="*Nama Lengkap"
              type="text"
              name="fullName"
              value={toNormalCase(formData.fullName) || ""}
              onChange={handleChange}
              error={formError.fullName}
              required={true}
              className="mb-4"
            />
            <div className="mb-4 bg-white">
              <Input
                label="No. Handphone"
                type="tel"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                error={formError.phone}
                disabled={true}
              />
              {/* {!formError.phone && (
                <small className="text-[8px] text-zinc-500 fontMon">
                  contoh: 0812xxx
                </small>
              )} */}
            </div>
            <Input
              label="*Alamat Email"
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              error={formError.email}
              required={true}
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
              error={formError.province}
              required={true}
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
              error={formError.city}
              required={true}
              className="mb-4"
            />
            <Input
              label="*Tanggal Lahir"
              type="date"
              name="dateofBirth"
              value={formData.dateofBirth || ""}
              onChange={handleChange}
              error={formError.dateofBirth}
              required={true}
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
              error={formError.gender}
              required={true}
              className="mb-4"
            />

            <div className="relative">
              <Input
                label="*Password"
                type={showPass ? "text" : "password"}
                name="password"
                value={formData.password || ""}
                onChange={handleChange}
                required={true}
                error={formError.password}
              />

              <span
                className="absolute inset-y-0 top-5 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
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

            {formMessagePassword && (
              <p className="text-red-500 text-xs mb-4 italic">
                {formMessagePassword.password}
              </p>
            )}

            <div className="relative">
              <Input
                label="*PIN (6 digit angka)"
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                name="pin"
                value={formData.pin || ""}
                onChange={handleChange}
                required={true}
                error={formError.pin}
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

            <div className="flex justify-center pt-3">
              <Button
                label="SIMPAN"
                className="bg-base-accent text-white"
                loading={isLoading}
                disabled={isLoading}
                type="submit"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
