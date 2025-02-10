import React, { useEffect, useState } from 'react';
import { Card, Button, Layout, Typography, Row, Col } from 'antd';

const {  Content, Footer } = Layout;
const {  Paragraph } = Typography;

const KibleYonTayini: React.FC = () => {
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [direction, setDirection] = useState<number | null>(null);
    const [distance, setDistance] = useState<number | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const kibleAcisi = calculateQiblaDirection(latitude, longitude);
                    const mesafe = calculateDistance(latitude, longitude);
                    setDirection(kibleAcisi);
                    setDistance(mesafe);
                },
                () => {
                    setError('Konum bilgisi alınamadı. Lütfen konum izni verin.');
                }
            );
        } else {
            setError('Cihaz konum bilgisi desteklenmiyor.');
        }

        if (typeof DeviceOrientationEvent !== 'undefined') {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

            if (isIOS && (DeviceOrientationEvent as any).requestPermission) {
                (DeviceOrientationEvent as any).requestPermission()
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

    const calculateDistance = (latitude: number, longitude: number): number => {
        const kaabaLatitude = 21.4225;
        const kaabaLongitude = 39.8262;
        const R = 6371; // Dünya'nın yarıçapı (km)

        const dLat = ((kaabaLatitude - latitude) * Math.PI) / 180;
        const dLon = ((kaabaLongitude - longitude) * Math.PI) / 180;

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((latitude * Math.PI) / 180) *
            Math.cos((kaabaLatitude * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Mesafe km cinsinden
    };

    return (
        <Layout style={{ minHeight: '100vh'}}>

            <Content style={{ padding: '20px' }}>
                <Row justify="center" align="middle">

                    <Col span={24} style={{ marginTop: '20px', textAlign: 'center' }}>
                        <Card bordered={true} style={{ maxWidth: 400, margin: 'auto' }}>
                            {!permissionGranted && (
                                <Button type="default" onClick={() => window.location.reload()}>
                                    İzin Ver ve Başlat
                                </Button>
                            )}

                            {error && <Paragraph type="danger">{error}</Paragraph>}

                            {direction !== null && (
                                <div style={{ position: 'relative', width: '160px', height: '160px', margin: 'auto' }}>
                                    <img
                                        src="/compass.png"
                                        alt="Pusula"
                                        style={{ width: '100%', height: '100%', transform: `rotate(${direction}deg)`, transition: 'transform 0.5s ease-in-out' }}
                                    />
                                    <img
                                        src="./assets/kaaba.png"
                                        alt="Kabe"
                                        style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '32px', height: '32px' }}
                                    />
                                    <Paragraph>Kıble Bu Yönde</Paragraph>
                                </div>
                            )}

                            {direction !== null && distance !== null && (
                                <div style={{ marginTop: '20px' }}>
                                    <Paragraph strong>Kıble Açısı: {direction.toFixed(2)}°</Paragraph>
                                    <Paragraph strong>Mesafe: {distance.toFixed(2)} km</Paragraph>
                                </div>
                            )}
                        </Card>
                    </Col>
                </Row>
            </Content>

            <Footer style={{ textAlign: 'center' }}>©2025 Kıble Yönü Belirleyici</Footer>
        </Layout>
    );
};

export default KibleYonTayini;
