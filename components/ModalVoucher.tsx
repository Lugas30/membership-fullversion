import React from "react";
import QRCode from "react-qr-code";

type ModalQRVoucherProps = {
  data: {
    id: number;
    noVoucher: string;
    nominal: number;
    category: string;
    pointVoucher: number;
    tanggalExpired: string;
    statusPenggunaan: string;
  } | null;
  closeModal: () => void;
};

const ModalQRVoucher: React.FC<ModalQRVoucherProps> = ({
  data,
  closeModal,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-8 z-50">
      <div className="bg-white w-full max-w-md shadow-lg rounded-lg">
        <div className="flex justify-end items-center p-4">
          <button onClick={closeModal} className="text-black">
            &#10005;
          </button>
        </div>

        <div className="flex flex-col justify-center items-center w-full">
          <div className="flex justify-center items-center my-2 px-16 ">
            <QRCode
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={data?.noVoucher || ""}
            />
          </div>

          <div className="flex flex-col justify-center items-center my-4 py-2 gap-1 w-full">
            <span className="text-xs text-zinc-400">Kode Voucher</span>
            <span className="text-sm tracking-wider">{data?.noVoucher}</span>
          </div>
          <span className="text-xs mb-6">
            Perlihatkan kode voucher kepada kasir
          </span>
        </div>
      </div>
    </div>
  );
};

export default ModalQRVoucher;
