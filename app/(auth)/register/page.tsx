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

    // Validasi untuk fullName
    if (name === "fullName") {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        setFormError((prev) => ({
          ...prev,
          fullName: "Nama lengkap hanya boleh mengandung huruf",
        }));
        return;
      }
    }

    // Validasi untuk phone
    // if (name === "phone") {
    //   if (!/^\d*$/.test(value)) {
    //     setFormError((prev) => ({
    //       ...prev,
    //       phone: "Nomor handphone hanya boleh mengandung angka",
    //     }));
    //     return;
    //   }
    // }

    // Validasi untuk phone
    if (name === "phone") {
      if (!/^\d*$/.test(value)) {
        setFormError((prev) => ({
          ...prev,
          phone: "Nomor handphone hanya boleh mengandung angka",
        }));
        return;
      }

      if (value && !/^0\d*$/.test(value)) {
        setFormError((prev) => ({
          ...prev,
          phone: "Nomor handphone harus diawali dengan angka 0",
        }));
        return;
      }
    }

    // Validasi untuk email dengan format khusus
    if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9@.-_/s]*$/;
      if (!emailRegex.test(value)) {
        setFormError((prev) => ({
          ...prev,
          email: "Format email tidak valid",
        }));
        return;
      }
    }

    // Validasi khusus untuk PIN (hanya angka dan maksimal 6 karakter)
    if (name === "pin") {
      if (!/^\d{0,6}$/.test(value)) {
        setFormError((prev) => ({
          ...prev,
          pin: "PIN hanya boleh mengandung angka",
        }));
        return;
      }
      // Validasi panjang password minimal 8 karakter
      if (value.length < 6) {
        setFormMessagePin({
          pin: "Password minimal 6 karakter",
        });
      } else {
        setFormMessagePin({});
      }
    }

    // Validasi password untuk melarang spasi
    if (name === "password") {
      if (/\s/.test(value)) {
        setFormError((prev) => ({
          ...prev,
          password: "Password tidak boleh mengandung spasi",
        }));
        return;
      }

      // Validasi panjang password minimal 8 karakter
      if (value.length < 8) {
        setFormMessagePassword({
          password: "Password minimal 8 karakter",
        });
      } else {
        setFormMessagePassword({});
      }
    }

    // Update form data
    setFormData({
      ...formData,
      [name]: value,
    });

    // Hapus error global jika inputan diisi
    if (isError) setIsError(false);
  };

  // Validasi untuk tanggal lahir minimal umur 17 tahun dan nonaktifkan tanggal yang melampaui tanggal saat ini
  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(event.target.value);
    const currentDate = new Date();

    // Hitung umur berdasarkan tahun, bulan, dan hari
    let age = currentDate.getFullYear() - selectedDate.getFullYear();
    const monthDifference = currentDate.getMonth() - selectedDate.getMonth();
    const dayDifference = currentDate.getDate() - selectedDate.getDate();

    // Jika bulan saat ini belum melewati bulan lahir atau
    // berada di bulan yang sama tetapi belum melewati hari lahir
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    // Validasi umur minimal 17 tahun dan pastikan tidak lebih dari tanggal hari ini
    if (selectedDate > currentDate) {
      setFormError((prevErrors) => ({
        ...prevErrors,
        dateofBirth:
          "Tanggal lahir tidak valid (tidak boleh melebihi hari ini).",
      }));
    } else if (age < 17) {
      setFormError((prevErrors) => ({
        ...prevErrors,
        dateofBirth: "Minimal umur 17 tahun untuk menjadi member.",
      }));
    } else {
      // Hapus pesan error jika valid
      setFormError((prevErrors) => {
        const { dateofBirth, ...remainingErrors } = prevErrors;
        return remainingErrors;
      });

      // Update formData
      setFormData((prevFormData) => ({
        ...prevFormData,
        dateofBirth: event.target.value,
      }));
    }
  }; // Validasi tanggal lahir dan umur

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
    if (!formData.phone) errors.phone = "No. Handphone tidak boleh kosong";
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

  // Handle Submit Lama
  // const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   if (!validateForm()) return;

  //   setLoading(true);
  //   setFormData((prevData) => ({ ...prevData, loading: true, error: "" }));

  //   // Pastikan tidak ada error pada formError
  //   const noError = Object.values(formError).every((err) => err === "");

  //   // Pastikan semua field formData yang diwajibkan tidak kosong
  //   const allFieldsFilled = Object.values(formData).every((value) =>
  //     value ? true : false
  //   );

  //   if (!noError || !allFieldsFilled) {
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const res = await axios.post(
  //       `${process.env.NEXT_PUBLIC_API_URL}dashboard/register`,
  //       {
  //         fullName: formData.fullName,
  //         phone: formData.phone,
  //         email: formData.email,
  //         pin: formData.pin,
  //         password: formData.password,
  //         province: formData.province,
  //         city: formData.city,
  //         gender: formData.gender === "PRIA" ? "l" : "p",
  //         dateofBirth: formData.dateofBirth,
  //         minatKategori: "-",
  //       },
  //       { headers: { "Content-Type": "multipart/form-data" } }
  //     );

  //     if (res.data.responseCode === "2002500") {
  //       const response = await axios.post(
  //         `${process.env.NEXT_PUBLIC_API_URL}dashboard/Verify?userAccount=${formData.phone}`
  //       );

  //       if (response.data.responseCode === "2002500") {
  //         sessionStorage.setItem("phone", formData.phone);
  //         router.replace(`/otp-register`);
  //       }
  //     } else {
  //       setIsError(true);
  //       // setTimeout(() => setIsError(false), 3000);
  //     }
  //   } catch (error) {
  //     console.log("Error:", error);
  //   } finally {
  //     setLoading(false);
  //     setFormData((prevData) => ({ ...prevData, loading: false }));
  //   }
  // };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validasi form sebelum submit
    if (!validateForm()) return;

    setLoading(true); // Set loading sebelum submit
    setIsError(false); // Reset error state

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
          router.replace(`/otp-register`);
        }
      } else {
        setIsError(true); // Set error state jika gagal
      }
    } catch (error) {
      console.log("Error:", error);
      setIsError(true); // Set error state jika terjadi error pada request
    } finally {
      setLoading(false); // Set loading false setelah proses selesai
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <div className="flex flex-col p-8 w-full">
          <h1 className="text-xl mb-6">Daftar Member</h1>
          {/* <p className="text-sm my-6">
            Daftar akun untuk mendapatkan info terbaru tentang promo, koleksi
            dan keuntungan member lainnya.
          </p> */}
          <form onSubmit={handleSubmit} className="">
            <Input
              label="*Nama Lengkap"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              error={formError.fullName}
              className="mb-4"
            />
            <div className="mb-4">
              <Input
                label="*No. Handphone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={formError.phone}
                className=""
              />
              {!formError.phone && (
                <small className="text-[8px] text-zinc-500 fontMon">
                  contoh: 0812xxx
                </small>
              )}
            </div>

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
              onChange={handleDateChange}
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
                className="accent-blue-950"
                required
              />
              <span className="text-[10px] ms-2 fontMon">
                Saya menyetujui{" "}
                <Link
                  href="/term-condition"
                  target="_blank"
                  className="text-rose-800"
                >
                  <span className="font-bold">Syarat dan Ketentuan</span>
                </Link>{" "}
                yang berlaku.
              </span>
            </div>

            <div className="mb-4">
              {isError && (
                <ErrorMessage message={"No. Telepon/Email sudah terdaftar"} />
              )}
            </div>

            <div className="flex justify-center">
              <Button
                label="DAFTAR"
                className="bg-base-accent text-white"
                loading={loading}
                disabled={loading}
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
