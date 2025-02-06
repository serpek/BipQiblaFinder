import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useDevicePermissions } from "./hooks";
import L from "leaflet";

// 🕋 Kabe'nin koordinatları (Mekke, Suudi Arabistan)
const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;

// 📌 Kıble Açısını Hesaplayan Fonksiyon
const calculateQiblaDirection = (lat: number, lon: number) => {
  const userLatRad = (Math.PI * lat) / 180;
  const userLonRad = (Math.PI * lon) / 180;
  const kaabaLatRad = (Math.PI * KAABA_LAT) / 180;
  const kaabaLonRad = (Math.PI * KAABA_LON) / 180;

  const deltaLon = kaabaLonRad - userLonRad;
  const y = Math.sin(deltaLon);
  const x = Math.cos(userLatRad) * Math.tan(kaabaLatRad) - Math.sin(userLatRad) * Math.cos(deltaLon);
  
  let qiblaAngle = (Math.atan2(y, x) * 180) / Math.PI;
  if (qiblaAngle < 0) qiblaAngle += 360;

  return qiblaAngle;
};

// 📌 Harita Güncelleyici
const MapUpdater: React.FC<{ latitude: number; longitude: number }> = ({ latitude, longitude }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([latitude, longitude], 14);
  }, [latitude, longitude, map]);
  return null;
};

const MapComponent: React.FC = () => {
  const {
    location, orientation, 
    requestLocation, requestMotionPermission, 
    geoPermission, motionPermission 
  } = useDevicePermissions();

  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  // const [angleDifference, setAngleDifference] = useState<number | null>(null);
  const [isFacingQibla, setIsFacingQibla] = useState<boolean | null>(null);

  useEffect(() => {
    if (location.latitude !== null && location.longitude !== null) {
      const qiblaDir = calculateQiblaDirection(location.latitude, location.longitude);
      setQiblaAngle(qiblaDir);
    }
  }, [location]);

  useEffect(() => {
    if (qiblaAngle !== null && orientation.alpha !== null) {
      let difference = qiblaAngle - orientation.alpha;
      if (difference < 0) difference += 360;
      // setAngleDifference(difference);
      setIsFacingQibla(difference < 15 || Math.abs(difference - 360) < 15);
    }
  }, [orientation, qiblaAngle]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Harita & Kıble Pusulası</h1>
      
      <button onClick={requestLocation}>Konum Al</button>
      <p>Konum Yetkisi: {geoPermission}</p>
      
      <button onClick={requestMotionPermission}>Hareket Sensörü İzni Al</button>
      <p>Hareket Sensörü Yetkisi: {motionPermission}</p>

      <p>Latitude: {location.latitude}</p>
      <p>Longitude: {location.longitude}</p>
      <p>Alpha (Cihaz Yönelimi): {orientation.alpha}°</p>
      <p>Kıble Açısı: {qiblaAngle}°</p>
      <p style={{ fontWeight: "bold", color: isFacingQibla ? "green" : "red" }}>
        {isFacingQibla === null ? "Yön belirleniyor..." : isFacingQibla ? "✅ Kıbleye Yöneliyorsunuz!" : "❌ Kıbleye Dönmelisiniz"}
      </p>

      {/* 🧭 Pusula Görseli */}
      <div style={{ position: "relative", width: "150px", height: "150px", margin: "20px auto" }}>
        <img src="/assets/compass.png" 
             alt="Compass" 
             style={{ width: "100%", height: "100%", transform: `rotate(${orientation.alpha}deg)`, transition: "transform 0.2s ease" }} />

        {/* 📍 Kullanıcının yönü */}
        <div style={{
          position: "absolute", width: "4px", height: "60px", backgroundColor: "blue",
          left: "50%", top: "50%", transform: `translate(-50%, -100%) rotate(${orientation.alpha}deg)`,
          transformOrigin: "bottom center"
        }}></div>

        {/* 🕋 Kıble yönü */}
        <div style={{
          position: "absolute", width: "4px", height: "60px", backgroundColor: "red",
          left: "50%", top: "50%", transform: `translate(-50%, -100%) rotate(${qiblaAngle}deg)`,
          transformOrigin: "bottom center"
        }}></div>
      </div>

      {/* 🌍 Harita */}
      {location.latitude && location.longitude && (
        <MapContainer center={[location.latitude, location.longitude]} zoom={14} style={{ height: "400px", width: "100%", marginTop: "10px" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
          
          {/* Kullanıcının konumu */}
          <Marker position={[location.latitude, location.longitude]} icon={new L.Icon({ iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png", iconSize: [25, 41], iconAnchor: [12, 41] })}>
            <Popup>
              📍 Konumunuz<br />
              Latitude: {location.latitude}<br />
              Longitude: {location.longitude}<br />
              🎯 Alpha: {orientation.alpha}°<br />
              🕋 Kıble Açısı: {qiblaAngle}°<br />
              {isFacingQibla ? "✅ Kıbleye Yöneliyorsunuz!" : "❌ Kıbleye Dönmelisiniz"}
            </Popup>
          </Marker>

          {/* 🔴 Kabe Konumu */}
          <Marker position={[KAABA_LAT, KAABA_LON]}>
            <Popup>🕋 Kabe</Popup>
          </Marker>

          {/* 📍 Kullanıcı → Kabe Arası Çizgi */}
          <Polyline positions={[[location.latitude, location.longitude], [KAABA_LAT, KAABA_LON]]} color="red" />

          <MapUpdater latitude={location.latitude} longitude={location.longitude} />
        </MapContainer>
      )}
    </div>
  );
};

export default MapComponent;
