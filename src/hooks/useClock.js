import { useEffect, useState } from 'react';

export default function useClock(formatter) {
  const getTime = () => (formatter ? formatter() : new Date().toLocaleTimeString());
  const [time, setTime] = useState(getTime);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTime(getTime());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [formatter]);

  return time;
}
