import React from 'react';
import styled from 'styled-components';
import { Card } from 'antd';
import { useGeolocation, useMotion } from 'react-use';

const CompassContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f0f2f5;
`;

const Compass: React.FC = () => {
  const { latitude, longitude } = useGeolocation();
  const { rotationRate: { alpha } } = useMotion();

  if (latitude === null || longitude === null) {
    return (
      <CompassContainer>
        <Card title="Qibla Finder" style={{ width: 300, textAlign: 'center' }}>
          <p>Konum bilgisi alınamıyor. Lütfen konum izinlerini kontrol edin.</p>
        </Card>
      </CompassContainer>
    );
  }

  if (alpha === null) {
    return (
      <CompassContainer>
        <Card title="Qibla Finder" style={{ width: 300, textAlign: 'center' }}>
          <p>Cihaz yön bilgisi alınamıyor. Lütfen sensör izinlerini kontrol edin.</p>
        </Card>
      </CompassContainer>
    );
  }

  const qiblaDirection = calculateQiblaDirection(latitude, longitude);
  const compassRotation = alpha - qiblaDirection;

  return (
    <CompassContainer>
      <Card title="Qibla Finder" style={{ width: 300, textAlign: 'center' }}>
        <div style={{ transform: `rotate(${compassRotation}deg)`, transition: 'transform 0.3s ease' }}>
          <img src="/compass.png" alt="Compass" style={{ width: 200, height: 200 }} />
        </div>
        <p>Kabe'ye doğru {qiblaDirection.toFixed(2)}° dönmelisiniz.</p>
      </Card>
    </CompassContainer>
  );
};

const calculateQiblaDirection = (lat: number, lon: number) => {
  // Kıble yönünü hesaplama formülü
  const kaabaLat = 21.4225;
  const kaabaLon = 39.8262;
  return Math.atan2(
    Math.sin(kaabaLon - lon) * Math.cos(kaabaLat),
    Math.cos(lat) * Math.sin(kaabaLat) - Math.sin(lat) * Math.cos(kaabaLat) * Math.cos(kaabaLon - lon)
  ) * (180 / Math.PI);
};

export default Compass;
