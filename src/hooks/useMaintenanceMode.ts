
import { useState, useEffect } from 'react';

export const useMaintenanceMode = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  useEffect(() => {
    // Always set maintenance mode to false - no timer needed
    setIsMaintenanceMode(false);
    // Clear any existing maintenance data
    localStorage.removeItem('maintenance_end');
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
