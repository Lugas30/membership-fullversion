"use client";

import Select from "@/components/Select";
import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getTier } from "@/redux/thunks/tierThunks";
import { getTierInfo } from "@/redux/thunks/tierInfoSementara";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FadeLoader } from "react-spinners";
import formatToIDR from "@/utils/formatToIDR";

interface BenefitData {
  point_1: string;
  point_2: string;
  point_3: string;
  point_4: string;
  point_5: string;
  point_6: string;
  point_7: string;
  point_8: string;
}

interface Tier {
  id: number;
  tier: string;
  amountStartingFrom: number;
  amountUpTo: number;
  amountPoint: number;
  tier_image: string;
  benefitData: BenefitData;
  cardImage: string;
}

export default function TierInfo() {
  const dispatch = useAppDispatch();
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);

  const { error, data } = useSelector((state: RootState) => state.tier);

  useEffect(() => {
    dispatch(getTier());
    dispatch(getTierInfo()); //Gak jadi dipake nanti dihapus
  }, [dispatch]);

  const options = data
    ? data.tierData.map((tier: Tier) => ({
        id: tier.id.toString(),
        label: tier.tier,
      }))
    : [];

  // Kondisi sementara buat point per tier
  const getAmountPoint = (tierId: number | undefined) => {
    if (tierId === undefined) return 0;
    switch (tierId) {
      case 0:
        return 0;
      case 1:
        return 100;
      case 2:
        return 150;
      case 3:
        return 200;
      case 4:
        return 250;
      case 5:
        return 300;
      case 6:
        return 400;
      case 7:
        return 500;
      default:
        return 0;
    }
  };

  const amountPoint = getAmountPoint(selectedTier?.id);

  useEffect(() => {
    if (data && data.tierData.length > 0) {
      setSelectedTier(data.tierData[0] || null);
    }
  }, [data]);

  const handleChangeTier = (value: string) => {
    const selected = data.tierData?.find(
      (tier: Tier) => tier.id === parseInt(value)
    );
    setSelectedTier(selected || null);
  };

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
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <div className="min-h-screen bg-base-accent">
          <div className="flex flex-col bg-white rounded-b-3xl p-8">
            <div className="flex items-center">
              <Image
                src="/images/arrow-left.svg"
                width={30}
                height={30}
                alt="arrow-left"
                className="w-auto h-auto cursor-pointer absolute"
                onClick={() => window.history.back()}
              />
              <div className="flex-grow flex justify-center">
                <span className="text-xl">Tier Member</span>
              </div>
            </div>
            <p className="text-[10px] text-center tracking-wider my-6 fontMon leading-relaxed">
              Penentuan tier member berdasarkan total transaksi belanja, setiap
              tingkatan tier memiliki benefit yang berbeda seperti penambahan
              nilai poin dan akses benefit lainnya
            </p>
            <Select
              labelSelect="Pilih Tier"
              options={options}
              labelOption="Pilih Tier"
              value={selectedTier?.id.toString() || ""}
              onChange={(e) => handleChangeTier(e.target.value)}
            />
          </div>

          {selectedTier && (
            <div className="flex flex-col justify-center items-center p-8">
              <div className="flex flex-col justify-center items-center bg-white w-full p-4 rounded-lg">
                <div className="flex justify-center items-center relative p-4">
                  <div className="relative">
                    <Image
                      src={`https://amscorp.id/card/${selectedTier.cardImage}`}
                      alt={selectedTier.tier}
                      width={500}
                      height={500}
                      className="shadow w-full h-auto"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                      <span className="text-xs text-white">
                        {selectedTier.tier}
                      </span>
                      <span className="text-[8px] text-white">TIER</span>
                    </div>
                  </div>
                </div>

                <h2 className="font-semibold">{selectedTier.tier}</h2>
                <div className="flex self-start">
                  <span className="text-sm font-medium my-4">
                    Rp {formatToIDR(selectedTier.amountStartingFrom)} - Rp{" "}
                    {formatToIDR(selectedTier.amountUpTo)}
                  </span>
                </div>
                <div className="flex flex-col w-full mt-2">
                  <span className="text-sm font-semibold">Penambahan Poin</span>
                  <span className="text-[10px]">
                    Setiap pembelian Rp 10.000 = {amountPoint} Poin
                  </span>
                </div>
                <div className="flex flex-col w-full mt-2">
                  <span className="text-sm font-semibold">Benefit</span>
                  <ol className="text-[10px] list-decimal list-inside">
                    {Object.values(selectedTier.benefitData).map(
                      (benefit, index) => (
                        <li key={index}>{benefit}</li>
                      )
                    )}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
