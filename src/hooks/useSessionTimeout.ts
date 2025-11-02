import { useEffect, useRef, useState } from 'react';

const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes
const WARNING_DURATION = 2 * 60 * 1000; // 2 minutes before timeout

export const useSessionTimeout = (onTimeout: () => void) => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(WARNING_DURATION);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();
  const countdownRef = useRef<NodeJS.Timeout>();

  const clearTimers = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  const startCountdown = () => {
    setTimeRemaining(WARNING_DURATION);
    countdownRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1000) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
  };

  const resetTimer = () => {
    clearTimers();
    setShowWarning(false);

    // Show warning 2 minutes before timeout
    warningRef.current = setTimeout(() => {
      setShowWarning(true);
      startCountdown();
    }, TIMEOUT_DURATION - WARNING_DURATION);

    // Auto logout after full timeout
    timeoutRef.current = setTimeout(() => {
      onTimeout();
    }, TIMEOUT_DURATION);
  };

  const extendSession = () => {
    resetTimer();
  };

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    
    const handleActivity = () => {
      if (!showWarning) {
        resetTimer();
      }
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    resetTimer();

    return () => {
      clearTimers();
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [showWarning]);

  return { showWarning, timeRemaining, extendSession, resetTimer };
};
