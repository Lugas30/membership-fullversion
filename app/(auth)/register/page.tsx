"use client";

// Register yang telah dioptimize menggunakan React hook form dan struktur dirapihkan dan fixing deadlock error untuk next submit

import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import Input from "@/components/Input";
import Select from "@/components/Select";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";

type CityData = {
  city_id: number;
  city_name: string;
  prov_id: number;
};

type ProvinceData = {
  prov_id: number;
  prov_name: string;
};

type Option = {
  id: string | number;
  label: string;
};

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    phone: "",
    fullName: "",
    email: "",
    province: "",
    city: "",
    dateofBirth: "",
    gender: "",
    password: "",
    pin: "",
    minatKategori: "-",
  });

  const [optionsProv, setOptionsProv] = useState<Option[]>([]);
  const [optionsCity, setOptionsCity] = useState<Option[]>([]);
  const [formError, setFormError] = useState<{ [key: string]: string }>({});
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let errors: { [key: string]: string } = { ...formError };

    // Validasi per field
    if (name === "fullName" && !/^[a-zA-Z\s]*$/.test(value)) {
      errors.fullName = "Nama lengkap hanya boleh mengandung huruf.";
    } else if (
      name === "phone" &&
      (!/^\d*$/.test(value) || (value && !/^0\d*$/.test(value)))
    ) {
      errors.phone = "Nomor HP hanya angka dan harus diawali 0.";
    } else if (name === "email" && !/^[a-zA-Z0-9@.\-_]+$/.test(value)) {
      errors.email = "Format email tidak valid.";
    } else if (name === "pin" && !/^\d{0,6}$/.test(value)) {
      errors.pin = "PIN hanya angka maksimal 6 digit.";
    } else if (name === "password" && (/\s/.test(value) || value.length < 8)) {
      errors.password = "Password minimal 8 karakter dan tanpa spasi.";
    } else {
      delete errors[name]; // Hapus error jika valid
    }

    setFormError(errors);
    setFormData({ ...formData, [name]: value });
    if (fieldError) setFieldError(null);
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const selectedDate = new Date(value);
    const now = new Date();

    const age = now.getFullYear() - selectedDate.getFullYear();
    if (selectedDate > now) {
      setFormError((prev) => ({
        ...prev,
        dateofBirth: "Tanggal lahir tidak boleh di masa depan.",
      }));
    } else if (age < 17) {
      setFormError((prev) => ({
        ...prev,
        dateofBirth: "Minimal umur 17 tahun.",
      }));
    } else {
      const updatedErrors = { ...formError };
      delete updatedErrors.dateofBirth;
      setFormError(updatedErrors);
      setFormData({ ...formData, dateofBirth: value });
    }
  };

  const handleSelectChange = (
    e: ChangeEvent<HTMLSelectElement>,
    field: "province" | "city" | "gender"
  ) => {
    const value = e.target.value;
    setFormData({ ...formData, [field]: value });

    const updatedErrors = { ...formError };
    delete updatedErrors[field];
    setFormError(updatedErrors);
    if (field === "province") setOptionsCity([]);
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.fullName) errors.fullName = "Nama lengkap wajib diisi.";
    if (!formData.phone) errors.phone = "Nomor HP wajib diisi.";
    if (!formData.email) errors.email = "Email wajib diisi.";
    if (!formData.province) errors.province = "Provinsi wajib dipilih.";
    if (!formData.city) errors.city = "Kota wajib dipilih.";
    if (!formData.dateofBirth)
      errors.dateofBirth = "Tanggal lahir wajib diisi.";
    if (!formData.gender) errors.gender = "Jenis kelamin wajib dipilih.";
    if (!formData.password) errors.password = "Password wajib diisi.";
    if (!formData.pin) errors.pin = "PIN wajib diisi.";

    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchProvinces = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}provinces`
      );
      setOptionsProv(
        res.data.provincesData.map((prov: ProvinceData) => ({
          id: prov.prov_id,
          label: prov.prov_name,
        }))
      );
    } catch (error) {
      console.error("Error fetch provinces:", error);
    }
  };

  const fetchCities = async (provID: string) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}cities?provID=${provID}`
      );
      setOptionsCity(
        res.data.citiesData.map((city: CityData) => ({
          id: city.city_id,
          label: city.city_name,
        }))
      );
    } catch (error) {
      console.error("Error fetch cities:", error);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (formData.province) {
      fetchCities(formData.province);
    }
  }, [formData.province]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}dashboard/register`,
        {
          ...formData,
          gender: formData.gender === "PRIA" ? "l" : "p",
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.responseCode === "2002500") {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}dashboard/Verify?userAccount=${formData.phone}`
        );
        sessionStorage.setItem("phone", formData.phone);
        router.replace("/otp-register");
      } else {
        setFieldError("Nomor telepon atau email sudah digunakan.");
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      setFieldError("Terjadi kesalahan saat mendaftar. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h1 className="text-xl mb-6">Daftar Member</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="*Nama Lengkap"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            error={formError.fullName}
          />
          <Input
            label="*No. Handphone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            error={formError.phone}
          />
          <Input
            label="*Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={formError.email}
          />

          <Select
            labelSelect="*Provinsi"
            labelOption="Pilih Provinsi"
            options={optionsProv}
            value={formData.province}
            onChange={(e) => handleSelectChange(e, "province")}
            error={formError.province}
          />
          <Select
            labelSelect="*Kota"
            labelOption="Pilih Kota"
            options={optionsCity}
            value={formData.city}
            onChange={(e) => handleSelectChange(e, "city")}
            error={formError.city}
          />

          <Input
            label="*Tanggal Lahir"
            name="dateofBirth"
            type="date"
            value={formData.dateofBirth}
            onChange={handleDateChange}
            error={formError.dateofBirth}
          />

          <Select
            labelSelect="*Jenis Kelamin"
            labelOption="Pilih Jenis Kelamin"
            options={[
              { id: "PRIA", label: "Laki-laki" },
              { id: "WANITA", label: "Perempuan" },
            ]}
            value={formData.gender}
            onChange={(e) => handleSelectChange(e, "gender")}
            error={formError.gender}
          />

          <div className="relative">
            <Input
              label="*Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              error={formError.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[8px] fontMon text-zinc-500 absolute top-11 right-0 mr-2"
            >
              {" "}
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>

          <div className="relative">
            <Input
              label="*PIN (6 Digit)"
              name="pin"
              type={showPin ? "text" : "password"}
              value={formData.pin}
              onChange={handleInputChange}
              error={formError.pin}
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="text-[8px] fontMon text-zinc-500 absolute top-11 right-0 mr-2"
            >
              {" "}
              {showPin ? "HIDE" : "SHOW"}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <input type="checkbox" required className="accent-indigo-950" />
            <span className="text-[10px] fontMon">
              Saya menyetujui{" "}
              <Link
                href="/term-condition"
                className="underline font-bold text-rose-800"
              >
                Syarat & Ketentuan
              </Link>
            </span>
          </div>

          {fieldError && <ErrorMessage message={fieldError} />}

          <div className="flex justify-center">
            <Button
              label="Daftar"
              className="bg-base-accent text-white"
              loading={loading}
            />
          </div>

          <p className="text-center text-xs mt-4">
            Sudah pernah daftar?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Masuk akun
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
