import React, {PropsWithChildren, useCallback, useEffect, useMemo, useState} from 'react';
import {Button, Card, Carousel, Col, Layout, Modal, Result, Row, Statistic, Tabs, TabsProps, Typography} from "antd";
import {AndroidOutlined, AppleOutlined, CloseCircleOutlined} from "@ant-design/icons";
import * as motion from "motion/react-client"
import useImage from "use-image";
import {Circle, Image, Layer, Stage} from "react-konva";

import {useGeolocated, useOrientation} from "../../hooks";
import {getDirectionName, getQiblaAngle, toFixed} from "../../utils";

import './QiblaFinderQ5.css'

const {useModal} = Modal;
const {Meta} = Card;

const {Paragraph, Text} = Typography;
type ErrorViewProps = PropsWithChildren<{
    locationGranted: boolean
    locationActive: boolean
    orientationGranted: boolean
    requestPermissionClick: () => void
}>

const ErrorView = (props: ErrorViewProps) => {
    if (props.locationActive && props.locationGranted && props.orientationGranted) return null

    return <Result
        status="error"
        title="Tarayıcı Desteklenmiyor"
        subTitle="Tarayıcı konum veya sensör bilgilerine erişemiyor"
        extra={[
            <Button type="primary" key="console" onClick={props.requestPermissionClick}>Yetki vermek denemek için
                tıklayınız</Button>,
        ]}>
        <div className="desc">
            <Paragraph>
                <Text strong style={{fontSize: 16}}>
                    Sebebi aşağıdakilerden biri olabilir.
                </Text>
            </Paragraph>
            {!props.orientationGranted && (<Paragraph>
                <CloseCircleOutlined className="site-result-demo-error-icon"/> Tarayıcınızın sensör bilgileri
                okunamıyor.
            </Paragraph>)}
            {!props.locationActive && (<Paragraph>
                <CloseCircleOutlined className="site-result-demo-error-icon"/> Tarayıcınızın lokasyon bilgileri
                sağlamıyor.
            </Paragraph>)}
            {!props.locationGranted && <>
                <Paragraph>
                    <CloseCircleOutlined className="site-result-demo-error-icon"/> Tarayıcınızda lokasyon yetkilerini
                    vermemiş veya reddetmiş olabilirsiniz.
                </Paragraph>
                <Paragraph>
                    <CloseCircleOutlined className="site-result-demo-error-icon"/> Sisteminizdeki güvenlik kuralları
                    lokasyon bilgileri paylaşmanıza izin vermiyor olabilir.
                </Paragraph>
            </>}
        </div>
    </Result>
}

