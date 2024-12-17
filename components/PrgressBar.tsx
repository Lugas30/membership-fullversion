import React from "react";

interface ProgressBarProps {
  currentValue: number;
  maxValue: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentValue,
  maxValue,
}) => {
  // Menghitung persentase progress
  const percentage = (currentValue / maxValue) * 100;

  return (
    <div className="w-full bg-neutral-500 rounded-full my-2">
      <div
        className="bg-yellow-300 h-1 rounded-full"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
