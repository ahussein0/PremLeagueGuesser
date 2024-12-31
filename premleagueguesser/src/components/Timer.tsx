import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  startTime: number;
  isComplete: boolean;
}

export function Timer({ startTime, isComplete }: TimerProps) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!isComplete) {
      const interval = setInterval(() => {
        setTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, isComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 text-lg font-mono">
      <Clock className="h-5 w-5" />
      <span>{formatTime(time)}</span>
    </div>
  );
}