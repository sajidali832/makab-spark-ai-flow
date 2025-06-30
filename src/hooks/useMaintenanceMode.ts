
import { useState, useEffect } from 'react';

export const useMaintenanceMode = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(true);

  useEffect(() => {
    const checkMaintenanceMode = () => {
      const maintenanceEnd = localStorage.getItem('maintenance_end');
      
      if (!maintenanceEnd) {
        // First time - set maintenance mode
        setIsMaintenanceMode(true);
        return;
      }

      const now = new Date().getTime();
      const end = new Date(maintenanceEnd).getTime();
      
      if (now >= end) {
        // Maintenance period is over
        setIsMaintenanceMode(false);
        localStorage.removeItem('maintenance_end');
      } else {
        // Still in maintenance mode
        setIsMaintenanceMode(true);
      }
    };

    checkMaintenanceMode();
    
    // Check every minute
    const interval = setInterval(checkMaintenanceMode, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const enableMaintenanceMode = () => {
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 15);
    localStorage.setItem('maintenance_end', endTime.toISOString());
    setIsMaintenanceMode(true);
  };

  const disableMaintenanceMode = () => {
    localStorage.removeItem('maintenance_end');
    setIsMaintenanceMode(false);
  };

  return {
    isMaintenanceMode,
    enableMaintenanceMode,
    disableMaintenanceMode
  };
};
