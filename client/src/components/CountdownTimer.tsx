import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
}

export default function CountdownTimer({ targetDate, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  function calculateTimeLeft(): TimeLeft {
    const difference = targetDate.getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Check if countdown is complete
      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        clearInterval(timer);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="inline-flex items-center gap-1 sm:gap-2 text-white font-bold">
      <span className="hidden sm:inline">Sale ends in:</span>
      <span className="sm:hidden">Ends:</span>
      <div className="flex items-center gap-1">
        <div className="flex flex-col items-center bg-cyan-500/20 border border-cyan-400/50 rounded px-1.5 py-0.5 sm:px-2 sm:py-1 min-w-[32px] sm:min-w-[40px]">
          <span className="text-sm sm:text-lg font-mono text-cyan-300">{formatNumber(timeLeft.days)}</span>
          <span className="text-[8px] sm:text-xs text-cyan-400/80">days</span>
        </div>
        <span className="text-cyan-300">:</span>
        <div className="flex flex-col items-center bg-cyan-500/20 border border-cyan-400/50 rounded px-1.5 py-0.5 sm:px-2 sm:py-1 min-w-[32px] sm:min-w-[40px]">
          <span className="text-sm sm:text-lg font-mono text-cyan-300">{formatNumber(timeLeft.hours)}</span>
          <span className="text-[8px] sm:text-xs text-cyan-400/80">hrs</span>
        </div>
        <span className="text-cyan-300">:</span>
        <div className="flex flex-col items-center bg-cyan-500/20 border border-cyan-400/50 rounded px-1.5 py-0.5 sm:px-2 sm:py-1 min-w-[32px] sm:min-w-[40px]">
          <span className="text-sm sm:text-lg font-mono text-cyan-300">{formatNumber(timeLeft.minutes)}</span>
          <span className="text-[8px] sm:text-xs text-cyan-400/80">min</span>
        </div>
        <span className="text-cyan-300">:</span>
        <div className="flex flex-col items-center bg-cyan-500/20 border border-cyan-400/50 rounded px-1.5 py-0.5 sm:px-2 sm:py-1 min-w-[32px] sm:min-w-[40px]">
          <span className="text-sm sm:text-lg font-mono text-cyan-300">{formatNumber(timeLeft.seconds)}</span>
          <span className="text-[8px] sm:text-xs text-cyan-400/80">sec</span>
        </div>
      </div>
    </div>
  );
}