const CalibrateView = () => {
    const items: TabsProps['items'] = [
        {
            key: '1', icon: <AppleOutlined/>, label: 'IOS', children: <Carousel arrows infinite={false}>
                <div>
                    <Card
                        title="iPhone Pusula Kalibrasyonu Nasıl Açılır"
                        style={{width: '100%', border: 0}}
                        cover={<img alt="1. Adım" style={{width: '50%'}} src="/assets/img_0344.webp"/>}>
                        <Meta title="1. Adım"
                              description="Ayarlar uygulamasını açın ve Gizlilik ve Güvenlik'e dokunun."/>
                    </Card>
                </div>
                <div>
                    <Card
                        title="iPhone Pusula Kalibrasyonu Nasıl Açılır"
                        style={{width: '100%', border: 0}}
                        cover={<img alt="2. Adım" style={{width: '50%'}} src="/assets/img_0345.webp"/>}>
                        <Meta title="2. Adım" description="Konum Servisleri'ne dokunun."/>
                    </Card>
                </div>
                <div>
                    <Card
                        title="iPhone Pusula Kalibrasyonu Nasıl Açılır"
                        style={{width: '100%', border: 0}}
                        cover={<img alt="3. Adım" style={{width: '50%'}} src="/assets/img_0346.webp"/>}>
                        <Meta title="3. Adım" description="Sayfanın alt kısmındaki Sistem Hizmetleri'ne dokunun."/>
                    </Card>
                </div>
                <div>
                    <Card
                        title="iPhone Pusula Kalibrasyonu Nasıl Açılır"
                        style={{width: '100%', border: 0}}
                        cover={<img alt="4. Adım" style={{width: '50%'}} src="/assets/img_0347.webp"/>}>
                        <Meta title="4. Adım"
                              description="Pusula Kalibrasyonunun açık olduğundan emin olun . Etkinleştirildiğinde, geçiş yeşil ve sağda olacaktır."/>
                    </Card>
                </div>
                <div>
                    <Card
                        title="True North'un Kapalı Olduğundan Emin Olun"
                        style={{width: '100%', border: 0}}
                        cover={<img alt="1. Adım" style={{width: '50%'}} src="/assets/img_0348_0.webp"/>}>
                        <Meta title="1. Adım"
                              description="Ayarlar uygulamasını açın ve Uygulamalar'a dokunun."/>
                    </Card>
                </div>
                <div>
                    <Card
                        title="True North'un Kapalı Olduğundan Emin Olun"
                        style={{width: '100%', border: 0}}
                        cover={<img alt="2. Adım" style={{width: '50%'}} src="/assets/img_0349.webp"/>}>
                        <Meta title="2. Adım"
                              description="Pusula uygulamasını listede kaydırarak veya arama çubuğunu kullanarak bulabilirsiniz."/>
                    </Card>
                </div>
                <div>
                    <Card
                        title="True North'un Kapalı Olduğundan Emin Olun"
                        style={{width: '100%', border: 0}}
                        cover={<img alt="3. Adım" style={{width: '50%'}} src="/assets/img_0350_1.webp"/>}>
                        <Meta title="3. Adım"
                              description="Gerçek Kuzeyi sola doğru çevirin , böylece yeşil renkten gri renge döner."/>
                    </Card>
                </div>
            </Carousel>
        },
        {
            key: '2', icon: <AndroidOutlined/>, label: 'Android', children: <Carousel arrows infinite={false}>
                <div>
                    <Card
                        style={{width: '100%', border: 0}}
                        cover={<img alt="example" src="/assets/compass-calibration-1.gif"/>}>
                        <Meta title="1. Yöntem: Şekil 8 desen yöntemi"/>

                        <Paragraph>
                            <Paragraph>- Android cihazınızı açın.</Paragraph>
                            <Paragraph>- Telefonunuzu tutun ve pusulanız kalibre olana kadar havada bir 8 rakamı deseni
                                yapın.
                                Genellikle, 8 rakamı hareketini sadece birkaç kez yapmanız gerekecektir.</Paragraph>
                            <Paragraph>- Pusulanın doğru yönü gösterdiğini doğrulamak için tercih ettiğiniz navigasyon
                                uygulamasını (örneğin, Google Haritalar) açın.</Paragraph>
                        </Paragraph>
                    </Card>
                </div>
                <div>
                    <Card
                        style={{width: '100%', border: 0}}
                        cover={<img alt="example" src="/assets/compass-calibration-2.gif"/>}>
                        <Meta title="2. Yöntem: Telefon Eğimi yöntemi"/>
                        <Paragraph>
                            <Paragraph>- Android cihazınızı açın</Paragraph>
                            <Paragraph>- Telefonunuzu öne arkaya eğmeye başlayın. (Başınızı aşağı yukarı sallamak
                                gibi).</Paragraph>
                            <Paragraph>- SOL taraftan SAĞ tarafa TAŞI.</Paragraph>
                            <Paragraph>- Tekrar eğin, ancak bu sefer SOL'a ve sonra SAĞ'a eğin</Paragraph>
                            <Paragraph>- Pusulanızın yeniden kalibre edildiğini görene kadar bu adımları tekrarlamaya
                                devam
                                edin.</Paragraph>
                        </Paragraph>
                    </Card>
                </div>
            </Carousel>
        }
    ];

    return <Tabs
        defaultActiveKey="1"
        centered={true}
        items={items}
    />

}

