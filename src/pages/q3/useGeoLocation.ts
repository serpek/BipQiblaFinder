import { useState, useEffect } from 'react';

export const useGeoLocation = () => {
  const [position, setPosition] = useState<{ latitude: number; longitude: number }>({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    });
  }, []);

  return position;
};
