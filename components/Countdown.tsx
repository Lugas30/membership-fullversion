import React, { useEffect, useState } from "react";
import { parse } from "date-fns";

interface CountdownProps {
  targetDate: string; // format string yang akan diubah menjadi Date
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [remainingTime, setRemainingTime] = useState<string>("");

  const formatDate = (dateString: string): Date | null => {
    // Coba parse dengan beberapa format
    const formats = ["dd/MM/yyyy", "yyyy-MM-dd"];
    for (const fmt of formats) {
      try {
        return parse(dateString, fmt, new Date());
      } catch {
        continue; // Lanjut ke format berikutnya
      }
    }
    return null; // Jika parsing gagal untuk semua format
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      const parsedDate = formatDate(targetDate);
      if (!parsedDate) {
        setRemainingTime("Format tanggal tidak valid!");
        return;
      }

      const target = parsedDate;
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      if (difference <= 0) {
        setRemainingTime("Waktu telah habis!");
        return;
      }

      const days = Math.floor(difference / (1000 * 3600 * 24));
      setRemainingTime(`${days} Hari lagi`);
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // Jalankan langsung untuk menghindari delay

    return () => clearInterval(timer);
  }, [targetDate]);

  return <span className="text-xs">{remainingTime}</span>;
};

export default Countdown;
