import { useState, useCallback } from 'react';

export function useForceRerender() {
  const [, setTick] = useState(0);
  
  const forceRerender = useCallback(() => {
    setTick(tick => tick + 1);
  }, []);
  
  return forceRerender;
}
