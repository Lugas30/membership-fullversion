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
};

const Vouchers: FC<Voucher> = ({
  handleSubmit,
  handleSelectVoucher,
  selectedVoucher,
  isLoading,
  data,
  userPoints,
}) => {
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

      <div className="mt-8 flex justify-center">
        <Button
          label="Tukar Poin"
          type="submit"
          className="bg-base-accent text-white"
          loading={isLoading}
        />
      </div>
    </form>
  );
};

export default Vouchers;
