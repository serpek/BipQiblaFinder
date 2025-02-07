import { Card, Button } from 'antd';
import React, { useEffect, useState } from 'react';

const KibleYonTayini: React.FC = () => {
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [direction, setDirection] = useState<number | null>(null);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const kibleAcisi = calculateQiblaDirection(latitude, longitude);
                    setDirection(kibleAcisi);
                },
                () => {
                    setError('Konum bilgisi alınamadı. Lütfen konum izni verin.');
                }
            );
        } else {
            setError('Cihaz konum bilgisi desteklenmiyor.');
        }

        if (typeof DeviceOrientationEvent !== 'undefined') {
            const requestPermission = (DeviceOrientationEvent as any).requestPermission;

            if (typeof requestPermission === 'function') {
                requestPermission()
                    .then((response: string) => {
                        if (response === 'granted') {
                            setPermissionGranted(true);
                            window.addEventListener('deviceorientation', handleOrientation);
                        } else {
                            setError('Cihaz sensör erişim izni verilmedi.');
                        }
                    })
                    .catch(() => {
                        setError('Sensör izni alınırken bir hata oluştu.');
                    });
            } else {
                setPermissionGranted(true);
                window.addEventListener('deviceorientation', handleOrientation);
            }
        }

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    const handleOrientation = (event: DeviceOrientationEvent) => {
        if (event.alpha !== null) {
            setDirection(event.alpha);
        } else {
            setError('Cihaz yön bilgisi okunamıyor.');
        }
    };

    const calculateQiblaDirection = (latitude: number, longitude: number): number => {
        const kaabaLatitude = 21.4225;
        const kaabaLongitude = 39.8262;
        const latRad = (Math.PI / 180) * latitude;
        const longDiff = (Math.PI / 180) * (kaabaLongitude - longitude);

        const y = Math.sin(longDiff);
        const x = Math.cos(latRad) * Math.tan((Math.PI / 180) * kaabaLatitude) - Math.sin(latRad) * Math.cos(longDiff);

        return (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360;
    };

    return (
        <div className={
            `flex flex-col items-center justify-center min-h-screen p-4 transition-colors duration-500 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'
            }`
        }>
            <Card className="w-full max-w-sm shadow-xl rounded-2xl">
                <div className="flex flex-col items-center p-6">
                    <h1 className="text-2xl font-bold mb-4">Kıble Yönü Belirleyici</h1>
                    <Button onClick={() => setDarkMode(!darkMode)} className="mb-4">
                        {darkMode ? 'Aydınlık Mod' : 'Karanlık Mod'}
                    </Button>
                    {!permissionGranted && (
                        <Button onClick={() => window.location.reload()} className="mb-4">
                            İzin Ver ve Başlat
                        </Button>
                    )}
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {direction !== null && (
                        <div className="relative w-40 h-40 border-4 border-blue-500 rounded-full flex items-center justify-center">
                            <div
                                className="absolute w-2 h-20 bg-gradient-to-b from-red-500 to-yellow-500 rounded-md origin-bottom transition-transform duration-500 ease-in-out"
                                style={{ transform: `rotate(${direction}deg)` }}
                            ></div>
                            <p className="absolute bottom-2 text-sm">Kıble Bu Yönde</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default KibleYonTayini;
