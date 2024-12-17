import React from "react";
import QRCode from "react-qr-code";

type ModalQRCodeProps = {
  data: {
    fullName: string;
    phone: string;
    memberID: string;
  } | null;
  closeModal: () => void;
};

const ModalQRCode: React.FC<ModalQRCodeProps> = ({ data, closeModal }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-8 z-50">
      <div className="bg-white w-full max-w-md shadow-lg rounded-lg">
        <div className="flex justify-end items-center p-4">
          <button onClick={closeModal} className="text-black">
            &#10005;
          </button>
        </div>

        <div className="flex flex-col justify-center items-center w-full">
          <h2 className="font-medium">{data?.fullName}</h2>
          <div className="bg-zinc-100 flex flex-col justify-center items-center my-4 py-4 gap-2 w-full">
            <span className="text-xs text-zinc-400">Nomor Telepon Anda</span>
            <span className="text-xs text-zinc-400">{data?.phone}</span>
          </div>

          <div className="flex justify-center items-center my-2 px-16 ">
            <QRCode
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={data?.memberID || ""}
            />
          </div>

          <div className="flex flex-col justify-center items-center my-2 py-2 gap-1 w-full">
            <span className="text-xs text-zinc-400">ID Member</span>
            <span className="text-xs">{data?.memberID}</span>
          </div>
          <span className="text-xs mb-6">
            Perlihatkan ID Member Anda kepada kasir
          </span>
        </div>
      </div>
    </div>
  );
};

export default ModalQRCode;
