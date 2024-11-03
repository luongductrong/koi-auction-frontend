import { useState, useEffect } from 'react';

function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  console.log('Navi', navigator.onLine);

  useEffect(() => {
    const checkOnlineStatus = async () => {
      try {
        const res = await fetch('https://www.google.com/', {
          method: 'HEAD',
          mode: 'no-cors',
        });
        setIsOnline(true);
      } catch (error) {
        setIsOnline(false);
      }
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    checkOnlineStatus();
    const interval = setInterval(checkOnlineStatus, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return isOnline;
}

export default useNetworkStatus;
