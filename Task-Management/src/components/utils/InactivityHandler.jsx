import { useEffect, useRef } from 'react';

const InactivityHandler = ({ onTimeout, timeout = 15 * 60 * 1000 }) => {
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onTimeout(); // call logout
    }, timeout);
  };

  useEffect(() => {
    const activityEvents = ['mousemove', 'mousedown', 'click', 'scroll', 'keypress'];

    activityEvents.forEach(event =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer(); // start timer on mount

    return () => {
      activityEvents.forEach(event =>
        window.removeEventListener(event, resetTimer)
      );
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return null; // this component does not render anything
};

export default InactivityHandler;
