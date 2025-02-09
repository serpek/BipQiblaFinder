import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { useGeoLocation, useDeviceOrientation } from './hooks';

const Compass: React.FC = () => {
  const { latitude, longitude } = useGeoLocation();
  const { alpha } = useDeviceOrientation();

  const qiblaDirection = calculateQiblaDirection(latitude, longitude);
  const compassRotation = alpha - qiblaDirection;

  const { rotation } = useSpring({ rotation: [0, 0, compassRotation] });

  return (
    <Canvas>
      <animated.mesh rotation={rotation}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="red" />
      </animated.mesh>
    </Canvas>
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
