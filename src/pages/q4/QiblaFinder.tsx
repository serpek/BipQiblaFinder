import {CSSProperties, useEffect, useState} from 'react';
import {Card, Col, Row, Statistic} from "antd";
import {ArrowDownOutlined} from "@ant-design/icons";

const style: CSSProperties = {padding: '8px'};


const directions = [
    {name: 'Kuzey', short: 'N', angle: 0},
    {name: 'Kuzeydoğu', short: 'NE', angle: 45},
    {name: 'Doğu', short: 'E', angle: 90},
    {name: 'Güneydoğu', short: 'SE', angle: 135},
    {name: 'Güney', short: 'S', angle: 180},
    {name: 'Güneybatı', short: 'SW', angle: 225},
    {name: 'Batı', short: 'W', angle: 270},
    {name: 'Kuzeybatı', short: 'NW', angle: 315},
];

const getLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            });
        } else {
            reject(new Error("Geolocation API desteklenmiyor."));
        }
    });
};

const getQiblaAngle = (latitude: number, longitude: number): number => {
    const makkahLat = 21.4225 * (Math.PI / 180);
    const makkahLng = 39.8262 * (Math.PI / 180);
    const userLat = latitude * (Math.PI / 180);
    const userLng = longitude * (Math.PI / 180);

    const deltaLng = makkahLng - userLng;
    const y = Math.sin(deltaLng);
    const x = Math.cos(userLat) * Math.tan(makkahLat) - Math.sin(userLat) * Math.cos(deltaLng);

    const angle = Math.atan2(y, x) * (180 / Math.PI);
    return (angle + 360) % 360; // 0-360 aralığında döner
};

const getDirectionName = (angle: number): { name: string, short: string } => {

    const index = Math.round(angle / 45) % 8;
    return directions[index];
};

const QiblaCompass = () => {
    const [qiblaAngle, setQiblaAngle] = useState<number>(0);
    const [deviceAngle, setDeviceAngle] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const position = await getLocation();
                const angle = getQiblaAngle(position.coords.latitude, position.coords.longitude);
                setQiblaAngle(angle);
            } catch (error: any) {
                console.error("Konum alınamadı:", error);
                setErrorMessage(error.message || "Konum alınamadı.");
            }
        };

        if (navigator.permissions) {
            navigator.permissions.query({name: 'geolocation'}).then((result) => {
                if (result.state === 'granted' || result.state === 'prompt') {
                    fetchLocation();
                } else {
                    setErrorMessage("Konum izni reddedildi. Lütfen tarayıcı ayarlarından izin verin.");
                }
            });
        } else {
            fetchLocation();
        }

        const handleOrientation = (event: DeviceOrientationEvent) => {
            if (event.alpha !== null) {
                setDeviceAngle(event.alpha);
            }
        };

        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', handleOrientation);
        }

        return () => window.removeEventListener('deviceorientation', handleOrientation);
    }, []);

    const rotation = (360 - deviceAngle) % 360; // Kullanıcının telefonu çevirdiği yöne göre pusulayı döndür
    const kaabaRotation = (qiblaAngle - deviceAngle + 360) % 360; // Kabe yönünü sabit tutmak için ayarlandı

    const qiblaDirection = getDirectionName(qiblaAngle);

    return (
        <div className="compass-container" style={{textAlign: 'center', marginTop: '50px'}}>
            {errorMessage && (
                <p style={{color: 'red', marginBottom: '10px'}}>{errorMessage}</p>
            )}

            <Row gutter={16}>
                <Col className="gutter-row" span={24} style={style}>
                    <Card bordered={false} title="Pusula">
                        <div
                            className="compass"
                            style={{
                                width: '300px',
                                height: '300px',
                                backgroundImage: 'url(/assets/compass-4.png)',
                                backgroundSize: 'cover',
                                borderRadius: '50%',
                                position: 'relative',
                                margin: '0 auto',
                                transform: `rotate(${rotation}deg)`,
                                transition: 'transform 0.5s ease-out',
                            }}
                        >
                            <img
                                src="/assets/kaaba.png" // Kaaba ikonunu buraya yerleştir
                                alt="Kaaba Icon"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: `translate(-50%, -50%) rotate(${kaabaRotation}deg) translateY(-120px)`,
                                    transformOrigin: 'center',
                                }}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className="gutter-row" span={12} style={style}>
                    <Card bordered={false} title="Kıble Yönü">
                        <Statistic
                            title={qiblaDirection.name}
                            value={qiblaAngle.toFixed(2)}
                            precision={2}
                            suffix={`° ${qiblaDirection.short}`}
                        />
                    </Card>
                </Col>
                <Col className="gutter-row" span={12} style={style}>
                    <Card bordered={false} title="Kıble Yönü">
                        <Statistic
                            title="Idle"
                            value={9.3}
                            precision={2}
                            valueStyle={{color: '#cf1322'}}
                            prefix={<ArrowDownOutlined/>}
                            suffix="%"
                        />
                    </Card>
                </Col>
            </Row>

        </div>
    );
};

export default QiblaCompass;
