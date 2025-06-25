// components/ProgressBarMileStone.tsx
import React from "react";

// export type MilClaimStatus = "progress" | "pass" | "claimed";

export interface MilestoneDetail {
  idMil: number;
  milDesc: string;
  milValue: number;
  milClaimStatus: string;
  milClaimDate: string | null;
  milReward: string;
  milCurrentValue: number;
}

interface ProgressBarProps {
  currentValue: number;
  maxValue: number;
  milestones: number;
  milestonesDetail: MilestoneDetail[];
}

const ProgressBarMileStone: React.FC<ProgressBarProps> = ({
  currentValue,
  maxValue,
  milestones,
  milestonesDetail,
}) => {
  const percentage = (currentValue / maxValue) * 100;

  return (
    <div className="relative w-full bg-neutral-300  rounded-full h-1 mt-2 mb-4">
      <div
        className="absolute top-0 left-0 h-1 bg-amber-300 rounded-full"
        style={{ width: `${percentage}%` }}
      />

      {milestonesDetail.map((milestone, idx) => {
        const pos = ((idx + 1) / milestones) * 100;
        const isReached = milestone.milCurrentValue >= milestone.milValue;
        return (
          <div
            key={milestone.idMil}
            className="absolute top-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full border-[1px] border-neutral-300 bg-neutral-300  flex items-center justify-center group"
            style={{ left: `calc(${pos}% - 6px)` }}
          >
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                isReached ? "bg-amber-300" : " border-amber-300"
              }`}
            />
            <div className="absolute bottom-5 -translate-x-1/2 z-10 hidden group-hover:block whitespace-nowrap text-xs bg-black text-white px-2 py-1 rounded">
              <p>{milestone.milDesc}</p>
              <p>{milestone.milReward}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBarMileStone;
