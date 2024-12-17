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
};

const Vouchers: FC<Voucher> = ({
  handleSubmit,
  handleSelectVoucher,
  selectedVoucher,
  isLoading,
  data,
}) => {
  return (
    <form onSubmit={handleSubmit} className="w-full mt-4">
      <div className="grid grid-cols-3 gap-2">
        {data.map((voucher: VoucherData) => (
          <div
            key={voucher.id}
            className={`px-4 py-2 border cursor-pointer text-center text-xs ${
              selectedVoucher === voucher.voucherCode
                ? "bg-gray-300"
                : "hover:bg-gray-100"
            }`}
            onClick={() => handleSelectVoucher(voucher.voucherCode)}
          >
            Rp {formatToIDR(voucher.nominal)}
          </div>
        ))}
      </div>

      <Button
        label="Tukar Point"
        type="submit"
        className="bg-base-accent text-white rounded-full w-full mt-8 p-2"
        loading={isLoading}
      />
    </form>
  );
};

export default Vouchers;
