"use client";

import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import ProgressBarMileStone from "@/components/PrgressBarMileStone";
import React, { useState } from "react";

const missions = [
  {
    id: 1,
    title: "First come, first serve",
    category: "Milestone",
    brand: "Mississippi",
    description: "Selesaikan 3 langkah untuk mendapatkan diskon 50%",
    currentValue: 1,
    maxValue: 3,
    milestones: 3,
    imageUrl: "",
    endDate: "15 Juli 2025",
    progressText: "1/3",
    statusMission: "join",
    milestonesDetail: [
      {
        idMil: 1,
        milDesc: "Langkah 1",
        milValue: 1,
        milClaimStatus: "progress",
        milClaimDate: "2025-06-05",
        milPassDate: "2025-06-05",
        milReward: "Voucher 5%",
        milCurrentValue: 1,
      },
      {
        idMil: 2,
        milDesc: "Langkah 2",
        milValue: 300,
        milClaimStatus: "progress",
        milClaimDate: "2025-06-08",
        milPassDate: null,
        milReward: "Voucher 10%",
        milCurrentValue: 0,
      },
      {
        idMil: 3,
        milDesc: "Langkah 3",
        milValue: 300,
        milClaimStatus: "progress",
        milClaimDate: null,
        milPassDate: null,
        milReward: "Diskon 50%",
        milCurrentValue: 0,
      },
    ],
  },
];

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<
    (typeof missions)[0] | null
  >(null);

  const handleOpenModal = (mission: (typeof missions)[0]) => {
    setSelectedMission(mission);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMission(null);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <div className="bg-base-accent w-full min-h-screen">
          <Header>
            <div className="flex items-center justify-between mt-8">
              <span className="text-[10px] fontMon tracking-widest">MISI</span>
              <Link
                className="text-[10px] fontMon tracking-widest pointer"
                href="/missison-history"
              >
                RIWAYAT MISI
              </Link>
            </div>
          </Header>

          {missions.map((mission) => {
            let buttonLabel = "MULAI MISI";
            if (mission.statusMission === "join") {
              const hasPassedMilestone = mission.milestonesDetail.some(
                (mil) => mil.milClaimStatus === "pass"
              );
              buttonLabel = hasPassedMilestone
                ? "KLAIM SEMUA"
                : "SEDANG BERJALAN";
            }

            return (
              <div key={mission.id} className="px-4 pt-4">
                <div className="bg-white w-full rounded-lg flex flex-col justify-between shadow-lg overflow-hidden">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col w-full">
                      <Image
                        src={mission.imageUrl}
                        alt="reward"
                        width={600}
                        height={400}
                        className="w-full max-h-52 object-cover bg-slate-400"
                      />
                      <div className="p-4">
                        <div className="flex flex-col">
                          <div className="mb-4">
                            <span className="text-[10px] fontMon mb-4 text-amber-800 tracking-wider rounded-md bg-amber-50 p-2 border border-amber-200">
                              {mission.brand}
                            </span>
                          </div>

                          <span className="text-[14px] mb-1">
                            {mission.title}
                          </span>
                          <span className="text-[10px] fontMon tracking-widest">
                            {mission.description}
                          </span>

                          <span
                            className="text-[10px] opacity-50 fontMon tracking-wider mt-4 cursor-pointer underline"
                            onClick={() => handleOpenModal(mission)}
                          >
                            Cek Detail
                          </span>

                          <div className="mt-4">
                            <hr />
                          </div>

                          <div className="text-[9px] fontMon opacity-50 tracking-wider mt-2">
                            Progress: {mission.progressText}
                          </div>

                          <div className="flex justify-between items-center mt-2">
                            <ProgressBarMileStone
                              currentValue={mission.currentValue}
                              maxValue={mission.maxValue}
                              milestones={mission.milestones}
                              milestonesDetail={mission.milestonesDetail}
                            />
                          </div>

                          <div className="flex justify-center py-5">
                            <Button
                              label={buttonLabel}
                              className="bg-base-accent text-white"
                            />
                          </div>

                          <span className="text-[10px] fontMon text-center tracking-wider opacity-50">
                            Berakhir pada {mission.endDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Modal Detail */}
          {isModalOpen && selectedMission && (
            <div
              className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-end justify-center"
              onClick={handleCloseModal}
            >
              <div
                className="w-full max-w-md bg-white rounded-t-2xl p-6 shadow-xl animate-slideUp"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    {selectedMission.title}
                  </h2>
                  <button
                    className="text-sm text-gray-500"
                    onClick={handleCloseModal}
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {selectedMission.description}
                </p>
                <div className="space-y-3">
                  {selectedMission.milestonesDetail.map((milestone) => (
                    <div
                      key={milestone.idMil}
                      className="border border-gray-200 p-3 rounded-lg bg-gray-50"
                    >
                      <h3 className="text-sm font-semibold">
                        {milestone.milDesc}
                      </h3>
                      <p className="text-xs">Target: {milestone.milValue}</p>
                      <p className="text-xs">
                        Tercapai: {milestone.milCurrentValue}
                      </p>
                      <p className="text-xs">
                        Status: {milestone.milClaimStatus}
                      </p>
                      <p className="text-xs">Reward: {milestone.milReward}</p>
                      {milestone.milPassDate && (
                        <p className="text-[10px] text-green-600">
                          Selesai: {milestone.milPassDate}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tambahkan animasi CSS untuk transisi */}
      <style jsx>{`
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0%);
          }
        }
      `}</style>
    </div>
  );
}
