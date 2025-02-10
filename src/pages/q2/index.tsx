import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

// Konum ve Kıble hesaplama yardımcı fonksiyonları
const toRadians = (degrees: number) => degrees * (Math.PI / 180);
const toDegrees = (radians: number) => radians * (180 / Math.PI);

const calculateQiblaAngle = (lat: number, lng: number): number => {
  const meccaLng = 39.8262;
  const meccaLat = 21.4225;

  const phiK = toRadians(meccaLat);
  const lambdaK = toRadians(meccaLng);
  const phi = toRadians(lat);
  const lambda = toRadians(lng);

  const term1 = Math.sin(lambdaK - lambda);
  const term2 = Math.cos(phi) * Math.tan(phiK);
  const term3 = Math.sin(phi) * Math.cos(lambdaK - lambda);

  const angle = Math.atan2(term1, term2 - term3);
  return (toDegrees(angle) + 360) % 360;
};

// Stil bileşenleri
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(180deg, #1a237e, #0d47a1);
  color: white;
  padding: 20px;
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const CompassWrapper = styled.div<{ disabled: boolean }>`
  position: relative;
  width: 300px;
  height: 300px;
  margin: 2rem 0;
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: opacity 0.3s ease;
  display: grid;
  place-items: center;
`;

const CompassSvg = styled.svg.attrs({
  viewBox: '0 0 100 100',
}) <{ heading: number }>`
  width: 100%;
  height: 100%;
  transform: rotate(${props => props.heading ?? 0}deg);
`;

const Arrow = styled.path.attrs({
  d: "M50 10 L58 70 L50 90 L42 70 Z", // Yeni ok tasarımı
}) <{ rotating: boolean }>`
  fill: #FF3D00;
  transform-origin: 50% 50%;
  animation: ${rotate} 2s linear infinite;
  animation-play-state: ${props => props.rotating ? 'running' : 'paused'};
`;

const CompassCircle = styled.circle.attrs({
  cx: 50,
  cy: 50,
  r: 48,
})`
  fill: none;
  stroke: #FFF;
  stroke-width: 2;
`;

const CenterDot = styled.circle.attrs({
  cx: 50,
  cy: 50,
  r: 2,
})`
  fill: #FFF;
`;

const Indicator = styled.div<{ angle: number }>`
  position: absolute;
  top: 0;
  left: 50%;
  width: 3px;
  height: 40%;
  background: linear-gradient(to bottom, #ff4081 0%, transparent 100%);
  transform-origin: 50% 100%;
  transform: 
    translateX(-50%) 
    rotate(${props => props.angle}deg);
  z-index: 2;
`;

const StatusMessage = styled.div`
  margin: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  text-align: center;
`;

const PermissionButton = styled.button`
  padding: 12px 24px;
  margin: 1rem;
  background: #00e676;
  border: none;
  border-radius: 25px;
  color: #1a237e;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(0, 230, 118, 0.4);
  }
`;

const QiblaFinder: React.FC = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // İzinleri yönet
  const requestPermissions = useCallback(async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
        });
      });

      if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {

        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          setPermissionGranted(true);
          setUserLocation(position);
        } else {
          setError('Cihaz sensörlerine erişim izni gerekiyor');
        }
      } else {
        setPermissionGranted(true);
        setUserLocation(position);
      }
    } catch {
      setError('Konum erişimi reddedildi veya alınamadı');
    }
  }, []);

  // Pusula verilerini işle
  useEffect(() => {
    if (!permissionGranted) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        setHeading(e.alpha);
      }
    };

    window.addEventListener('deviceorientationabsolute', handleOrientation as EventListener, true);
    return () => window.removeEventListener('deviceorientationabsolute', handleOrientation as EventListener);
  }, [permissionGranted]);

  // Hesaplamalar
  const qiblaAngle = userLocation
    ? calculateQiblaAngle(
      userLocation.coords.latitude,
      userLocation.coords.longitude
    )
    : 0;

  const currentAngle = heading !== null
    ? (360 - heading + qiblaAngle) % 360
    : 0;

  const angleDifference = currentAngle > 180 ? currentAngle - 360 : currentAngle;
  const direction = angleDifference > 0 ? 'SOL' : 'SAĞ';
  const targetAngle = Math.abs(angleDifference);

  return (
    <Container>
      <h1>Kıble Pusulası</h1>

      {error && (
        <StatusMessage>
          ❗ Hata: {error}
          <PermissionButton onClick={requestPermissions}>Tekrar Dene</PermissionButton>
        </StatusMessage>
      )}

      {!permissionGranted && !error && (
        <StatusMessage>
          <p>Lütfen konum ve sensör izinlerini verin</p>
          <PermissionButton onClick={requestPermissions}>
            İzinleri Aç
          </PermissionButton>
        </StatusMessage>
      )}

      {permissionGranted && (
        <>
          <CompassWrapper disabled={heading === null}>
            <CompassSvg heading={heading ?? 0}>
              <CompassCircle />
              <CenterDot />

              {/* Kuzey işareti */}
              <text x="50" y="18" textAnchor="middle" fill="#FFF" fontSize="8">N</text>

              <Arrow rotating={heading === null} />
            </CompassSvg>
            <Indicator angle={currentAngle} />
          </CompassWrapper>

          <StatusMessage>
            {heading === null ? (
              'Pusula kalibrasyonu yapılıyor...'
            ) : (
              targetAngle < 5 ? (
                <span style={{ color: '#00e676' }}>
                  ✔ Kıble yönündesiniz!
                </span>
              ) : (
                `↻ ${targetAngle.toFixed(1)}° ${direction} tarafına dönün`
              )
            )}
          </StatusMessage>
        </>
      )}
    </Container>
  );
};

export default QiblaFinder;