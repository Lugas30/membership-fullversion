import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getPointExpired } from "@/redux/thunks/pointExpiredThunks";
import formatToIDR from "@/utils/formatToIDR";
import Image from "next/image";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { FadeLoader } from "react-spinners";

interface PointExpired {
  ID: number;
  periode: string;
  pointExpired: number;
  expiredDate: string;
}

export default function Kedaluarsa() {
  const dispatch = useAppDispatch();
  const { error, data } = useSelector((state: RootState) => state.pointExpired);

  useEffect(() => {
    dispatch(getPointExpired());
  }, [dispatch]);

  if (data == null) {
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
  return (
    <div className="flex flex-col items-center p-4">
      {data?.expiredPointData ? (
        data.expiredPointData.length > 0 ? (
          data.expiredPointData.map((item: PointExpired) => (
            <div
              className="bg-white p-4 w-full rounded-lg border border-gray-300 flex items-center justify-between mb-4"
              key={item.ID}
            >
              <div className="flex justify-between items-center w-full">
                <p className="text-[10px] text-sm tracking-wider">
                  {formatToIDR(item.pointExpired)}{" "}
                  <small className="text-[8px] uppercase tracking-widest fontMon">
                    Poin
                  </small>
                </p>
                <small className="text-xs">{item.expiredDate}</small>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Tidak ada data transaksi.</p>
        )
      ) : (
        <p className="text-center text-gray-500">Data tidak tersedia.</p>
      )}
    </div>
  );
}
