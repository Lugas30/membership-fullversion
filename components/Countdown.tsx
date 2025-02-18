import React, { useEffect, useState } from "react";
import { parse } from "date-fns";

interface CountdownProps {
  targetDate: string; // format string yang akan diubah menjadi Date
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [remainingTime, setRemainingTime] = useState<string>("");

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
        return;
      }

      const target = new Date(
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate()
      );
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const difference = target.getTime() - today.getTime();
      const days = difference / (1000 * 3600 * 24);

      if (days === 0) {
        setRemainingTime("Akan kedaluwarsa!");
      } else if (days > 0) {
        setRemainingTime(`${days} Hari lagi`);
      } else {
        setRemainingTime("Voucher Kedaluwarsa!");
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [targetDate]);

  return <span className="text-xs">{remainingTime}</span>;
};

export default Countdown;