const CompassView = ({rotate, width, height}: { rotate: number, width: number, height: number }) => {
    const [image] = useImage("/assets/compass-4.png");

    const offsetWidth = useMemo(() => (width / 2), []);
    const offsetHeight = useMemo(() => (width / 2), []);

    return <Stage width={width} height={height}>
        <Layer>
            <Circle
                x={offsetWidth}
                y={offsetHeight}
                width={width}
                height={height}
                fill="red"
                rotation={rotate}
                image={image}
            />
            <Image
                x={offsetWidth}
                y={offsetHeight}
                offsetX={offsetWidth}
                offsetY={offsetHeight}
                width={width}
                height={height}
                image={image}
                rotation={rotate}
            />
        </Layer>
    </Stage>
}

const Pusula: React.FC = () => {
    const [modal, contextHolder] = useModal()
    const {orientation, isOrientationGranted, requestPermission} = useOrientation();
    const {coords, isGeolocationAvailable, isGeolocationEnabled, getPosition} =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: true,
            },
            userDecisionTimeout: 5000,
        });

    const [deviceAngle, setDeviceAngle] = useState<number>(0);
    const [deviceDirection, setDeviceDirection] = useState<string>('');
    const [qiblaAngle, setQiblaAngle] = useState<number>(0);
    const [qiblaDirection, setQiblaDirection] = useState<string>('');
    //const lastRotation = useRef<number>(0);
    /*const smoothRotation = (newAngle: number) => {
        let delta = newAngle - lastRotation.current;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;

        lastRotation.current = (lastRotation.current + delta) % 360;
        if (lastRotation.current < 0) lastRotation.current += 360;

        return lastRotation.current;
    };*/

    useEffect(() => {
        if (orientation?.absolute) {
            Modal.destroyAll();
            modal.info({
                icon: null,
                title: 'Pusulanızı Kalibre Edin',
                content: <CalibrateView/>
            })
        }
    }, [orientation]);

    useEffect(() => {
        if (orientation?.alpha) {
            setDeviceAngle((360 - orientation.alpha) % 360)
        }
    }, [orientation]);

    useEffect(() => {
        if (coords) {
            setQiblaAngle(() => getQiblaAngle(coords.latitude, coords.longitude))
        }
    }, [coords]);

    useEffect(() => {
        const direction = getDirectionName(deviceAngle);
        setDeviceDirection(direction.name)
    }, [deviceAngle]);

    useEffect(() => {
        if (qiblaAngle) {
            const direction = getDirectionName(qiblaAngle);
            setQiblaDirection(direction.name)

        }
    }, [qiblaAngle]);

    const anglePoint = useCallback(() => {
        return (
            (qiblaAngle < Math.abs(deviceAngle) &&
                qiblaAngle + 15 > Math.abs(deviceAngle)) ||
            qiblaAngle > Math.abs(deviceAngle + 15) ||
            qiblaAngle < Math.abs(deviceAngle)
        )
    }, [deviceAngle])

    //const rotation = smoothRotation((360 - deviceAngle) % 360);
    const isError = !(isGeolocationAvailable || isGeolocationEnabled || isOrientationGranted)

    return (
        <Layout>
            {contextHolder}

            {isError &&
                <ErrorView
                    locationActive={isGeolocationAvailable}
                    locationGranted={isGeolocationEnabled}
                    orientationGranted={isOrientationGranted}
                    requestPermissionClick={() => window.location.reload()}/>
            }

            {!isError &&
                <>
                    {coords ? (
                        <>
                            <Row gutter={16} justify="center" style={{marginBottom: 5}}>
                                <Col className="gutter-row" span={24}>
                                    <Card bordered={false} title="Kıble Pusulası">
                                        <CompassView rotate={deviceAngle} width={300} height={300}/>
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
                                                transform: `rotate(${deviceAngle}deg)`,
                                                transition: 'transform 0.5s ease-out',
                                            }}
                                        >
                                            <div style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                width: '40px',
                                                height: '40px',
                                                transform: `rotate(${qiblaAngle}deg) translateY(-60px) translate(-80%, -80%)`,
                                                transformOrigin: 'center'
                                            }}>
                                                <motion.div
                                                    initial={{scale: 1, opacity: 0.8}}
                                                    animate={{scale: [.7, 1.5, .7], opacity: [0.8, 0, 0.8]}}
                                                    transition={{duration: 2, repeat: Infinity, ease: "easeInOut"}}
                                                    style={{
                                                        position: 'absolute',
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        background: 'rgba(0,255,4,0.4)',
                                                        zIndex: 0,
                                                    }}
                                                ></motion.div>
                                                <img
                                                    src="/assets/kaaba.png"
                                                    alt="Kaaba Icon"
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        transformOrigin: 'center',
                                                        transition: 'transform 0.5s ease-out',
                                                        zIndex: 1,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            </Row>
                            <Row gutter={16} style={{marginBottom: 5}}>
                                <Col className="gutter-row" span={12}>
                                    <Card bordered={false} title="Pusula Yönü">
                                        <Row align="stretch" justify="center">
                                            <Col>
                                                <svg
                                                    width="50"
                                                    height="50"
                                                    viewBox="0 0 100 100"
                                                    style={{
                                                        transform: `rotate(${deviceAngle}deg)`,
                                                        margin: '0 auto',
                                                        transition: 'transform 0.5s ease-out',
                                                        background: '#efefef',
                                                        borderRadius: '50%'
                                                    }}
                                                >
                                                    <polygon points="50,10 60,40 50,30 40,40" fill="red"/>
                                                </svg>
                                                <Statistic
                                                    title={deviceDirection}
                                                    value={deviceAngle.toFixed(0)}
                                                    precision={2}
                                                    suffix={`°`}
                                                />
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Card bordered={false} title="Kıble Yönü">
                                        <Row align="stretch" justify="center">
                                            <Col>
                                                <svg
                                                    width="50"
                                                    height="50"
                                                    viewBox="0 0 100 100"
                                                    style={{
                                                        transform: `rotate(${qiblaAngle}deg)`,
                                                        margin: '0 auto',
                                                        transition: 'transform 0.5s ease-out',
                                                        background: '#efefef',
                                                        borderRadius: '50%'
                                                    }}
                                                >
                                                    <polygon points="50,10 60,40 50,30 40,40" fill="red"/>
                                                </svg>
                                                <Statistic
                                                    title={qiblaDirection}
                                                    value={qiblaAngle.toFixed(0)}
                                                    suffix="°"
                                                />
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        </>) : (
                        <>

                            <Row gutter={16} justify="center">
                                <Col className="gutter-row">
                                    <Button onClick={getPosition}>Pozisyonu Al</Button>
                                </Col>
                                <Col className="gutter-row">
                                    <Button onClick={requestPermission}>Sensör Bilgilerini Al</Button>
                                </Col>
                            </Row>
                        </>)
                    }
                </>}


            <Row gutter={16}>
                <Col className="gutter-row" span={24}>
                    {coords && (
                        <table className="compass-table">
                            <tbody>
                            <tr>
                                <th>anglePoint</th>
                                <td>{`${anglePoint()}`}</td>
                            </tr>
                            <tr>
                                <th>latitude</th>
                                <td>{toFixed(coords.latitude, 2)}</td>
                            </tr>
                            <tr>
                                <th>longitude</th>
                                <td>{toFixed(coords.longitude, 2)}</td>
                            </tr>
                            <tr>
                                <th>absolute</th>
                                <td>{orientation?.absolute ? '1' : '0'}</td>
                            </tr>
                            <tr>
                                <th>alpha</th>
                                <td>{orientation?.alpha}</td>
                            </tr>
                            <tr>
                                <th>Notrh</th>
                                <td>
                                    <span style={{color: !orientation?.absolute ? 'green' : 'red'}}>
                                        {!orientation?.absolute ? 'Gerçek Kuzey Kullanılıyor' : 'Manyetik Kuzey Kullanılıyor'}
                                    </span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    )}
                </Col>
            </Row>
        </Layout>
    );
};

export default Pusula;