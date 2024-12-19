"use client";

import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import Input from "@/components/Input";
import Select from "@/components/Select";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";

type cityData = {
  city_id: number;
  city_name: string;
  prov_id: number;
};

type provincesData = {
  prov_id: number;
  prov_name: string;
};

type Option = {
  id: string | number;
  label: string;
};

export default function Register() {
  const router = useRouter();
  const [optionsProv, setOptionsProv] = useState<Option[]>([]);
  const [optionsCity, setOptionsCity] = useState<Option[]>([]);
  const [prov, setProv] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [formError, setFormError] = useState<{ [key: string]: string }>({});
  const [formMessagePassword, setFormMessagePassword] = useState<{
    [key: string]: string;
  }>({});
  const [formMessagePin, setFormMessagePin] = useState<{
    [key: string]: string;
  }>({});
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showPass, setShowPass] = useState(false);

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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update form data
    setFormData({
      ...formData,
      [name]: value,
    });

    // Hapus pesan error jika ada input
    if (formError[name]) {
      setFormError((prevErrors) => {
        const { [name]: _, ...remainingErrors } = prevErrors;
        return remainingErrors;
      });
    }

    // Hapus error global jika inputan diisi
    if (isError) setIsError(false);

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

    // Validasi PIN hanya jika field yang diubah adalah PIN
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

  const handleSelectChange = (
    event: ChangeEvent<HTMLSelectElement>,
    field: "province" | "city" | "gender"
  ) => {
    const value = event.target.value;
    if (field === "province") setProv(value);
    else if (field === "city") setCity(value);
    else setGender(value);

    setFormData({
      ...formData,
      [field]: value,
    });

    if (formError[field]) {
      setFormError((prevErrors) => {
        const { [field]: _, ...remainingErrors } = prevErrors;
        return remainingErrors;
      });
    }
  };

  useEffect(() => {
    const fetchDataProvince = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}provinces`
        );
        setOptionsProv(
          response.data.provincesData.map((item: provincesData) => ({
            id: item.prov_id,
            label: item.prov_name,
          }))
        );
      } catch (error) {
        console.log("Error fetching province data:", error);
      }
    };
    fetchDataProvince();
  }, []);

  useEffect(() => {
    if (prov) {
      const fetchDataCity = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}cities?provID=${prov}`
          );
          setOptionsCity(
            response.data.citiesData.map((item: cityData) => ({
              id: item.city_id,
              label: item.city_name,
            }))
          );
        } catch (error) {
          console.log("Error fetching city data:", error);
        }
      };
      fetchDataCity();
    } else {
      setOptionsCity([]);
    }
  }, [prov]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.phone) errors.phone = "No Handphone tidak boleh kosong";
    if (!formData.fullName) errors.fullName = "Nama Lengkap tidak boleh kosong";
    if (!formData.email) errors.email = "Alamat Email tidak boleh kosong";
    if (!formData.province) errors.province = "Provinsi tidak boleh kosong";
    if (!formData.city) errors.city = "Kota tidak boleh kosong";
    if (!formData.dateofBirth)
      errors.dateofBirth = "Tanggal Lahir tidak boleh kosong";
    if (!formData.gender) errors.gender = "Jenis Kelamin tidak boleh kosong";
    if (!formData.password) errors.password = "Password tidak boleh kosong";
    if (!formData.pin) errors.pin = "PIN tidak boleh kosong";
    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setFormData((prevData) => ({ ...prevData, loading: true, error: "" }));

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}dashboard/register`,
        {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          pin: formData.pin,
          password: formData.password,
          province: formData.province,
          city: formData.city,
          gender: formData.gender === "PRIA" ? "l" : "p",
          dateofBirth: formData.dateofBirth,
          minatKategori: "-",
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.responseCode === "2002500") {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}dashboard/Verify?userAccount=${formData.phone}`
        );

        if (response.data.responseCode === "2002500") {
          sessionStorage.setItem("phone", formData.phone);
          router.push(`/otp-register`);
        }
      } else {
        setIsError(true);
        // setTimeout(() => setIsError(false), 3000);
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
      setFormData((prevData) => ({ ...prevData, loading: false }));
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <div className="flex flex-col m-8">
          <h1 className="text-xl">Daftar Member</h1>
          <p className="text-sm my-6">
            Daftar akun untuk mendapatkan info terbaru tentang promo, koleksi
            dan keuntungan member lainnya.
          </p>
          <form onSubmit={handleSubmit}>
            <Input
              label="*Nama Lengkap"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              error={formError.fullName}
              className="mb-4"
            />
            <Input
              label="*No Telepon (WhatsApp)"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              error={formError.phone}
              className="mb-4"
            />
            <Input
              label="*Alamat Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={formError.email}
              className="mb-4"
            />
            <Select
              labelSelect="*Provinsi"
              labelOption="Pilih Provinsi"
              options={optionsProv}
              value={prov}
              onChange={(e) => handleSelectChange(e, "province")}
              error={formError.province}
              className="mb-4"
            />
            <Select
              labelSelect="*Kota"
              labelOption="Pilih Kota"
              options={optionsCity}
              value={city}
              onChange={(e) => handleSelectChange(e, "city")}
              error={formError.city}
              className="mb-4"
            />
            <Input
              label="*Tanggal Lahir"
              type="date"
              name="dateofBirth"
              value={formData.dateofBirth}
              onChange={handleInputChange}
              error={formError.dateofBirth}
              className="mb-4"
            />
            <Select
              labelSelect="*Jenis Kelamin"
              labelOption="Pilih Jenis Kelamin"
              options={[
                { id: "PRIA", label: "Laki-laki" },
                { id: "WANITA", label: "Perempuan" },
              ]}
              value={gender}
              onChange={(e) => handleSelectChange(e, "gender")}
              error={formError.gender}
              className="mb-4"
            />

            <div className="relative">
              <Input
                label="*Password"
                type={showPass ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                error={formError.password}
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

            {formMessagePassword && (
              <p className="text-red-500 text-[10px] mb-4 fontMon">
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
                value={formData.pin}
                onChange={handleInputChange}
                error={formError.pin}
              />

              <span
                className="absolute inset-y-0 right-0 pr-3 pt-6 flex items-center text-gray-500"
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
              <p className="text-red-500 text-[10px] mb-4 fontMon">
                {formMessagePin.pin}
              </p>
            )}

            <div className="flex items-center my-8">
              <input
                type="checkbox"
                name="allow"
                className="peer h-4 w-4 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800 checked:text-white"
                required
              />
              <span className="text-xs ms-2 fontGeo">
                Saya menyetujui{" "}
                <span className="font-medium">Syarat dan ketentuan</span> yang
                berlaku.
              </span>
            </div>

            <div className="mb-4">
              {isError && (
                <ErrorMessage message={"No Telepon/Email sudah terdaftar"} />
              )}
            </div>

            <div className="flex justify-center">
              <Button
                label="DAFTAR"
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
    </div>
  );
}
