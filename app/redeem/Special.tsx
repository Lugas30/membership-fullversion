import Button from "@/components/Button";
import formatToIDR from "@/utils/formatToIDR";
import React, { FC } from "react";

interface VoucherData {
  id: number;
  voucherCode: string;
  category: string;
  voucherTitle: string;
  nominal: number;
  pointVoucher: number;
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

const Special: FC<Voucher> = ({
  handleSubmit,
  handleSelectVoucher,
  selectedVoucher,
  isLoading,
  data,
}) => {
  return (
    <form onSubmit={handleSubmit} className="w-full mt-4">
      <div className="flex flex-col gap-2">
        {/* Filter vouchers */}
        {data.map((voucher: VoucherData) => (
          <div
            key={voucher.id}
            className={`p-5 rounded-xl border cursor-pointer text-center text-xs ${
              voucher.status_Voucher === "enabled"
                ? selectedVoucher === voucher.voucherCode
                  ? "bg-base-accent text-white"
                  : "hover:bg-gray-100"
                : "bg-gray-200 text-gray-400" // Disabled state (grayscale)
            }`}
            onClick={() =>
              voucher.status_Voucher === "enabled" &&
              handleSelectVoucher(voucher.voucherCode)
            }
          >
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-start gap-2">
                <span>Voucher Special</span>
                <span className="text-xl">
                  Rp {formatToIDR(voucher.nominal)}
                </span>
              </div>
              <span className="text-sm">
                {formatToIDR(voucher.pointVoucher)}{" "}
                <span className="fontMon uppercase text-[8px] tracking-widest">
                  Poin
                </span>
              </span>
            </div>
          </div>
        ))}
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

export default Special;
