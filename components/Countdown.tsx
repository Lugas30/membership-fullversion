import React, { useEffect, useState } from "react";
import { parse } from "date-fns";

interface CountdownProps {
  targetDate: string; // format string yang akan diubah menjadi Date
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [remainingTime, setRemainingTime] = useState<string>("");
  const [isUrgent, setIsUrgent] = useState<boolean>(false); // Menentukan apakah harus berwarna merah

  const formatDate = (dateString: string): Date | null => {
    const formats = ["dd/MM/yyyy", "yyyy-MM-dd"];
    for (const fmt of formats) {
      try {
        return parse(dateString, fmt, new Date());
      } catch {
        continue;
      }
    }
    return null;
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      const parsedDate = formatDate(targetDate);
      if (!parsedDate) {
        setRemainingTime("Format tanggal tidak valid!");
        setIsUrgent(true);
        return;
      }

      const now = new Date();
      const target = new Date(
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate(),
        23,
        59,
        59 // Set waktu menjadi akhir hari
      );

      const difference = target.getTime() - now.getTime();

      if (difference > 24 * 3600 * 1000) {
        const days = Math.floor(difference / (1000 * 3600 * 24));
        setRemainingTime(`${days} Hari lagi`);
        setIsUrgent(false);
      } else if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setRemainingTime(`${hours} : ${minutes} : ${seconds}`);
        setIsUrgent(true);
      } else {
        setRemainingTime("Expired");
        setIsUrgent(true);
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <span
      className={`text-[10px] uppercase fontMon ${
        isUrgent ? "text-red-500 font-bold text-lg" : ""
      }`}
    >
      {remainingTime}
    </span>
  );
};

export default Countdown;
