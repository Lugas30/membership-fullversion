import Button from "@/components/Button";
import formatToIDR from "@/utils/formatToIDR";
import React, { FC } from "react";

interface VoucherData {
  id: number;
  voucherCode: string;
  category: string;
  voucherTitle: string;
  nominal: number;
  fromDate: string;
  toDate: string;
  status_Voucher: string;
}

type Voucher = {
  handleSubmit: (e: React.FormEvent) => void;
  handleSelectVoucher: (voucherCode: string) => void;
  selectedVoucher: string | null;
  isLoading: boolean;
  data: VoucherData[];
  userPoints: number;
  handleMaxPoints: () => void;
  points: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Vouchers: FC<Voucher> = ({
  handleSubmit,
  handleSelectVoucher,
  selectedVoucher,
  isLoading,
  data,
  userPoints,
  handleMaxPoints,
  points,
  handleChange,
}) => {
  // Fungsi untuk membersihkan format IDR menjadi angka asli
  const cleanIDR = (value: string) => {
    return value.replace(/[^\d]/g, ""); // Menghapus semua karakter kecuali angka
  };

  // Fungsi handleChange yang sudah divalidasi dan menggunakan formatToIDR
  const handleValidatedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = cleanIDR(e.target.value); // Hapus format IDR
    e.target.value = rawValue; // Pastikan nilai yang disimpan tetap angka
    handleChange(e); // Tetap mengirim event untuk konsistensi dengan tipe yang diharapkan
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-4">
      <div className="grid grid-cols-3 gap-2">
        {data.map((voucher: VoucherData) => {
          const isDisabled = userPoints < voucher.nominal; // Cek apakah poin kurang dari nominal voucher
          return (
            <div
              key={voucher.id}
              className={`px-4 py-3 border cursor-pointer text-center text-xs ${
                selectedVoucher === voucher.voucherCode
                  ? "bg-gray-300"
                  : isDisabled
                  ? "bg-gray-200 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
              onClick={() =>
                !isDisabled && handleSelectVoucher(voucher.voucherCode)
              } // Hanya bisa dipilih jika tidak disabled
            >
              <span
                className={`block ${
                  isDisabled ? "text-gray-400" : "text-black"
                }`}
              >
                Rp {formatToIDR(voucher.nominal)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col justify-between items-center my-5 gap-2 w-full">
        {/* <div className="">
          <span className="text-xs">Nominal poin custom</span>
        </div> */}

        {/* Inputan poin custom dan tombol MAX - Dihide sementara*/}
        {/* <div className="flex gap-2">
          <div className="relative">
            <input
              type="tel"
              className="w-full p-3 rounded text-[10px] text-gray-700 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-black focus:border-black fontMon pl-7"
              placeholder="1.000"
              value={points ? formatToIDR(Number(points)) : ""} // Format nilai poin ke IDR
              onChange={handleValidatedChange}
            />
            <span className="text-[10px] absolute top-0 flex justify-center items-center h-full left-3 fontMon">
              Rp
            </span>
          </div>
          <div>
            <button
              type="button"
              className="bg-base-accent text-white p-3 rounded text-[10px] w-full"
              onClick={handleMaxPoints}
            >
              MAX
            </button>
          </div>
        </div> */}
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          label="Tukar Poin"
          type="submit"
          className="bg-base-accent text-white"
          loading={isLoading}
          disabled={isLoading || !selectedVoucher}
        />
      </div>
    </form>
  );
};

export default Vouchers;
